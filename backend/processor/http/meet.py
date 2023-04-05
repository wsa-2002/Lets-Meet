from datetime import datetime, date, time
import random
from typing import Optional, Sequence

from fastapi import APIRouter, responses, Depends
from pydantic import BaseModel

from base import enums
import const
from middleware.envelope import enveloped
from middleware.headers import get_auth_token
from middleware.context import request
import persistence.database as db
import exceptions as exc  # noqa


from .util import timezone_validate

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
    voting_end_time: Optional[datetime] = None
    description: Optional[str] = None
    member_ids: Optional[Sequence[int]] = None
    emails: Optional[Sequence[str]] = None


class AddMeetOutput(BaseModel):
    id: int


@router.post('/meet')
@enveloped
async def add_meet(data: AddMeetInput) -> AddMeetOutput:
    try:
        host_account_id = request.account.id
    except AttributeError:
        host_account_id = None
    invite_code = ''.join(random.choice(const.AVAILABLE_CODE_CHAR) for _ in range(const.INVITE_CODE_LENGTH))
    meet_id = await db.meet.add(
        title=data.meet_name,
        invite_code=invite_code,
        start_date=data.start_date,
        end_date=data.end_date,
        start_time_slot_id=data.start_time_slot_id,
        end_time_slot_id=data.end_time_slot_id,
        voting_end_time=timezone_validate(data.voting_end_time),
        gen_meet_url=data.gen_meet_url,
        host_member_id=host_account_id,
        member_ids=data.member_ids,
    )
    # TODO: send email to members and emails
    return AddMeetOutput(id=meet_id)


class ReadMeetOutput(BaseModel):
    id: int
    status: enums.StatusType
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
    host_id: Optional[int] = None
    member_ids: Optional[Sequence[int]] = None


@router.get('/meet/{meet_id}')
@enveloped
async def read_meet(meet_id: int, name: Optional[str] = None) -> ReadMeetOutput:
    if name and not db.meet.is_authed(meet_id, name=name):
        raise exc.NoPermission
    elif not await db.meet.is_authed(meet_id, request.account.id):
        raise exc.NoPermission
    meet = await db.meet.read(meet_id=meet_id)
    member_auth = await db.meet.get_member_id_and_auth(meet_id)
    host_id = None
    member_ids = []
    for k, v in member_auth.items():
        if v:
            host_id = k
        else:
            member_ids.append(k)
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
        host_id=host_id,
        member_ids=member_ids,
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
    await db.meet.edit(
        meet_id=meet_id,
        title=data.title,
        start_date=data.start_date,
        end_date=data.end_date,
        start_time_slot_id=data.start_time_slot_id,
        end_time_slot_id=data.end_time_slot_id,
        description=data.description,
        voting_end_time=data.voting_end_time,
        gen_meet_url=data.gen_meet_url,
    )
