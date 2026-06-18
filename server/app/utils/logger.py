from app.db import Database
from datetime import datetime

def log_activity(action, details, user_id=None):
    db = Database.get_db()
    log_entry = {
        'action': action,
        'details': details,
        'user_id': user_id,
        'timestamp': datetime.utcnow()
    }
    db.activity_logs.insert_one(log_entry)
