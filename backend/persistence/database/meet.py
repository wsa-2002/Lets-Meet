from base import do, enums
from datetime import datetime, date, time
from typing import Tuple, Sequence, Optional
import exceptions as exc  # noqa

import asyncpg

from .util import pyformat2psql
from . import pool_handler


async def add(title: str, invite_code: str,
              start_date: date, end_date: date,
              start_time_slot_id: int, end_time_slot_id: int,
              gen_meet_url: bool, voting_end_time: Optional[datetime] = None,
              status: enums.StatusType = enums.StatusType.voting,
              host_member_id: int = None, member_ids: Sequence[int] = None) -> int:
    conn: asyncpg.connection.Connection = await pool_handler.pool.acquire()
    try:
        meet_id, = await conn.fetchrow(
            r"INSERT INTO meet "
            r"            (title, invite_code, start_date,end_date, start_time_slot_id, end_time_slot_id,"
            r"            voting_end_time, gen_meet_url, status)"
            r"     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)"
            r"  RETURNING id",
            title, invite_code, start_date, end_date, start_time_slot_id, end_time_slot_id, voting_end_time,
            gen_meet_url, status
        )
        if member_ids:
            await conn.executemany(
                r"INSERT INTO meet_member"
                r"            (meet_id, member_id, is_host)"
                r"     VALUES ($1, $2, $3)",
                args=[(meet_id, member_id, False) for member_id in member_ids]
            )
        if host_member_id:
            await conn.execute(
                r"INSERT INTO meet_member"
                r"            (meet_id, member_id, is_host)"
                r"     VALUES ($1, $2, $3)",
                meet_id, host_member_id, True,
            )
        return meet_id
    finally:
        await pool_handler.pool.release(conn)


async def read_meet_by_code(invite_code: str, include_deleted: bool = False) -> do.Meet:
    sql, params = pyformat2psql(
        sql=fr"SELECT id, status, start_date, end_date, start_time_slot_id, end_time_slot_id,"
            fr"       voting_end_time, title, invite_code, gen_meet_url,"
            fr"       finalized_start_time, finalized_end_time,"
            fr"       meet_url, description"
            fr"  FROM meet"
            fr" WHERE invite_code = %(invite_code)s"
            fr" {'AND NOT is_deleted' if not include_deleted else ''}",
        invite_code=invite_code
    )
    id_, status, start_date, end_date, start_time_slot_id, end_time_slot_id, \
    voting_end_time, title, invite_code, gen_meet_url, \
    finalized_start_time, finalized_end_time, meet_url, description = await pool_handler.pool.fetchrow(sql, *params)
    return do.Meet(id=id_, status=enums.StatusType(status), start_date=start_date, end_date=end_date,
                   start_time_slot_id=start_time_slot_id, end_time_slot_id=end_time_slot_id, voting_end_time=voting_end_time,
                   title=title, invite_code=invite_code, gen_meet_url=gen_meet_url,
                   finalized_start_time=finalized_start_time, finalized_end_time=finalized_end_time,
                   meet_url=meet_url, description=description)


async def read(meet_id: int, include_deleted: bool = False) -> do.Meet:
    sql, params = pyformat2psql(
        sql=fr"SELECT id, status, start_date, end_date, start_time_slot_id, end_time_slot_id,"
            fr"       voting_end_time, title, invite_code, gen_meet_url,"
            fr"       finalized_start_time, finalized_end_time,"
            fr"       meet_url, description"
            fr"  FROM meet"
            fr" WHERE id = %(meet_id)s"
            fr" {'AND NOT is_deleted' if not include_deleted else ''}",
        meet_id=meet_id,
    )
    id_, status, start_date, end_date, start_time_slot_id, end_time_slot_id, \
    voting_end_time, title, invite_code, gen_meet_url, \
    finalized_start_time, finalized_end_time, meet_url, description = await pool_handler.pool.fetchrow(sql, *params)
    return do.Meet(id=id_, status=enums.StatusType(status), start_date=start_date, end_date=end_date,
                   start_time_slot_id=start_time_slot_id, end_time_slot_id=end_time_slot_id,
                   voting_end_time=voting_end_time,
                   title=title, invite_code=invite_code, gen_meet_url=gen_meet_url,
                   finalized_start_time=finalized_start_time, finalized_end_time=finalized_end_time,
                   meet_url=meet_url, description=description)


async def is_authed(meet_id: int, member_id: int = None, name: str = None, only_host: bool = False) -> bool:
    if not member_id and not name:
        return False

    sql, params = pyformat2psql(
        sql=fr"SELECT * FROM meet_member"
            fr" WHERE meet_id = %(meet_id)s"
            fr" {'AND member_id = %(member_id)s' if member_id else ''}"
            fr" {'AND name = %(name)s' if name else ''}"
            fr" {'AND is_host' if only_host else ''}",
        meet_id=meet_id, member_id=member_id, name=name,
    )
    result = await pool_handler.pool.fetch(sql, *params)
    return True if result else False


async def delete(meet_id: int) -> None:
    sql, params = pyformat2psql(
        sql=fr"UPDATE meet"
            fr"   SET is_deleted = %(is_deleted)s"
            fr" WHERE id = %(meet_id)s",
        is_deleted=True, meet_id=meet_id,
    )
    await pool_handler.pool.execute(sql, *params)


async def get_member_id_and_auth(meet_id: int) -> dict[int, bool]:
    sql, params = pyformat2psql(
        sql=fr"SELECT member_id, is_host"
            fr"  FROM meet_member"
            fr" WHERE meet_id = %(meet_id)s",
        meet_id=meet_id
    )
    record = await pool_handler.pool.fetch(sql, *params)
    return {id_: is_host for id_, is_host in record}


async def leave(meet_id: int, account_id: int) -> None:
    conn: asyncpg.connection.Connection = await pool_handler.pool.acquire()
    try:
        meet_member_id, = await conn.execute(
            fr"SELECT id FROM meet_member"
            fr" WHERE meet_id = $1"
            fr"   AND member_id = $2",
            meet_id, account_id,
        )
        await conn.execute(
            fr"DELETE FROM meet_member_available_time"
            fr" WHERE meet_member_id = $1",
            meet_member_id,
        )
        await conn.execute(
            fr"DELETE FROM meet_member"
            fr" WHERE id = $1",
            meet_member_id,
        )
    finally:
        await pool_handler.pool.release(conn)


async def edit(meet_id: int,
               title: Optional[str] = None,
               start_date: Optional[date] = None, end_date: Optional[date] = None,
               start_time_slot_id: Optional[int] = None, end_time_slot_id: Optional[int] = None,
               description: Optional[str] = None, voting_end_time: Optional[datetime] = None,
               gen_meet_url: Optional[bool] = False) -> None:
    update_params = {'gen_meet_url': gen_meet_url}
    if title:
        update_params['title'] = title
    if start_date:
        update_params['start_date'] = start_date
    if end_date:
        update_params['end_date'] = end_date
    if start_time_slot_id:
        update_params['start_time_slot_id'] = start_time_slot_id
    if end_time_slot_id:
        update_params['end_time_slot_id'] = end_time_slot_id
    if description:
        update_params['description'] = description
    if voting_end_time:
        update_params['voting_end_time'] = voting_end_time

    set_sql = ', '.join(fr"{field_name} = %({field_name})s" for field_name in update_params)

    sql, params = pyformat2psql(
        sql=fr"UPDATE meet"
            fr"   SET {set_sql}"
            fr" WHERE id = %(meet_id)s",
        meet_id=meet_id, **update_params
    )
    await pool_handler.pool.execute(sql, *params)
