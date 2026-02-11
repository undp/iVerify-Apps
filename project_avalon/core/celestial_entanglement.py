"""
Entrelaçamento quântico através do sistema solar.

[DESCOBERTA]: As ressonâncias orbitais criam estados emaranhados
entre planetas, similares ao emaranhamento quântico.
"""

import numpy as np
from typing import Dict, List, Tuple
from scipy.linalg import expm
from project_avalon.core.celestial_helix import CelestialDNA, CelestialBody


class CelestialEntanglement:
    """
    Analisa emaranhamento quântico entre corpos celestes.
    """

    def __init__(self, celestial_dna: CelestialDNA):
        self.dna = celestial_dna

    def calculate_entanglement_matrix(self) -> np.ndarray:
        n_bodies = len(self.dna.orbits)
        entanglement = np.zeros((n_bodies, n_bodies))

        for i in range(n_bodies):
            for j in range(i+1, n_bodies):
                # 1. Similaridade orbital
                period_i = self.dna.orbits[i].orbital_period
                period_j = self.dna.orbits[j].orbital_period

                best_ratio = 0
                for p in range(1, 6):
                    for q in range(1, 6):
                        ratio = period_i / (period_j if period_j > 0 else 1)
                        target = p / q
                        closeness = 1.0 / (1.0 + abs(ratio - target))
                        if closeness > best_ratio:
                            best_ratio = closeness

                orbital_entanglement = best_ratio

                # 2. Proximidade física
                dist = abs(self.dna.orbits[i].orbital_radius - self.dna.orbits[j].orbital_radius)
                proximity_entanglement = 1.0 / (1.0 + dist)

                # 3. Alinhamento de fase
                phase_diff = abs(self.dna.orbits[i].orbital_phase - self.dna.orbits[j].orbital_phase)
                phase_entanglement = np.cos(phase_diff / 2)**2

                total = (orbital_entanglement * 0.5 + proximity_entanglement * 0.3 + phase_entanglement * 0.2)
                entanglement[i, j] = total
                entanglement[j, i] = total

        np.fill_diagonal(entanglement, 1.0)
        return entanglement

    def find_maximally_entangled_pairs(self, threshold: float = 0.7) -> List[Tuple]:
        matrix = self.calculate_entanglement_matrix()
        bodies = [o.body for o in self.dna.orbits]
        pairs = []
        for i in range(len(bodies)):
            for j in range(i+1, len(bodies)):
                if matrix[i, j] > threshold:
                    pairs.append((bodies[i].name, bodies[j].name, matrix[i, j]))
        pairs.sort(key=lambda x: x[2], reverse=True)
        return pairs

    def calculate_quantum_coherence(self) -> Dict:
        entanglement = self.calculate_entanglement_matrix()
        eigenvalues = np.real(np.linalg.eigvals(entanglement))
        eigenvalues_norm = eigenvalues / eigenvalues.sum()
        entropy = -np.sum(eigenvalues_norm * np.log2(eigenvalues_norm + 1e-10))
        max_coherence = np.log2(9)
        coherence = 1.0 - (entropy / max_coherence)
        return {
            'entanglement_entropy': entropy,
            'quantum_coherence': coherence,
            'purity': np.sum(eigenvalues_norm**2)
        }

    def simulate_quantum_evolution(self, time_steps: int = 100, dt: float = 0.1) -> np.ndarray:
        n_bodies = len(self.dna.orbits)
        H = np.zeros((n_bodies, n_bodies))
        for i in range(n_bodies):
            H[i, i] = 1.0 / (self.dna.orbits[i].orbital_period + 0.001)

        entanglement = self.calculate_entanglement_matrix()
        for i in range(n_bodies):
            for j in range(i+1, n_bodies):
                H[i, j] = entanglement[i, j] * 0.1
                H[j, i] = H[i, j]

        psi_small = np.ones(n_bodies) / np.sqrt(n_bodies)
        evolution = np.zeros((time_steps, n_bodies))
        for t in range(time_steps):
            U = expm(-H * t * dt)
            evolution[t] = U @ psi_small
        return evolution
