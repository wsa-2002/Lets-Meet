import typing
from datetime import datetime, date
import random
from typing import Optional, Sequence, Union

from fastapi import APIRouter, responses, Depends
from pydantic import BaseModel, Json

from base import enums, model, vo
import const
from middleware.envelope import enveloped
from middleware.headers import get_auth_token
from middleware.context import request
import persistence.database as db
import exceptions as exc  # noqa


from .util import parse_filter, parse_sorter, timezone_validate, update_status, compose_host_and_member_info, MemberInfo

router = APIRouter(
    tags=['Meet'],
    default_response_class=responses.JSONResponse,
    dependencies=[Depends(get_auth_token)]
)


class AddMeetInput(BaseModel):
    meet_name: str
    start_date: date
    end_date: date
    start_time_slot_id: int
    end_time_slot_id: int
    gen_meet_url: bool
    guest_name: Optional[str] = None
    voting_end_time: Optional[datetime] = None
    description: Optional[str] = None
    member_ids: Optional[Sequence[int]] = None
    emails: Optional[Sequence[str]] = None


class ReadMeetOutput(BaseModel):
    id: int
    status: Union[enums.StatusType, str]
    start_date: date
    end_date: date
    start_time_slot_id: int
    end_time_slot_id: int
    meet_name: str
    invite_code: str
    gen_meet_url: bool
    voting_end_time: Optional[datetime] = None
    finalized_start_time: Optional[datetime] = None
    finalized_end_time: Optional[datetime] = None
    meet_url: Optional[str] = None
    description: Optional[str] = None
    host_info: Optional[MemberInfo] = None
    member_infos: Optional[Sequence[MemberInfo]] = None


@router.post('/meet')
@enveloped
async def add_meet(data: AddMeetInput) -> ReadMeetOutput:
    try:
        host_account_id = request.account.id
    except exc.NoPermission:
        if not data.guest_name:
            raise exc.IllegalInput
        host_account_id = None

    if data.start_date > data.end_date or data.start_time_slot_id > data.end_time_slot_id:
        raise exc.IllegalInput

    converted_voting_end_time = timezone_validate(data.voting_end_time) if data.voting_end_time else None
    if converted_voting_end_time and converted_voting_end_time < datetime.now():
        raise exc.IllegalInput

    if not 0 < data.start_time_slot_id < 49 and not 0 < data.end_time_slot_id < 49:
        raise exc.IllegalInput

    invite_code = ''.join(random.choice(const.AVAILABLE_CODE_CHAR) for _ in range(const.INVITE_CODE_LENGTH))
    meet_id = await db.meet.add(
        title=data.meet_name,
        invite_code=invite_code,
        start_date=data.start_date,
        end_date=data.end_date,
        start_time_slot_id=data.start_time_slot_id,
        end_time_slot_id=data.end_time_slot_id,
        voting_end_time=converted_voting_end_time,
        gen_meet_url=data.gen_meet_url,
        host_member_id=host_account_id,
        member_ids=data.member_ids,
        description=data.description
    )
    # TODO: send email to members and emails

    meet = await db.meet.read(meet_id=meet_id)
    try:
        account_id = request.account.id
    except exc.NoPermission:
        account_id = None
    meet.status = await update_status(meet.id, meet, request.time, account_id)
    host, member_infos = await compose_host_and_member_info(meet_id=meet.id)


    return ReadMeetOutput(
        id=meet.id,
        status=meet.status,
        start_date=meet.start_date,
        end_date=meet.end_date,
        start_time_slot_id=meet.start_time_slot_id,
        end_time_slot_id=meet.end_time_slot_id,
        voting_end_time=meet.voting_end_time,
        meet_name=meet.title,
        invite_code=meet.invite_code,
        gen_meet_url=meet.gen_meet_url,
        finalized_start_time=meet.finalized_start_time,
        finalized_end_time=meet.finalized_end_time,
        meet_url=meet.meet_url,
        description=meet.description,
        host_info=host,
        member_infos=member_infos,
    )


@router.get('/meet/{meet_id}')
@enveloped
async def read_meet(meet_id: int, name: Optional[str] = None) -> ReadMeetOutput:
    if name and not await db.meet.is_authed(meet_id, name=name):
        raise exc.NoPermission
    elif not name and not await db.meet.is_authed(meet_id, request.account.id):
        raise exc.NoPermission

    meet = await db.meet.read(meet_id=meet_id)
    try:
        account_id = request.account.id
    except exc.NoPermission:
        account_id = None
    meet.status = await update_status(meet.id, meet, request.time, account_id)
    host, member_infos = await compose_host_and_member_info(meet_id=meet.id)


    return ReadMeetOutput(
        id=meet.id,
        status=meet.status,
        start_date=meet.start_date,
        end_date=meet.end_date,
        start_time_slot_id=meet.start_time_slot_id,
        end_time_slot_id=meet.end_time_slot_id,
        voting_end_time=meet.voting_end_time,
        meet_name=meet.title,
        invite_code=meet.invite_code,
        gen_meet_url=meet.gen_meet_url,
        finalized_start_time=meet.finalized_start_time,
        finalized_end_time=meet.finalized_end_time,
        meet_url=meet.meet_url,
        description=meet.description,
        host_info=host,
        member_infos=member_infos,
    )


@router.delete('/meet/{meet_id}')
@enveloped
async def delete_meet(meet_id: int) -> None:
    meet_members = await db.meet.get_member_id_and_auth(meet_id=meet_id)
    try:
        is_host = meet_members[request.account.id]
    except KeyError:
        raise exc.NoPermission

    if is_host:
        await db.meet.delete(meet_id)
    else:
        await db.meet.leave(meet_id, request.account.id)


