from pymongo import MongoClient

def check_db():
    client = MongoClient('mongodb://localhost:27017/docvault')
    db = client.get_database()
    
    print("--- USERS ---")
    for user in db.users.find():
        print(f"ID: {user['_id']}, Email: {user['email']}, Username: {user['username']}")
        
    print("\n--- DOCUMENTS ---")
    for doc in db.documents.find():
        print(f"ID: {doc['_id']}, Owner: {doc['owner_id']}, Filename: {doc['filename']}")

if __name__ == "__main__":
    check_db()
