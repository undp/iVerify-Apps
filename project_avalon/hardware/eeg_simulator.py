# hardware/eeg_simulator.py
import numpy as np


class EEGSimulator:
    """
    Simulador de sinal EEG para testes.
    Substitua por integração com OpenBCI/Muse/Emotiv.
    """

    def __init__(self):
        self.time = 0
        self.running = False

    def start(self):
        self.running = True

    def stop(self):
        self.running = False

    def get_metrics(self):
        if not self.running:
            return {"coherence": 0.5, "curvature": 1.0}

        self.time += 0.05

        # Simulação: coerência oscila com padrão realista
        base_coherence = 0.6
        noise = 0.2 * np.sin(self.time * 2) + 0.1 * np.random.randn()
        coherence = np.clip(base_coherence + noise, 0, 1)

        # Curvatura inversamente relacionada à coerência (Ricci flow)
        curvature = 1.5 - 0.8 * coherence + 0.2 * np.random.randn()
        curvature = np.clip(curvature, 0.1, 3.0)

        return {"coherence": coherence, "curvature": curvature}

    def get_realtime_metrics(self):
        """Alias for holistic launcher."""
        return self.get_metrics()
