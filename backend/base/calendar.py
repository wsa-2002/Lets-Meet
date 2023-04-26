from dataclasses import dataclass
from datetime import date

@dataclass
class CalendarEvent:
    invite_code: str
    title: str
    start_date: date
    end_date: date
    start_time_slot_id: int
    end_time_slot_id: int
    
