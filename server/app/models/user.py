from app import bcrypt
from app.db import Database
from datetime import datetime
from bson import ObjectId

class User:
    @staticmethod
    def create_user(username, email, password, role='user'):
        db = Database.get_db()
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        user = {
            'username': username,
            'email': email,
            'password': hashed_password,
            'role': role,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        return db.users.insert_one(user)

    @staticmethod
    def find_by_email(email):
        db = Database.get_db()
        return db.users.find_one({'email': email})

    @staticmethod
    def find_by_id(user_id):
        db = Database.get_db()
        return db.users.find_one({'_id': ObjectId(user_id)})

    @staticmethod
    def verify_password(hashed_password, password):
        return bcrypt.check_password_hash(hashed_password, password)
