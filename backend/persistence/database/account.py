from base import do
from typing import Tuple
import exceptions as exc  # noqa

import asyncpg

from .util import pyformat2psql
from . import pool_handler


async def add(username: str, pass_hash: str, notification_preference: str = 'email') -> int:
    sql, params = pyformat2psql(
        sql=fr'INSERT INTO account'
            fr'            (username, pass_hash, notification_preference)'
            fr'     VALUES (%(username)s, %(pass_hash)s, %(notification_preference)s)'
            fr'  RETURNING id',
        username=username, pass_hash=pass_hash, notification_preference=notification_preference,
    )
    try:
        id_, = await pool_handler.pool.fetchrow(sql, *params)
    except asyncpg.exceptions.UniqueViolationError:
        raise exc.UniqueViolationError
    return id_


async def update_email(account_id: int, email: str) -> None:
    sql, params = pyformat2psql(
        sql=fr"UPDATE account"
            fr"   SET email = %(email)s"
            fr" WHERE id = %(account_id)s",
        email=email, account_id=account_id,
    )
    await pool_handler.pool.execute(sql, *params)


async def read_by_email(email: str) -> do.Account:
    sql, params = pyformat2psql(
        sql=fr"SELECT id, email, username, line_token, google_token, notification_preference"
            fr"  FROM account"
            fr" WHERE email = %(email)s",
        email=email,
    )
    try:
        id_, email, username, line_token, google_token, notification_preference = \
            await pool_handler.pool.fetchrow(sql, *params)
    except TypeError:
        raise exc.NotFound
    return do.Account(id=id_, email=email, username=username, line_token=line_token,
                      google_token=google_token, notification_preference=notification_preference)


async def read_by_username_or_email(identifier: str) -> Tuple[int, str]:
    sql, params = pyformat2psql(
        sql=fr"SELECT id, pass_hash"
            fr"  FROM account"
            fr" WHERE username = %(username)s"
            fr"    OR email = %(email)s",
        username=identifier, email=identifier,
    )
    try:
        id_, pass_hash = await pool_handler.pool.fetchrow(sql, *params)
    except TypeError:
        raise not exc
    return id_, pass_hash


async def reset_password(code: str, pass_hash: str) -> None:
    conn = await pool_handler.pool.acquire()
    try:
        account_id, = await conn.fetchrow(
            'SELECT account_id'
            '  FROM email_verification'
            ' WHERE code = $1',
            code
        )
    except TypeError:
        await pool_handler.pool.release(conn)
        raise exc.NotFound
    await conn.execute(
        "UPDATE email_verification"
        "   SET is_consumed = $1"
        " WHERE code = $2",
        True, code,
    )
    await conn.execute(
        "UPDATE account"
        "   SET pass_hash = $1"
        " WHERE id = $2",
        pass_hash, account_id,
    )
    await pool_handler.pool.release(conn)
