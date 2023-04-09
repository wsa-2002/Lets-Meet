from base import do, enums
from datetime import datetime, date, time
from typing import Tuple, Sequence, Optional
import exceptions as exc  # noqa

import asyncpg

from .util import pyformat2psql
from . import pool_handler


async def add(meet_member_id: int, date_: date, time_slot_id: int) -> None:
    sql, params = pyformat2psql(
        sql="INSERT INTO meet_member_available_time"
            "            (meet_member_id, date, time_slot_id)"
            "     VALUES (%(meet_member_id)s, %(date)s, %(time_slot_id)s)",
        meet_member_id=meet_member_id, date=date_, time_slot_id=time_slot_id
    )
    await pool_handler.pool.execute(sql, *params)
