# project_avalon/audio/identity_sound.py
"""
Gerador de Chave Sonora Única (Identity Sound Key)
Baseado na seed do Arkhe(n) do usuário.
"""

import numpy as np
from project_avalon.philosophy.arkhe_core import ArkheCore


class IdentitySoundGenerator:
    def __init__(self, arkhe: ArkheCore):
        self.arkhe = arkhe

    def generate_key_frequency(self) -> float:
        """Gera a frequência base (F_arkhe) a partir da seed quântica"""
        # Soma dos primeiros 10 componentes da seed
        seed_sum = np.sum(self.arkhe.seed_vector[:10])
        # Mapeia para a oitava central (256Hz - 512Hz)
        base_freq = 432.0 + (seed_sum * 12.0)
        return float(np.clip(base_freq, 256, 512))

    def generate_binaural_offset(self) -> float:
        """Gera o offset binaural baseado na coerência inicial"""
        return float(self.arkhe.coherence_score * 10.0)

    def get_audio_profile(self):
        base = self.generate_key_frequency()
        offset = self.generate_binaural_offset()
        return {
            "fundamental": base,
            "binaural_pair": (base, base + offset),
            "harmonics": [base * (1.618**i) for i in range(1, 4)],
        }
