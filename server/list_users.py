from app import create_app
from app.db import Database
from datetime import datetime

app = create_app()

with app.app_context():
    db = Database.get_db()
    users = list(db.users.find())
    
    print("=" * 70)
    print(f"{'ID':<26} {'Username':<15} {'Email':<25} {'Role':<10}")
    print("=" * 70)
    
    for user in users:
        user_id = str(user['_id'])
        username = user['username']
        email = user['email']
        role = user.get('role', 'user')
        print(f"{user_id:<26} {username:<15} {email:<25} {role:<10}")
    
    print("=" * 70)
    print(f"Total users: {len(users)}")
