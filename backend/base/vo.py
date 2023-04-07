from dataclasses import dataclass
from datetime import date, datetime
from typing import Optional

from base import enums


@dataclass
class BrowseMeetByAccount:
    meet_id: int
    host_account_id: Optional[int]
    host_username: Optional[str]
    title: str
    start_date: date
    end_date: date
    start_time_slot_id: int
    end_time_slot_id: int
    status: enums.StatusType
    voting_end_time: Optional[datetime] = None
    meet_url: Optional[str] = None
