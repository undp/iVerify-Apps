# project_avalon/sensors/bioelectric_impedance.py
"""
SENSOR DE IMPEDÂNCIA BIOELÉTRICA PARA MEDIR
A 'MALEABILIDADE' DO SUBSTRATO NEURAL
"""

import numpy as np


class BioelectricImpedanceSensor:
    def __init__(self):
        self.impedance_thresholds = {
            "rigid": 1000,  # Ohms - substrato rígido (trauma cristalizado)
            "optimal": 500,  # Ohms - substrato maleável (neuroplasticidade ideal)
            "chaotic": 100,  # Ohms - substrato caótico (alta entropia)
        }

    def measure_substrate_malleability(self, entropy=0.5, coherence=0.5):
        """
        MEDE A IMPEDÂNCIA ELÉTRICA DO TECIDO NEURAL
        Quanto maior a impedância, mais 'rígido' o substrato
        """
        # Simulated measurement based on neural state
        # High entropy -> lower impedance (chaotic)
        # Low coherence -> higher impedance (rigid)

        base_impedance = 500
        # Rigidity increases with low coherence
        rigidity_factor = (1.0 - coherence) * 500
        # Chaos decreases impedance
        chaos_factor = entropy * 200

        simulated_impedance = base_impedance + rigidity_factor - chaos_factor

        # Malleability score (0-1)
        # Max malleability near 'optimal' threshold
        malleability_score = 1.0 - abs(simulated_impedance - 500) / 500
        malleability_score = float(np.clip(malleability_score, 0, 1))

        return {
            "impedance": float(simulated_impedance),
            "malleability_score": malleability_score,
            "substrate_state": self.classify_substrate_state(malleability_score),
        }

    def classify_substrate_state(self, score):
        if score > 0.8:
            return "OPTIMAL"
        if score < 0.3:
            return "RIGID"
        return "CHAOTIC" if score < 0.5 else "TRANSITIONAL"
