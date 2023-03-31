from dataclasses import dataclass
from uuid import uuid4

from fastapi import APIRouter, responses, Depends
from pydantic import BaseModel

from security import encode_jwt, verify_password, hash_password
from middleware.envelope import enveloped
from middleware.headers import get_auth_token
import persistence.database as db
from persistence.email import verification
import exceptions as exc  # noqa


router = APIRouter(
    tags=['Account'],
    default_response_class=responses.JSONResponse,
    dependencies=[Depends(get_auth_token)]
)

USERNAME_PROHIBITED_CHARS = r'`#$%&*\/?'


class AddAccountInput(BaseModel):
    username: str
    password: str
    email: str


@dataclass
class AddAccountOutput:
    id: int


@router.post('/account')
@enveloped
async def add_account(data: AddAccountInput) -> AddAccountOutput:
    if any(char in data.username for char in USERNAME_PROHIBITED_CHARS):
        raise exc.IllegalCharacter

    account_id = await db.account.add(username=data.username,
                                      pass_hash=hash_password(data.password))
    verification_code = str(uuid4())
    await db.email_verification.add(code=verification_code, account_id=account_id, email=data.email)
    await verification.send(to=data.email, code=verification_code, username=data.username)
    return AddAccountOutput(id=account_id)


class LoginInput(BaseModel):
    user_identifier: str
    password: str


@dataclass
class LoginOutput:
    account_id: int
    token: str


@router.post('/login')
@enveloped
async def login(data: LoginInput) -> LoginOutput:
    try:
        account_id, pass_hash = await db.account.read_by_username_or_email(identifier=data.user_identifier)
    except TypeError:
        raise exc.LoginFailed
    if not pass_hash or not verify_password(data.password, pass_hash):
        raise exc.LoginFailed

    token = encode_jwt(account_id=account_id)
    return LoginOutput(account_id=account_id, token=token)
