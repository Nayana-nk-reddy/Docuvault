from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.db import Database
from bson import ObjectId

admin_bp = Blueprint('admin', __name__)

def admin_required(fn):
    # This is a simple middleware wrapper
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get('role') != 'admin':
            return jsonify({'message': 'Admin access required'}), 403
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
@admin_required
def get_stats():
    db = Database.get_db()
    total_users = db.users.count_documents({})
    total_files = db.documents.count_documents({})
    
    # Simple storage calculation
    files = db.documents.find({}, {'size': 1})
    total_size = sum(f.get('size', 0) for f in files)
    
    return jsonify({
        'total_users': total_users,
        'total_files': total_files,
        'total_storage_bytes': total_size
    }), 200

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@admin_required
def get_all_users():
    db = Database.get_db()
    users = list(db.users.find({}, {'password': 0}))
    return jsonify([{**u, '_id': str(u['_id'])} for u in users]), 200

@admin_bp.route('/users/<user_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_user(user_id):
    db = Database.get_db()
    db.users.delete_one({'_id': ObjectId(user_id)})
    return jsonify({'message': 'User deleted successfully'}), 200
