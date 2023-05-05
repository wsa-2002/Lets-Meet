from fastapi import FastAPI
from pydantic import BaseModel
from fastapi_utils.tasks import repeat_every
from dataclasses import dataclass
from middleware.headers import get_auth_token
from middleware.envelope import enveloped
from middleware.context import request
import persistence.database as db
from fastapi import APIRouter
import persistence.email as email
from datetime import datetime, timedelta    
from .util import timezone_validate


router = APIRouter()


@router.on_event("startup")
@repeat_every(seconds=60)
async def remind_voting():
    now = datetime.now()
    start_time = now + timedelta(days=1)
    end_time = start_time + timedelta(minutes=1)
    accounts = await db.account.get_not_yet_vote_emails(
        start_time=timezone_validate(start_time),
        end_time=timezone_validate(end_time),
    )
    for account in accounts:
        await email.voting_notification.send(to=account.email, meet_title=account.meet_title, 
                                             user_name=account.username, meet_code=account.meet_code,
                                             end_time=account.time)


@router.on_event("startup")
@repeat_every(seconds=60 * 30) # 30min
async def remind_event():
    now = datetime.now()
    start_time = (now + timedelta(days = 1))
    end_time = (start_time + timedelta(minutes = 30))
    accounts = await db.account.get_event_member_emails(start_time=start_time.time(),
                                                        end_time=end_time.time(), start_date=start_time.date())
    for account in accounts:
        await email.meet_reminding.send(to=account.email, meet_title=account.meet_title,
                                        user_name=account.username, meet_code=account.meet_code,
                                        start_time=account.time)


     

