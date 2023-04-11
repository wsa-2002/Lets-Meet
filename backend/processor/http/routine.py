from typing import Sequence

from fastapi import APIRouter, responses, Depends
from pydantic import BaseModel

from middleware.headers import get_auth_token
from middleware.envelope import enveloped
from middleware.context import request
import persistence.database as db
from base.enums import WeekDayType

router = APIRouter(
    tags=['Routine'],
    default_response_class=responses.JSONResponse,
    dependencies=[Depends(get_auth_token)]
)


class Routine(BaseModel):
    weekday: WeekDayType
    time_slot_id: int


weekdayValue = {
    'MON': 1,
    'TUE': 2,
    'WED': 3,
    'THU': 4,
    'FRI': 5,
    'SAT': 6,
    'SUN': 7
}


@router.post('/routine', response_model=None)
@enveloped
async def add_routine(data: Routine) -> None:
    account_id = request.account.id
    await db.routine.add(account_id=account_id, weekday=data.weekday, time_slot_id=data.time_slot_id)


@router.delete('/routine', response_model=None)
@enveloped
async def delete_routine(data: Routine) -> None:
    account_id = request.account.id
    await db.routine.delete(account_id=account_id, weekday=data.weekday, time_slot_id=data.time_slot_id)


@router.get('/routine/account/{account_id}', response_model=Sequence[Routine])
@enveloped
async def get_routine(account_id: int) -> Sequence[Routine]:
    routines = await db.routine.get(account_id=account_id)

    routines.sort(key=lambda x: (weekdayValue[x.weekday], x.time_slot_id)) # sort by weekday (mon to sun) then sort by time_slot_id
    return [Routine(weekday=routine.weekday, time_slot_id=routine.time_slot_id) for routine in routines]
    
    

