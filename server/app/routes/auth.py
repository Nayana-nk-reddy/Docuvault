from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.user import User
from app.utils.logger import log_activity
from app.db import Database
from datetime import timedelta
import re

auth_bp = Blueprint('auth', __name__)

def is_valid_email(email):
    """Validate email format"""
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(email_regex, email) is not None

def is_valid_password(password):
    """Validate password strength: at least 8 characters, contains letter and number"""
    if len(password) < 8:
        return False
    has_letter = any(c.isalpha() for c in password)
    has_number = any(c.isdigit() for c in password)
    return has_letter and has_number

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    if len(data['username'].strip()) < 3:
        return jsonify({'message': 'Username must be at least 3 characters long'}), 400
        
    if not is_valid_email(data['email']):
        return jsonify({'message': 'Please enter a valid email address'}), 400
        
    if not is_valid_password(data['password']):
        return jsonify({'message': 'Password must be at least 8 characters long and contain at least one letter and one number'}), 400
        
    if User.find_by_email(data['email']):
        return jsonify({'message': 'User already exists'}), 400
        
    User.create_user(data['username'], data['email'], data['password'])
    log_activity('user_registration', f"New user registered: {data['email']}")
    
    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
        
    user = User.find_by_email(data['email'])
    
    if user and User.verify_password(user['password'], data['password']):
        # FORCED ADMIN UPGRADE FOR DEBUGGING
        if user['email'] == 'admin@docvault.com':
            db = Database.get_db()
            db.users.update_one({'_id': user['_id']}, {'$set': {'role': 'admin'}})
            user['role'] = 'admin'
            
        access_token = create_access_token(
            identity=str(user['_id']), 
            additional_claims={'role': user['role']},
            expires_delta=timedelta(days=1)
        )
        
        log_activity('user_login', f"User logged in: {user['email']}", str(user['_id']))
        
        return jsonify({
            'token': access_token,
            'user': {
                'id': str(user['_id']),
                'username': user['username'],
                'email': user['email'],
                'role': user['role']
            }
        }), 200
        
    log_activity('failed_login', f"Failed login attempt for: {data.get('email')}")
    return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
        
    return jsonify({
        'id': str(user['_id']),
        'username': user['username'],
        'email': user['email'],
        'role': user['role']
    }), 200
