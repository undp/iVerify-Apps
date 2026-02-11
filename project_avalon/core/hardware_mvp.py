"""
🛠️ MINIMAL VIABLE PROTOTYPE: Simulated Hardware Interface
Simulating MindWave EEG and Varactor Metasurface for real-world testing.
"""

import numpy as np
import time
from typing import Dict

class SimulatedEEG:
    def __init__(self):
        self.attention = 50

    def read_attention(self) -> float:
        self.attention = np.clip(self.attention + np.random.randn() * 5, 0, 100)
        return float(self.attention)

    def get_brainwave_powers(self) -> Dict[str, float]:
        if self.attention > 70:
            return {'alpha': 0.1, 'beta': 0.6, 'theta': 0.1, 'gamma': 0.2}
        elif self.attention < 30:
            return {'alpha': 0.1, 'beta': 0.1, 'theta': 0.7, 'gamma': 0.1}
        else:
            return {'alpha': 0.5, 'beta': 0.2, 'theta': 0.2, 'gamma': 0.1}

class SimulatedMetasurface:
    def __init__(self, size: int = 8):
        self.size = size
        self.phase_matrix = np.zeros((size, size))

    def apply_pattern(self, pattern: np.ndarray):
        self.phase_matrix = pattern

    def get_current_beam_direction(self) -> float:
        # Heuristic: mean gradient
        return float(np.mean(np.diff(self.phase_matrix, axis=1)))
