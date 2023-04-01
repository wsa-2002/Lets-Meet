from fastapi import APIRouter, responses, Depends
from pydantic import BaseModel
from dataclasses import dataclass
from middleware.headers import get_auth_token
from middleware.envelope import enveloped
from middleware.context import request
import persistence.database as db
import exceptions as exc  # noqa
from base.enums import WeekDayType

router = APIRouter(
    tags=['Routine'],
    default_response_class=responses.JSONResponse,
    dependencies=[Depends(get_auth_token)]
)

class Routine(BaseModel):
    weekday: WeekDayType
    time_slot_id: int

def getWeekdayValue(weekday: str):
    if(weekday == 'MON'):
      return 1
    elif(weekday == 'TUE'):
      return 2
    elif(weekday == 'WED'):
      return 3
    elif(weekday == 'THU'):
      return 4
    elif(weekday == 'FRI'):
      return 5
    elif(weekday == 'SAT'):
      return 6
    else: return 7

@router.post('/routine')
@enveloped
async def add_routine(data: Routine):
    account_id = request.account.id
    await db.routine.add(account_id=account_id, weekday=data.weekday, time_slot_id=data.time_slot_id)
    
@router.delete('/routine')
@enveloped
async def delete_routine(data: Routine):
    account_id = request.account.id
    await db.routine.delete(account_id=account_id, weekday=data.weekday, time_slot_id=data.time_slot_id)
    
@router.get('/routine')
@enveloped
async def get_routine():
    account_id = request.account.id
    try: 
      routines = await db.routine.get(account_id=account_id)
    except exc.NotFound:
        pass
    
    routines.sort(key=lambda x: (getWeekdayValue(x.weekday), x.time_slot_id)) # sort by weekday (mon to sun) then sort by time_slot_id
    return [Routine(weekday=routine.weekday, time_slot_id=routine.time_slot_id) for routine in routines]
    
    

