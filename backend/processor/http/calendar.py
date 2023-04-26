from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from fastapi import APIRouter, Depends, Request, responses
from starlette.responses import RedirectResponse
from security import encode_jwt
from middleware.context import request
from middleware.envelope import enveloped
from middleware.headers import get_auth_token
import persistence.database as db
import exceptions as exc  # noqa
from uuid import uuid4
import os
from config import google_config, service_config
from service.calendar import meet_calendar
from datetime import datetime, date

router = APIRouter(
    tags=['Calendar'],
    default_response_class=responses.JSONResponse,
    dependencies=[Depends(get_auth_token)]
)

os.environ['GOOGLE_CLIENT_ID'] = google_config.GOOGLE_CLIENT_ID
os.environ['GOOGLE_CLIENT_SECRET'] = google_config.GOOGLE_CLIENT_SECRET

config = Config()
google_client_id = config('GOOGLE_CLIENT_ID')
google_client_secret = config('GOOGLE_CLIENT_SECRET')
oauth = OAuth(config)


# @router.get('/google-calendar')
# async def login(request: Request):
#     redirect_uri = request.url_for('auth')
#     return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get('/meet-calendar')
@enveloped
async def get_event(start_date: date, end_date: date):
    account_id = request.account.id
    calendar = meet_calendar(account_id)
    events = await calendar.get_event(start_date=start_date, end_date=end_date)
    return(events)