class EditMeetInput(BaseModel):
    title: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    start_time_slot_id: Optional[int] = None
    end_time_slot_id: Optional[int] = None
    description: Optional[str] = None
    voting_end_time: Optional[datetime] = None
    gen_meet_url: Optional[bool] = False


@router.patch('/meet/[meet_id}')
@enveloped
async def edit_meet(meet_id: int, data: EditMeetInput) -> None:
    if not await db.meet.is_authed(meet_id=meet_id, member_id=request.account.id, only_host=True):
        raise exc.NoPermission

    meet = await db.meet.read(meet_id=meet_id)
    meet.start_date = data.start_date or meet.start_date
    meet.end_date = data.end_date or meet.end_date
    meet.start_time_slot_id = data.start_time_slot_id or meet.start_time_slot_id
    meet.end_time_slot_id = data.end_time_slot_id
    meet.voting_end_time = data.voting_end_time or meet.voting_end_time

    if meet.start_date > meet.end_date:
        raise exc.IllegalInput

    if meet.start_time_slot_id > meet.end_time_slot_id:
        raise exc.IllegalInput

    status = enums.StatusType.voting
    if meet.voting_end_time and meet.voting_end_time < request.time:
        status = enums.StatusType.waiting_for_confirm

    await db.meet.edit(
        meet_id=meet_id,
        title=data.title,
        start_date=data.start_date,
        end_date=data.end_date,
        start_time_slot_id=data.start_time_slot_id,
        end_time_slot_id=data.end_time_slot_id,
        description=data.description,
        voting_end_time=timezone_validate(data.voting_end_time),
        gen_meet_url=data.gen_meet_url,
        status=status,
    )


BROWSE_MEET_COLUMNS = {
    'name': str,
    'host': str,
    'status': enums.StatusType,
    'start_date': date,
    'end_date': date,
    'voting_end_time': datetime,
}


async def meet_filter(filters: typing.Optional[Json] = None) -> Sequence[model.Filter]:
    return parse_filter(BROWSE_MEET_COLUMNS, filters)


async def meet_sorter(sorters: typing.Optional[Json] = None) -> Sequence[model.Sorter]:
    return parse_sorter(BROWSE_MEET_COLUMNS, sorters)


@router.get('/meet')
@enveloped
async def browse_meet(filters: Sequence[model.Filter] = Depends(meet_filter),
                      sorters: Sequence[model.Sorter] = Depends(meet_sorter))\
        -> Sequence[vo.BrowseMeetByAccount]:
    # TODO: find ways to use partial function in Depends

    meets = await db.meet.browse_by_account_id(account_id=request.account.id, filters=filters, sorters=sorters)
    for i, meet in enumerate(meets):
        meet.status = await update_status(meet.meet_id, meet, request.time, request.account.id)
        meets[i] = meet

    return meets


class JoinMeetInput(BaseModel):
    invite_code: str
    name: Optional[str]


@router.post('/meet/invite')
@enveloped
async def join_meet_by_invite_code(data: JoinMeetInput):
    try:
        account_id = request.account.id
    except exc.NoPermission:
        if not data.name:
            raise exc.IllegalInput
        account_id = None

    meet = await db.meet.read_meet_by_code(invite_code=data.invite_code)
    await db.meet.add_member(meet_id=meet.id, account_id=account_id, name=data.name)
    try:
        account_id = request.account.id
    except exc.NoPermission:
        account_id = None
    meet.status = await update_status(meet.id, meet, request.time, account_id)
    host, member_infos = await compose_host_and_member_info(meet_id=meet.id)


    return ReadMeetOutput(
        id=meet.id,
        status=meet.status,
        start_date=meet.start_date,
        end_date=meet.end_date,
        start_time_slot_id=meet.start_time_slot_id,
        end_time_slot_id=meet.end_time_slot_id,
        voting_end_time=meet.voting_end_time,
        meet_name=meet.title,
        invite_code=meet.invite_code,
        gen_meet_url=meet.gen_meet_url,
        finalized_start_time=meet.finalized_start_time,
        finalized_end_time=meet.finalized_end_time,
        meet_url=meet.meet_url,
        description=meet.description,
        host_info=host,
        member_infos=member_infos,
    )


@router.get('/meet/invite/{invite_code}')
@enveloped
async def read_meet_by_code(invite_code: str) -> ReadMeetOutput:
    meet = await db.meet.read_meet_by_code(invite_code=invite_code)
    meet_id = meet.id

    meet = await db.meet.read(meet_id=meet_id)
    try:
        account_id = request.account.id
    except exc.NoPermission:
        account_id = None
    meet.status = await update_status(meet.id, meet, request.time, account_id)
    host, member_infos = await compose_host_and_member_info(meet_id=meet.id)

    return ReadMeetOutput(
        id=meet.id,
        status=meet.status,
        start_date=meet.start_date,
        end_date=meet.end_date,
        start_time_slot_id=meet.start_time_slot_id,
        end_time_slot_id=meet.end_time_slot_id,
        voting_end_time=meet.voting_end_time,
        meet_name=meet.title,
        invite_code=meet.invite_code,
        gen_meet_url=meet.gen_meet_url,
        finalized_start_time=meet.finalized_start_time,
        finalized_end_time=meet.finalized_end_time,
        meet_url=meet.meet_url,
        description=meet.description,
        host_info=host,
        member_infos=member_infos,
    )
