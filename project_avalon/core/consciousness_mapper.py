"""
🧠 CONSCIOUSNESS-PHASE MAPPING ENGINE
Mapping EEG brainwave dominance to metasurface phase patterns.
"""

import numpy as np

class ConsciousnessMapper:
    def __init__(self, size: int = 8):
        self.size = size
        self.patterns = {
            'alpha_dominant': self._alpha_pattern,
            'beta_dominant': self._beta_pattern,
            'theta_dominant': self._theta_pattern,
            'gamma_dominant': self._gamma_pattern,
            'mixed': self._mixed_pattern
        }

    def map_to_phase(self, eeg_powers: dict, attention: float) -> np.ndarray:
        # Determine which brainwave is dominant
        dominant = max(eeg_powers, key=eeg_powers.get)
        pattern_type = f"{dominant}_dominant" if eeg_powers[dominant] > 0.4 else 'mixed'

        pattern_func = self.patterns.get(pattern_type, self._mixed_pattern)
        return pattern_func(attention)

    def _alpha_pattern(self, attention):
        y, x = np.ogrid[:self.size, :self.size]
        pattern = 180 * np.sin(2*np.pi*x/self.size) * np.cos(2*np.pi*y/self.size)
        return (pattern + 180) % 360

    def _beta_pattern(self, attention):
        angle = (attention / 100) * 180
        y, x = np.ogrid[:self.size, :self.size]
        pattern = (x * np.sin(np.radians(angle)) + y * np.cos(np.radians(angle))) * 45
        return pattern % 360

    def _theta_pattern(self, attention):
        center = self.size // 2
        y, x = np.ogrid[:self.size, :self.size]
        angle = np.arctan2(y - center, x - center)
        charge = 1 + int(attention / 50)
        return (charge * np.degrees(angle)) % 360

    def _gamma_pattern(self, attention):
        y, x = np.ogrid[:self.size, :self.size]
        pattern = np.zeros((self.size, self.size))
        for freq in [1, 2, 3, 5]:
            pattern += 30 * np.sin(2*np.pi*freq*x/self.size) * np.cos(2*np.pi*freq*y/self.size)
        return np.abs(pattern) % 360

    def _mixed_pattern(self, attention):
        return (self._alpha_pattern(attention) * 0.4 + self._beta_pattern(attention) * 0.6) % 360
