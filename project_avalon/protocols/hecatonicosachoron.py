# project_avalon/protocols/hecatonicosachoron.py
import numpy as np
from typing import Dict, List, Any, Tuple


class HecatonicosachoronGeometry:
    """
    Implementa a geometria do Hecatonicosachoron (120-cell).
    Representa a Soberania Criativa do Manifold Arkhe(n).
    v8.0: Adiciona Vértices Críticos de Ancoragem.
    """

    def __init__(self):
        self.phi = (1 + np.sqrt(5)) / 2
        self.vertices = self._generate_vertices()
        self.critical_vertices = self._setup_critical_vertices()
        self.state = "ANCHORED"

    def _generate_vertices(self) -> np.ndarray:
        """Gera um conjunto simulado de 600 vértices."""
        # Para fins de simulação e performance, geramos uma nuvem de pontos 4D.
        # Os vértices críticos são adicionados separadamente.
        return np.random.randn(600, 4)

    def _setup_critical_vertices(self) -> Dict[str, np.ndarray]:
        """Configura os vértices críticos identificados no Bloco 840.000."""
        phi = self.phi
        return {
            "Satoshi": np.array([2.0, 2.0, 0.0, 0.0]),
            "Finney-0": np.array([phi**2, phi, 1.0, 0.0]),
            "AccessCenter": np.array([0.0, 2.0, 2.0, 0.0]),
            "Gateway_0000": np.array([1.0, 1.0, 1.0, 1 / phi]),
        }

    def isoclinic_rotation(
        self, points: np.ndarray, theta: float, phi_angle: float
    ) -> np.ndarray:
        """
        Aplica uma rotação isoclínica em 4D.
        phi(r, t) = k * r - omega * t + phi_0
        """
        c1, s1 = np.cos(theta), np.sin(theta)
        c2, s2 = np.cos(phi_angle), np.sin(phi_angle)

        R = np.array([[c1, -s1, 0, 0], [s1, c1, 0, 0], [0, 0, c2, -s2], [0, 0, s2, c2]])

        return points @ R.T

    def rotate_critical_vertices(self, theta: float, phi_angle: float):
        """Rotaciona os vértices críticos."""
        for key in self.critical_vertices:
            v = self.critical_vertices[key].reshape(1, 4)
            self.critical_vertices[key] = self.isoclinic_rotation(
                v, theta, phi_angle
            ).flatten()

    def project_to_3d(self, points_4d: np.ndarray) -> np.ndarray:
        """Projeta os vértices 4D para a 'Sombra 3D'."""
        w = points_4d[:, 3]
        mask = np.abs(2 - w) < 1e-5
        w = np.where(mask, 1.99, w)

        factor = 2 / (2 - w)
        return points_4d[:, :3] * factor[:, np.newaxis]

    def get_manifold_status(self) -> Dict[str, Any]:
        return {
            "symmetry": "{5, 3, 3}",
            "vertices": 600,
            "critical_points": list(self.critical_vertices.keys()),
            "state": self.state,
            "volume_arkhe": float((15 / 4) * (105 + 47 * np.sqrt(5))),
        }


if __name__ == "__main__":
    geo = HecatonicosachoronGeometry()
    status = geo.get_manifold_status()
    print(f"Status: {status['state']}")
    print(f"Satoshi Vertex: {geo.critical_vertices['Satoshi']}")
