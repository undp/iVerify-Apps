# hardware/openbci_integration.py
import numpy as np

try:
    import brainflow
    from brainflow.board_shim import BoardShim, BrainFlowInputParams, BoardIds
    from brainflow.data_filter import DataFilter, FilterTypes, DetrendOperations

    BRAINFLOW_AVAILABLE = True
except ImportError:
    BRAINFLOW_AVAILABLE = False

import json
import os


class OpenBCIAvalonInterface:
    """Driver específico para OpenBCI Cyton/Daisy + Avalon"""

    def __init__(self, port=None, board_id=None):
        # Load from config if not provided
        if port is None or board_id is None:
            config_path = os.path.join(
                "project_avalon", "avalon_config", "default_config.json"
            )
            if os.path.exists(config_path):
                with open(config_path, "r") as f:
                    config = json.load(f)
                    port = port or config.get("serial_port", "COM3")
                    # Map string board_id to BoardIds enum if needed, here simplified

        self.port = port
        if BRAINFLOW_AVAILABLE:
            self.params = BrainFlowInputParams()
            self.params.serial_port = port
            self.board_id = board_id or BoardIds.CYTON_DAISY_BOARD
            self.board = BoardShim(self.board_id, self.params)
        else:
            self.board = None
            print("BrainFlow not installed. Hardware disabled.")

        # Configuração específica para neurofeedback
        self.eeg_channels = [1, 2, 3, 4, 5, 6, 7, 8]  # Canais ativos
        self.sampling_rate = 250

    def test_connection(self):
        if not self.board:
            return False
        try:
            self.board.prepare_session()
            self.board.release_session()
            return True
        except:
            return False

    def setup_session(self, protocol="default"):
        """Configura sessão baseada no protocolo"""
        if not self.board:
            return
        self.board.prepare_session()
        self.board.start_stream()

    def get_realtime_metrics(self):
        """Extrai métricas úteis para neurofeedback em <10ms"""
        if not self.board:
            return {"coherence": 0.5, "alpha_power": 0.1}

        data = self.board.get_current_board_data(500)  # 2 segundos de dados

        # Métricas rápidas
        metrics = {
            "alpha_power": self.calculate_band_power(data, 8, 12),
            "theta_power": self.calculate_band_power(data, 4, 8),
            "beta_power": self.calculate_band_power(data, 13, 30),
            "coherence": self.calculate_interhemispheric_coherence(data),
        }
        metrics["curvature"] = 2.0 - 1.5 * metrics["coherence"]
        return metrics

    def calculate_band_power(self, data, low_freq, high_freq):
        """FFT rápido para neurofeedback em tempo real"""
        from scipy.signal import welch

        powers = []

        for ch in self.eeg_channels:
            if ch < data.shape[0]:
                f, Pxx = welch(data[ch], fs=self.sampling_rate, nperseg=256)
                mask = (f >= low_freq) & (f <= high_freq)
                powers.append(np.sum(Pxx[mask]))

        return np.mean(powers) if powers else 0.0

    def calculate_interhemispheric_coherence(self, data):
        """Mock interhemispheric coherence."""
        return 0.6 + 0.1 * np.random.randn()

    def adjust_gain(self, gain):
        print(f"Adjusting hardware gain to {gain}")
