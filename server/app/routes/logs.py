from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.db import Database

logs_bp = Blueprint('logs', __name__)

@logs_bp.route('', methods=['GET'])
@jwt_required()
def get_logs():
    db = Database.get_db()
    claims = get_jwt()
    if claims.get('role') == 'admin':
        logs = list(db.activity_logs.find().sort('timestamp', -1).limit(100))
    else:
        # Users only see their own logs
        user_id = claims.get('sub')
        logs = list(db.activity_logs.find({'user_id': user_id}).sort('timestamp', -1).limit(50))
        
    return jsonify([{**l, '_id': str(l['_id'])} for l in logs]), 200
