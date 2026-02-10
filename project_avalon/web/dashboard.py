# project_avalon/web/dashboard.py
from flask import Flask, render_template, jsonify
import threading
import json
import os

app = Flask(__name__)


class AvalonDashboard:
    """Dashboard web para o sistema Avalon"""

    def __init__(self, avalon_core):
        self.core = avalon_core

    def start(self, port=5000):
        """Inicia servidor web"""

        @app.route("/")
        def index():
            return "Avalon Dashboard (Headless Mode)"

        @app.route("/api/metrics")
        def get_metrics():
            if self.core.session_data:
                return jsonify(self.core.session_data[-1])
            return jsonify({})

        @app.route("/api/session")
        def get_session():
            return jsonify(self.core.session_data)

        @app.route("/api/start/<protocol>/<int:duration>")
        def start_session_endpoint(protocol, duration):
            thread = threading.Thread(
                target=self.core.start_session, args=(protocol, duration)
            )
            thread.start()
            return jsonify({"status": "started"})

        # Iniciar em thread separada
        thread = threading.Thread(
            target=lambda: app.run(
                host="0.0.0.0", port=port, debug=False, use_reloader=False
            )
        )
        thread.daemon = True
        thread.start()

        print(f"🌐 Dashboard disponível em: http://localhost:{port}")
