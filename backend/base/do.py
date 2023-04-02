"""
data objects
"""
import datetime
from dataclasses import dataclass
from typing import Optional
from uuid import UUID

from base import enums


@dataclass
class Account:
    id: int
    username: str
    email: str
    notification_preference: enums.NotificationPreference
    is_google_login: bool
    line_token: Optional[str] = None
    google_token: Optional[str] = None


@dataclass
class Event:
    meet_id: int
    account_id: int


@dataclass
class Meet:
    id: int
    status: enums.StatusType
    start_date: datetime.date
    end_date: datetime.date
    start_time: datetime.time
    end_time: datetime.time
    voting_end_time: datetime
    title: str
    invite_code: str
    finalized_start_time: datetime
    finalized_end_time: datetime
    meet_url: Optional[str] = None
    description: Optional[str] = None


@dataclass
class MeetMember:
    id: int
    meet_id: int
    is_host: bool
    name: Optional[str] = None
    member_id: Optional[int] = None


@dataclass
class MeetMemberAvailableTime:
    meet_member_id: int
    date: datetime.date
    time_slot_id: int


@dataclass
class Routine:
    account_id: int
    weekday: enums.WeekDayType
    time_slot_id: int


@dataclass
class TimeSlot:
    id: int
    start_time: datetime.time
    end_time: datetime.time


@dataclass
class S3File:
    uuid: UUID
    key: str
    bucket: str
