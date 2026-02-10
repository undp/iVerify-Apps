# components/data_logger.py
import json
import csv
import numpy as np
from datetime import datetime
from pathlib import Path


class SessionLogger:
    """
    Logger estruturado para sessões de neurofeedback.
    Formatos: CSV (fácil), JSON (rich), HDF5 (big data).
    """

    def __init__(self, session_id=None):
        self.session_id = session_id or datetime.now().strftime("%Y%m%d_%H%M%S")
        self.start_time = datetime.now()
        self.data_buffer = []

        # Diretório de saída
        self.output_dir = Path(f"project_avalon/sessions/{self.session_id}")
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def log_frame(self, timestamp, metrics: dict):
        """Registra um frame de dados."""
        entry = {
            "timestamp": timestamp,
            "elapsed_ms": (datetime.now() - self.start_time).total_seconds() * 1000,
            **metrics,
        }
        self.data_buffer.append(entry)

    def save(self, format="all"):
        """Persiste dados em disco."""
        if format in ("csv", "all"):
            self._save_csv()
        if format in ("json", "all"):
            self._save_json()

    def _save_csv(self):
        if not self.data_buffer:
            return

        csv_path = self.output_dir / "session_data.csv"
        keys = self.data_buffer[0].keys()

        with open(csv_path, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            writer.writerows(self.data_buffer)

        print(f"💾 CSV salvo: {csv_path}")

    def _save_json(self):
        json_path = self.output_dir / "session_metadata.json"

        metadata = {
            "session_id": self.session_id,
            "start_time": self.start_time.isoformat(),
            "duration_sec": (datetime.now() - self.start_time).total_seconds(),
            "num_samples": len(self.data_buffer),
            "statistics": self._compute_stats(),
        }

        with open(json_path, "w") as f:
            json.dump(metadata, f, indent=2)

        print(f"💾 JSON salvo: {json_path}")

    def _compute_stats(self):
        """Estatísticas descritivas da sessão."""
        if not self.data_buffer:
            return {}

        import pandas as pd

        df = pd.DataFrame(self.data_buffer)

        # Filter only numeric columns for describe
        numeric_df = df.select_dtypes(include=[np.number])
        return numeric_df.describe().to_dict()
