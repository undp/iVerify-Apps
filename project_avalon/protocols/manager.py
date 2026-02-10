# project_avalon/protocols/manager.py
import numpy as np


class ProtocolManager:
    """Gerenciador de protocolos"""

    def __init__(self):
        self.protocols = {
            "focus": {
                "name": "Foco e Atenção",
                "target": "increase_beta_theta_ratio",
                "description": "Aumenta foco reduzindo theta",
            },
            "calm": {
                "name": "Calma e Relaxamento",
                "target": "increase_alpha",
                "description": "Aumenta relaxamento",
            },
            "flow": {
                "name": "Estado de Flow",
                "target": "balance_alpha_beta",
                "description": "Equilíbrio entre foco e relaxamento",
            },
        }

    def get_protocol(self, name):
        return BasicProtocol(self.protocols.get(name, self.protocols["flow"]))


class BasicProtocol:
    """Protocolo básico de processamento"""

    def __init__(self, config):
        self.config = config

    def process(self, metrics):
        # Using metrics object attributes
        if self.config["target"] == "increase_beta_theta_ratio":
            score = metrics.focus_score
        elif self.config["target"] == "increase_alpha":
            score = metrics.calm_score
        else:  # balance_alpha_beta
            score = (metrics.focus_score + metrics.calm_score) / 2

        return {
            "focus": float(score),
            "target": self.config["target"],
            "visual_intensity": float(score),
            "audio_frequency": 440 + float(score) * 220,
        }
