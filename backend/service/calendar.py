import persistence.database as db


class meet_calendar:
    def __init__(self, account_id):
        self.id = account_id 
    
    async def get_event(self, start_date, end_date):
        events = await db.calendar.get_event(self.id, start_date, end_date)
        return(events)
    
class google_calendar:
    def __init__(self, google_token):
        self.gtoken = google_token 