from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from fastapi import APIRouter, Depends, Request, responses
from dataclasses import dataclass
from security import encode_jwt
from middleware.envelope import enveloped
from middleware.headers import get_auth_token
import persistence.database as db
import exceptions as exc  # noqa
from uuid import uuid4
import os
from config import google_config

router = APIRouter(
    tags=['Google'],
    default_response_class=responses.JSONResponse,
    dependencies=[Depends(get_auth_token)]
)

os.environ['GOOGLE_CLIENT_ID'] = google_config.GOOGLE_CLIENT_ID
os.environ['GOOGLE_CLIENT_SECRET'] = google_config.GOOGLE_CLIENT_SECRET

config = Config()
google_client_id = config('GOOGLE_CLIENT_ID')
google_client_secret = config('GOOGLE_CLIENT_SECRET')

oauth = OAuth(config)
oauth.register(
    name='google',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)


@dataclass
class LoginOutput:
    account_id: int
    token: str


@router.post('/google-login')
@enveloped
async def login(request: Request):
    redirect_uri = request.url_for('auth')
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get('/auth')
@enveloped
async def auth(request: Request):
    token_google = await oauth.google.authorize_access_token(request)
    user_email = token_google['userinfo']['email']
    try:
        result = await db.account.read_by_email(user_email)
        account_id = result.id
        token = encode_jwt(account_id=account_id)
    except exc.NotFound:
        account_id = await db.account.add(username=str(uuid4()), email=user_email)
        await db.account.update_username(account_id=account_id, username='用戶_'+str(account_id))
        token = encode_jwt(account_id=account_id)
    return LoginOutput(account_id=account_id, token=token)
