import asyncpg

from base import do
from typing import Optional, Sequence, Tuple
import exceptions as exc  # noqa

from .util import pyformat2psql
from . import pool_handler


async def read(meet_id: int, account_id: Optional[int] = None, name: Optional[str] = None) -> do.MeetMember:
    sql, params = pyformat2psql(
        sql=fr"SELECT id, meet_id, is_host, name, member_id"
            fr"  FROM meet_member"
            fr" WHERE meet_id = %(meet_id)s"
            fr"  AND (member_id = %(account_id)s"
            fr"    OR name = %(name)s)",
        meet_id=meet_id, account_id=account_id, name=name,
    )
    try:
        id_, meet_id, is_host, name, member_id = await pool_handler.pool.fetchrow(sql, *params)
    except TypeError:
        raise exc.NotFound
    return do.MeetMember(id=id_, meet_id=meet_id, is_host=is_host, name=name, member_id=member_id)


async def browse_meet_members_with_names(meet_id: int) -> Sequence[do.MeetMember]:
    sql, params = pyformat2psql(
        sql=fr"SELECT meet_member.id, meet_id, is_host, meet_member.name, member_id, account.username"
            fr"  FROM meet_member"
            fr"  LEFT JOIN account"
            fr"         ON account.id = meet_member.member_id"
            fr" WHERE meet_member.meet_id = %(meet_id)s",
        meet_id=meet_id,
    )
    results = await pool_handler.pool.fetch(sql, *params)
    return [do.MeetMember(
                id=id_,
                meet_id=meet_id,
                is_host=is_host,
                name=name or username,
                member_id=member_id
            )
            for id_, meet_id, is_host, name, member_id, username in results]


async def read_by_meet_id_and_name(meet_id: int, name: str) -> Tuple[int, str, str]:
    sql, params = pyformat2psql(
        sql=fr"SELECT id, name, pass_hash"
            fr"  FROM meet_member"
            fr" WHERE meet_id = %(meet_id)s"
            fr"   AND name = %(name)s",
        meet_id=meet_id, name=name,
    )
    try:
        id_, name, pass_hash = await pool_handler.pool.fetchrow(sql, *params)
    except TypeError:
        raise exc.NotFound
    return id_, name, pass_hash


async def edit(meet_id: int, added_member_ids: Sequence[int], removed_member_ids: Sequence[int]):
    conn: asyncpg.connection.Connection = await pool_handler.pool.acquire()
    print(added_member_ids, removed_member_ids)
    try:
        if removed_member_ids:
            await conn.executemany(
                "DELETE FROM meet_member_available_time"
                " WHERE meet_member_id IN ("
                "       SELECT id"
                "         FROM meet_member"
                "        WHERE member_id = $1"
                ")",
                args=[[removed_id] for removed_id in removed_member_ids],
            )
            await conn.executemany(
                "DELETE FROM meet_member"
                " WHERE member_id = $1",
                args=[[removed_id] for removed_id in removed_member_ids],
            )
        if added_member_ids:
            await conn.executemany(
                "INSERT INTO meet_member"
                "            (member_id, meet_id)"
                "     VALUES ($1, $2)",
                args=[(member_id, meet_id) for member_id in added_member_ids]
            )
    finally:
        await pool_handler.pool.release(conn)
