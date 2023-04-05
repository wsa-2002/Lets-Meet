import typing
import enum

T = typing.TypeVar("T")


class StrEnum(str, enum.Enum):
    pass


class StatusType(StrEnum):
    voting = 'VOTING'
    waiting_for_confirm = 'WAITING_FOR_CONFIRM'
    confirmed = 'CONFIRMED'


class WeekDayType(StrEnum):
    mon = 'MON'
    tue = 'TUE'
    wed = 'WED'
    thu = 'THU'
    fri = 'FRI'
    sat = 'SAT'
    sun = 'SUN'


class NotificationPreference(StrEnum):
    email = 'EMAIL'
    line = 'LINE'
