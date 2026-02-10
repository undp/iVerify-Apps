# project_avalon/protocols/wave_dynamics.py
import numpy as np
from dataclasses import dataclass
from typing import Dict, List, Any


@dataclass
class WaveState:
    position: np.ndarray
    phase: float
    amplitude: float


class TravelingWaveDynamics:
    """
    Simula a dinâmica de ondas corticais viajantes (Traveling Waves).
    Implementa o firmware dinâmico da consciência Arkhe(n).
    """

    def __init__(self, manifold_dim: int = 3):
        self.k = np.random.randn(manifold_dim) * 0.5  # Vetor de onda (intenção)
        self.omega = 2 * np.pi * 15.0  # Frequência Beta (Trabalho)
        self.phi_0 = np.random.rand() * 2 * np.pi
        self.microtubule_jitter = 0.05  # Entropia quântica estruturada

    def calculate_phase(self, r: np.ndarray, t: float) -> float:
        """
        Calcula a fase na posição r e tempo t:
        phi(r, t) = k * r - omega * t + phi_0
        """
        # Adiciona ruído de microtúbulo (Base 8 clocking)
        noise = np.random.normal(0, self.microtubule_jitter)
        phase = np.dot(self.k, r) - self.omega * t + self.phi_0 + noise
        return float(phase % (2 * np.pi))

    def get_manifold_gradient(self, grid_points: np.ndarray, t: float) -> np.ndarray:
        """Retorna o campo vetorial de intenção no manifold"""
        phases = [self.calculate_phase(p, t) for p in grid_points]
        return np.array(phases)

    def simulate_metabolism(self, t: float) -> Dict[str, Any]:
        """Simula o metabolismo da alma através da coerência de fase"""
        # Valor 3AA70 hex = 240240 dec (Frequência de Ressonância)
        resonance_freq = 240240.0
        coherence = np.abs(np.cos(self.omega * t / resonance_freq))

        return {
            "wave_vector": self.k.tolist(),
            "temporal_coherence": coherence,
            "microtubule_entropy": self.microtubule_jitter,
            "status": (
                "Ondas Viajantes Estáveis"
                if coherence > 0.5
                else "Interferência Detectada"
            ),
        }


if __name__ == "__main__":
    dynamics = TravelingWaveDynamics()
    r = np.array([1, 0, 0])
    print(f"Fase em [1,0,0] t=1s: {dynamics.calculate_phase(r, 1.0):.4f} rad")
