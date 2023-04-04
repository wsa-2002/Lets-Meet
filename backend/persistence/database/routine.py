import exceptions as exc  # noqa
from base.enums import WeekDayType
from .util import pyformat2psql
from . import pool_handler
from base import do
import asyncpg

async def add(account_id: int, weekday: WeekDayType, time_slot_id: int):
    sql, params = pyformat2psql(
        sql=fr"INSERT INTO routine (account_id, weekday, time_slot_id)"
            fr"     VALUES (%(account_id)s, %(weekday)s, %(time_slot_id)s)",
        account_id=account_id, weekday=weekday, time_slot_id=time_slot_id,
    )
    await pool_handler.pool.execute(sql, *params)

async def delete(account_id: int, weekday: WeekDayType, time_slot_id: int):
    sql, params = pyformat2psql(
        sql=fr"DELETE FROM routine"
            fr" WHERE (account_id = %(account_id)s"
            fr"   AND weekday = %(weekday)s"
            fr"   AND time_slot_id = %(time_slot_id)s)",
        account_id=account_id, weekday=weekday, time_slot_id=time_slot_id,
    )
    await pool_handler.pool.execute(sql, *params)

async def get(account_id: int):
    sql, params = pyformat2psql(
        sql=fr"SELECT account_id, weekday, time_slot_id" 
            fr"  FROM routine"
            fr" WHERE account_id = %(account_id)s",
        account_id=account_id,
    )
    
    try:
        rows = await pool_handler.pool.fetch(sql, *params)
    except TypeError:
      raise exc.NotFound
    return [do.Routine(account_id=row['account_id'], weekday=row['weekday'], time_slot_id=row['time_slot_id']) for row in rows]

    