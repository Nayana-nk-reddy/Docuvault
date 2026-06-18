from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.db import Database
from bson import ObjectId

users_bp = Blueprint('users', __name__)

@users_bp.route('/search', methods=['GET'])
@jwt_required()
def search_users():
    db = Database.get_db()
    query = request.args.get('q', '')
    if not query:
        return jsonify([]), 200
        
    users = db.users.find({
        '$or': [
            {'username': {'$regex': query, '$options': 'i'}},
            {'email': {'$regex': query, '$options': 'i'}}
        ]
    }, {'password': 0})
    
    return jsonify([{
        'id': str(u['_id']),
        'username': u['username'],
        'email': u['email']
    } for u in users]), 200
