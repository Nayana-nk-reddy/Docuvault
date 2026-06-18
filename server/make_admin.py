from pymongo import MongoClient
from bson import ObjectId
import os

def set_admin(email):
    client = MongoClient('mongodb://localhost:27017/docvault')
    db = client.get_database()
    
    user = db.users.find_one({'email': email})
    if not user:
        print(f"Error: User with email {email} not found.")
        return

    db.users.update_one(
        {'_id': user['_id']},
        {'$set': {'role': 'admin'}}
    )
    print(f"Success: User {email} has been promoted to ADMIN.")
    print("Please log out and log back in on the website to see the changes.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        set_admin(sys.argv[1])
    else:
        # Default to the common admin email if none provided
        set_admin('admin@docvault.com')
