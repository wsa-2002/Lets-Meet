import persistence.database as db


class MeetCalendar:
    def __init__(self, account_id):
        self.id = account_id 
    
    async def get_event(self, start_date, end_date):
        events = await db.calendar.get_event(self.id, start_date, end_date)
        return(events)
    
class GoogleCalendar:
    def __init__(self, google_token):
        self.gtoken = google_token 