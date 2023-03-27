from authlib.integrations.starlette_client import OAuth
from starlette.config import Config

from fastapi import APIRouter, Depends, Request, responses

from security import encode_jwt, verify_password, hash_password
from middleware.envelope import enveloped
from middleware.headers import get_auth_token
import persistence.database as db
import exceptions as exc

from config import google_config

router = APIRouter(
    tags=['Google'],
    default_response_class=responses.JSONResponse,
    dependencies=[Depends(get_auth_token)]
)

config = Config('.bb')
oauth = OAuth(config)
oauth.register(
    name='google',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)


@router.post('/glogin')
@enveloped
async def login(request: Request):
    redirect_uri = request.url_for('auth')
    print('auth_url',redirect_uri)
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get('/auth')
@enveloped
async def auth(request: Request):
    token = await oauth.google.authorize_access_token(request)
    print('token is', token)
    user = await oauth.google.parse_id_token(request, token)
    print(token, user)
    return user