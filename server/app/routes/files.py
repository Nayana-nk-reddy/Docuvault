from flask import Blueprint, request, jsonify, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.db import Database
from bson import ObjectId
import os
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
from app.utils.logger import log_activity

files_bp = Blueprint('files', __name__)

@files_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_file():
    db = Database.get_db()
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
        
    user_id = get_jwt_identity()
    print(f"File upload triggered by user: {user_id}")
    filename = secure_filename(file.filename)
    unique_filename = f"{datetime.utcnow().timestamp()}_{filename}"
    
    upload_path = os.path.join('uploads', unique_filename)
    file.save(upload_path)
    
    file_doc = {
        'owner_id': user_id,
        'filename': filename,
        'stored_name': unique_filename,
        'size': os.path.getsize(upload_path),
        'mimetype': file.content_type,
        'upload_date': datetime.utcnow(),
        'is_public': False,
        'shared_with': []
    }
    
    result = db.documents.insert_one(file_doc)
    log_activity('file_upload', f"Uploaded file: {filename}", user_id)
    
    return jsonify({
        'message': 'File uploaded successfully',
        'file': {
            'id': str(result.inserted_id),
            'filename': filename,
            'size': file_doc['size'],
            'mimetype': file_doc['mimetype']
        }
    }), 201

@files_bp.route('/', methods=['GET'])
@jwt_required()
def get_user_files():
    db = Database.get_db()
    user_id = get_jwt_identity()
    
    print(f"Fetching files for user: {user_id}")
    
    # Get all users first to lookup usernames
    all_users = list(db.users.find({}, {'_id': 1, 'username': 1}))
    user_lookup = {str(u['_id']): u['username'] for u in all_users}
    
    # Files owned by user
    my_files = list(db.documents.find({'owner_id': user_id}))
    print(f"Found {len(my_files)} files owned by user")
    
    # Files shared with user
    shared_files = list(db.documents.find({'shared_with': user_id}))
    print(f"Found {len(shared_files)} files shared with user")
    
    def format_file(f):
        f['id'] = str(f['_id'])
        del f['_id']
        # Add owner's username to the file
        f['owner_username'] = user_lookup.get(f['owner_id'], 'Unknown User')
        return f

    return jsonify({
        'my_files': [format_file(f) for f in my_files],
        'shared_with_me': [format_file(f) for f in shared_files]
    }), 200

@files_bp.route('/<file_id>/download', methods=['GET'])
@jwt_required()
def download_file(file_id):
    db = Database.get_db()
    user_id = get_jwt_identity()
    file = db.documents.find_one({
        '_id': ObjectId(file_id),
        '$or': [
            {'owner_id': user_id},
            {'shared_with': user_id},
            {'is_public': True}
        ]
    })
    
    if not file:
        return jsonify({'message': 'File not found or access denied'}), 404
        
    log_activity('file_download', f"Downloaded file: {file['filename']}", user_id)
    
    # Use absolute path for send_from_directory on Windows
    upload_dir = os.path.join(os.getcwd(), 'uploads')
    return send_from_directory(upload_dir, file['stored_name'], as_attachment=True, download_name=file['filename'])

@files_bp.route('/<file_id>/share', methods=['POST'])
@jwt_required()
def share_file(file_id):
    db = Database.get_db()
    user_id = get_jwt_identity()
    data = request.get_json()
    target_user_id = data.get('user_id')
    
    if not target_user_id:
        return jsonify({'message': 'User ID required to share'}), 400
        
    file = db.documents.find_one({'_id': ObjectId(file_id), 'owner_id': user_id})
    if not file:
        return jsonify({'message': 'File not found or unauthorized'}), 404
        
    if target_user_id not in file['shared_with']:
        db.documents.update_one(
            {'_id': ObjectId(file_id)},
            {'$push': {'shared_with': target_user_id}}
        )
        log_activity('file_share', f"Shared file {file['filename']} with user {target_user_id}", user_id)
        
    return jsonify({'message': 'File shared successfully'}), 200

@files_bp.route('/<file_id>/rename', methods=['PUT'])
@jwt_required()
def rename_file(file_id):
    db = Database.get_db()
    user_id = get_jwt_identity()
    data = request.get_json()
    new_name = data.get('filename')
    
    if not new_name:
        return jsonify({'message': 'New filename required'}), 400
        
    file = db.documents.find_one({'_id': ObjectId(file_id), 'owner_id': user_id})
    if not file:
        return jsonify({'message': 'File not found or unauthorized'}), 404
        
    db.documents.update_one(
        {'_id': ObjectId(file_id)},
        {'$set': {'filename': new_name}}
    )
    log_activity('file_rename', f"Renamed file from {file['filename']} to {new_name}", user_id)
    
    return jsonify({'message': 'File renamed successfully'}), 200

@files_bp.route('/<file_id>', methods=['DELETE'])
@jwt_required()
def delete_file(file_id):
    db = Database.get_db()
    user_id = get_jwt_identity()
    file = db.documents.find_one({'_id': ObjectId(file_id), 'owner_id': user_id})
    
    if not file:
        return jsonify({'message': 'File not found or unauthorized'}), 404
        
    try:
        os.remove(os.path.join('uploads', file['stored_name']))
    except:
        pass
        
    db.documents.delete_one({'_id': ObjectId(file_id)})
    log_activity('file_delete', f"Deleted file: {file['filename']}", user_id)
    
    return jsonify({'message': 'File deleted successfully'}), 200
