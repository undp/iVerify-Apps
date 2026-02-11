import numpy as np
import os
import json
import uuid
from datetime import datetime
from project_avalon.utils.axioverse_time_emergent import FractalPageWootters
from project_avalon.components.eeg_processor import RealEEGProcessor
from project_avalon.components.visualizer import TimeCrystalVisualizer
from project_avalon.components.audio_synthesizer import generate_healing_sound

class AvalonKernel:
    def __init__(self, config_path=None):
        self.session_id = str(uuid.uuid4())
        if config_path is None:
            config_path = os.path.join('project_avalon', 'avalon_config', 'default_config.json')
        self.load_config(config_path)
        self.setup_components()

        # Session history
        self.session_timestamps = []
        self.coherence_history = []
        self.curvature_history = []
        self.alpha_history = []
        self.theta_history = []

        print(f"Avalon Kernel Initialized. Session ID: {self.session_id}")

    def load_config(self, path):
        if os.path.exists(path):
            with open(path, 'r') as f:
                self.config = json.load(f)
        else:
            self.config = {
                "session_duration": 60,
                "ricci_flow_smoothing": 0.5,
                "base_audio_freq": 200
            }

    def setup_components(self):
        self.eeg_processor = RealEEGProcessor(device='simulation')
        self.visualizer = TimeCrystalVisualizer()
        self.clock = FractalPageWootters(m_a=1e-21, D=2.7)
        self.clock.find_timeless_state()

    def start_session(self, duration=None):
        duration = duration or self.config.get('session_duration', 60)
        print(f"Starting session for {duration} seconds...")

        start_time = datetime.now()
        # Simulated session loop
        for i in range(duration):
            timestamp = (datetime.now() - start_time).total_seconds()
            self.session_timestamps.append(timestamp)

            # Simulated metrics
            self.coherence_history.append(0.8 + 0.2 * np.random.rand())
            self.curvature_history.append(1.0 / (1.0 + i * 0.1))
            self.alpha_history.append(5.0 + 2.0 * np.sin(i * 0.1) + np.random.rand())
            self.theta_history.append(3.0 + 1.0 * np.cos(i * 0.15) + np.random.rand())

        print("Session complete.")

    def export_session_report(self, format='csv'):
        """Exporta dados da sessão para análise externa"""
        import pandas as pd

        df = pd.DataFrame({
            'timestamp': self.session_timestamps,
            'coherence': self.coherence_history,
            'curvature': self.curvature_history,
            'alpha_power': self.alpha_history,
            'theta_power': self.theta_history
        })

        filename = os.path.join('project_avalon', 'session_data', f'session_{self.session_id}.{format}')

        if format == 'csv':
            df.to_csv(filename, index=False)
        elif format == 'json':
            df.to_json(filename)

        print(f"Session report exported to {filename}")
        return filename

if __name__ == "__main__":
    kernel = AvalonKernel()
    kernel.start_session(duration=10)
    try:
        kernel.export_session_report()
    except ImportError:
        print("Pandas not installed. Export failed.")
