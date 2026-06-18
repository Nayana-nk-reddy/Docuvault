from app import create_app
import os

app = create_app()

if __name__ == '__main__':
    # Using threaded=True and binding to all interfaces for better compatibility
    # Disabling reloader to prevent [WinError 10038] on Windows
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True, use_reloader=False)
