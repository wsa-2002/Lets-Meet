from functools import partial
from datetime import timedelta, datetime
from typing import NamedTuple, Optional

import jwt
from passlib.hash import argon2

from config import jwt_config
from base import enums
import exceptions as exc

_jwt_encoder = partial(jwt.encode, key=jwt_config.jwt_secret, algorithm=jwt_config.jwt_encode_algorithm)
_jwt_decoder = partial(jwt.decode, key=jwt_config.jwt_secret, algorithms=[jwt_config.jwt_encode_algorithm])


def encode_jwt(account_id: int, is_google_login: bool, expire: timedelta = jwt_config.login_expire) -> str:
    return _jwt_encoder({
        'account_id': account_id,
        'is_google_login': is_google_login,
        'expire': (datetime.now() + expire).isoformat(),
    })


class Account(NamedTuple):
    time: datetime
    id: Optional[int] = None


def decode_jwt(encoded: str, time: datetime) -> Account:
    try:
        decoded = _jwt_decoder(encoded)
    except jwt.DecodeError:
        raise exc.LoginExpired

    expire = datetime.fromisoformat(decoded['expire'])
    if time > expire:
        raise exc.LoginExpired

    account_id = decoded['account_id']
    return Account(id=account_id, time=time)


def hash_password(password: str) -> str:
    return argon2.hash(password)


def verify_password(password: str, pass_hash: str) -> bool:
    return argon2.verify(password, pass_hash)
