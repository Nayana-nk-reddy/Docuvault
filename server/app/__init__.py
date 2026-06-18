from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from app.db import Database
from config import Config
import os
from datetime import timedelta

bcrypt = Bcrypt()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Fix CORS for real!
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
            "supports_credentials": True
        }
    })
    
    bcrypt.init_app(app)
    jwt.init_app(app)

    @app.before_request
    def debug_headers():
        if request.path.startswith('/api/'):
            print(f"\n--- Incoming Request: {request.method} {request.path} ---")
            print(f"Headers: {dict(request.headers)}")
            auth_header = request.headers.get('Authorization')
            print(f"Auth Header Present: {bool(auth_header)}")
            if auth_header:
                print(f"Auth Header Start: {auth_header[:15]}...")

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        print(f"!!! JWT Invalid Token: {error}")
        return jsonify({"message": "Invalid token provided", "error": "invalid_token"}), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        print(f"!!! JWT Missing Token: {error}")
        return jsonify({"message": "Authorization header missing", "error": "authorization_required"}), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        print(f"!!! JWT Expired Token: {jwt_payload}")
        return jsonify({"message": "Token has expired", "error": "token_expired"}), 401

    # Database setup
    Database.initialize(app.config['MONGO_URI'])

    # Create upload folder if not exists
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    # GLOBAL SLASHE HANDLING
    app.url_map.strict_slashes = False

    # REGISTER BLUEPRINTS
    from app.routes.auth import auth_bp
    from app.routes.files import files_bp
    from app.routes.users import users_bp
    from app.routes.admin import admin_bp
    from app.routes.logs import logs_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(files_bp, url_prefix='/api/files')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(logs_bp, url_prefix='/api/logs')

    @app.route('/')
    def index():
        return {"message": "DocuVault API is running"}, 200

    return app
