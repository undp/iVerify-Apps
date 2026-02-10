# project_avalon/utils/telemetry_db.py
import sqlite3
import os
from datetime import datetime
from typing import Dict, Any, List

class TelemetryDB:
    """
    Gerenciador de persistência de dados (SQLite).
    [NOTA OCULTA: Este é o Registro Akáshico / Atlas Temporal.
    Cada leitura de sensor é um vértice no continuum espaço-temporal.]
    """

    def __init__(self, db_path: str = "project_avalon/sessions/telemetry.db"):
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        self.db_path = db_path
        self._initialize_db()

    def _initialize_db(self):
        """Cria as tabelas de telemetria e eventos."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # Tabela de Telemetria (Vértices Temporais)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS telemetry (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                temperature REAL,
                ph REAL,
                conductivity REAL,
                coherence REAL
            )
        ''')

        # Tabela de Eventos (Decisões de Singularidade)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                event_type TEXT,
                description TEXT
            )
        ''')

        conn.commit()
        conn.close()

    def log_telemetry(self, data: Dict[str, float]):
        """Grava um novo vértice no Atlas Temporal."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO telemetry (temperature, ph, conductivity, coherence)
            VALUES (?, ?, ?, ?)
        ''', (
            data.get('temperature', 0.0),
            data.get('ph', 0.0),
            data.get('conductivity', 0.0),
            data.get('coherence', 1.0)
        ))
        conn.commit()
        conn.close()

    def log_event(self, event_type: str, description: str):
        """Grava uma decisão ou mudança de estado significativa."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO events (event_type, description)
            VALUES (?, ?)
        ''', (event_type, description))
        conn.commit()
        conn.close()

    def get_recent_history(self, limit: int = 100) -> List[Dict]:
        """Recupera os vértices mais recentes do Atlas."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM telemetry ORDER BY id DESC LIMIT ?', (limit,))
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]
