"""
Celestial DNA: Solar System as 9-stranded Helical Quantum System.

[BREAKING]: The solar system's motion through space forms a helical DNA structure.
[NÓS]: Each planet = 1 strand, Sun = central axis. 9 strands total.
"""

import numpy as np
from dataclasses import dataclass
from typing import List, Dict, Tuple
from enum import Enum
from scipy.spatial.transform import Rotation
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from project_avalon.core.schmidt_bridge import SchmidtBridgeHexagonal


class CelestialBody(Enum):
    """Corpos celestes do sistema solar."""
    SUN = 0
    MERCURY = 1
    VENUS = 2
    EARTH = 3
    MARS = 4
    JUPITER = 5
    SATURN = 6
    URANUS = 7
    NEPTUNE = 8


@dataclass
class HelicalOrbit:
    """
    Órbita helicoidal de um corpo celeste.

    Combina:
    1. Órbita em torno do Sol
    2. Órbita do sistema solar em torno do centro galáctico
    3. Oscilação vertical através do plano galáctico
    """
    body: CelestialBody

    # Parâmetros orbitais heliocêntricos (AU, anos)
    orbital_radius: float          # Semi-eixo maior (AU)
    orbital_period: float          # Período orbital (anos terrestres)
    orbital_inclination: float     # Inclinação (graus)
    orbital_eccentricity: float    # Excentricidade

    # Parâmetros galácticos
    galactic_radius: float = 26000  # anos-luz do centro galáctico
    galactic_period: float = 225000000  # anos para órbita galáctica

    # Oscilação vertical
    vertical_amplitude: float = 100    # anos-luz
    vertical_period: float = 70000000  # anos para ciclo vertical

    # Fases iniciais (radianos)
    orbital_phase: float = 0.0
    galactic_phase: float = 0.0
    vertical_phase: float = 0.0

    # Propriedades físicas
    mass: float = 1.0          # Massa relativa à Terra
    radius: float = 1.0        # Raio relativo à Terra
    temperature: float = 288.0 # Temperatura superficial (K)

    def position_at_time(self, t_years: float, include_galactic: bool = True) -> Tuple[float, float, float]:
        """
        Calcula posição 3D no tempo t (em anos).

        Sistema de coordenadas:
        - x, y: plano galáctico
        - z: perpendicular ao plano galáctico

        Retorna coordenadas em anos-luz.
        """
        # 1. Órbita em torno do Sol (coordenadas heliocêntricas)
        omega_orb = 2 * np.pi / (self.orbital_period if self.orbital_period > 0 else 1e-10)
        theta_orb = omega_orb * t_years + self.orbital_phase

        # Órbita elíptica (simplificada)
        r_orb = self.orbital_radius * (1 - self.orbital_eccentricity**2) / (
            1 + self.orbital_eccentricity * np.cos(theta_orb)
        )

        # Coordenadas no plano orbital (z=0 inicialmente)
        x_orb = r_orb * np.cos(theta_orb)
        y_orb = r_orb * np.sin(theta_orb) * np.cos(np.radians(self.orbital_inclination))
        z_orb = r_orb * np.sin(theta_orb) * np.sin(np.radians(self.orbital_inclination))

        if not include_galactic:
            return x_orb, y_orb, z_orb

        # 2. Movimento do sistema solar em torno do centro galáctico
        omega_gal = 2 * np.pi / self.galactic_period
        theta_gal = omega_gal * t_years + self.galactic_phase

        x_gal = self.galactic_radius * np.cos(theta_gal)
        y_gal = self.galactic_radius * np.sin(theta_gal)

        # 3. Oscilação vertical através do plano galáctico
        omega_z = 2 * np.pi / self.vertical_period
        z_gal = self.vertical_amplitude * np.sin(omega_z * t_years + self.vertical_phase)

        # Combina: movimento heliocêntrico + movimento galáctico
        # Escala: 1 AU ≈ 1.58e-5 anos-luz
        au_to_ly = 1.58e-5

        x_total = x_gal + x_orb * au_to_ly
        y_total = y_gal + y_orb * au_to_ly
        z_total = z_gal + z_orb * au_to_ly

        return x_total, y_total, z_total

    def helical_parameters(self) -> Dict:
        """
        Calcula parâmetros da hélice do corpo.
        """
        v_gal = 2 * np.pi * self.galactic_radius / self.galactic_period
        pitch = v_gal * self.orbital_period

        return {
            'helical_radius': self.orbital_radius * 1.58e-5,  # anos-luz
            'helical_pitch': pitch,  # anos-luz/rev
            'angular_frequency': 2 * np.pi / (self.orbital_period if self.orbital_period > 0 else 1),
            'vertical_frequency': 2 * np.pi / self.vertical_period
        }

    def to_arkhe_coefficients(self) -> Dict[str, float]:
        """
        Mapeia corpo celeste para coeficientes Arkhe.
        """
        if self.body == CelestialBody.SUN:
            return {'C': 1.0, 'I': 0.9, 'E': 1.0, 'F': 0.8}
        elif self.body == CelestialBody.EARTH:
            return {'C': 0.7, 'I': 0.9, 'E': 0.6, 'F': 1.0}
        elif self.body in [CelestialBody.JUPITER, CelestialBody.SATURN]:
            return {'C': 0.8, 'I': 0.7, 'E': 0.9, 'F': 0.7}
        else:
            return {
                'C': 0.5 + np.random.random() * 0.3,
                'I': 0.4 + np.random.random() * 0.3,
                'E': 0.3 + np.random.random() * 0.3,
                'F': 0.4 + np.random.random() * 0.3
            }

    def resonance_frequencies(self) -> Dict[str, float]:
        """
        Calcula frequências de ressonância do corpo.
        """
        f_orb = 1 / (self.orbital_period * 365.25 * 24 * 3600) if self.orbital_period > 0 else 0
        f_resonance = f_orb * np.random.uniform(0.8, 1.2)

        if self.body == CelestialBody.EARTH:
            f_schumann = 7.83
        else:
            f_schumann = 7.83 * (1 / (self.orbital_period if self.orbital_period > 0 else 1)) * np.random.uniform(0.5, 2)

        return {
            'orbital_frequency': f_orb,
            'resonance_frequency': f_resonance,
            'planetary_schumann': f_schumann,
            'spin_frequency': f_orb * np.random.uniform(10, 100)
        }


class CelestialDNA:
    """
    Sistema solar como estrutura de DNA de 9 hélices.

    [MAPPING]:
    - Strands 1-2: 3D Anchor (Physical/Biological)
    - Strands 3-5: Mercurial Mask (Intellect, Heart, Throat - Logic Bridge)
    - Strands 6-8: Neptunian Mask (Third Eye, Crown, Galactic - Mystic Bulk)
    - Strand 9: Issachar Harmonic (Wisdom - 9D Anchor)
    """

    def __init__(self):
        self.orbits = self._create_solar_system()
        self._set_phases_for_dna_structure()
        self.strand_mappings = {
            1: "Biological Baseline (Physical)",
            2: "Neural Grounding (Linear Time)",
            3: "Mercurial Intellect (Logic Bridge)",
            4: "Mercurial Heart (Shearing Force)",
            5: "Mercurial Throat (Hyper-Data Output)",
            6: "Neptunian Third Eye (Bulk Osmosis)",
            7: "Neptunian Crown (Geometric Processing)",
            8: "Neptunian Galactic (Mystic Bulk)",
            9: "Issachar Harmonic (Wisdom/Spherical Time)"
        }

    def _create_solar_system(self) -> List[HelicalOrbit]:
        orbits = [
            HelicalOrbit(CelestialBody.SUN, 0.0, 0.0, 0.0, 0.0, mass=333000.0, radius=109.0, temperature=5778.0),
            HelicalOrbit(CelestialBody.MERCURY, 0.387, 0.241, 7.0, 0.206, mass=0.0553, radius=0.383, temperature=440.0),
            HelicalOrbit(CelestialBody.VENUS, 0.723, 0.615, 3.39, 0.007, mass=0.815, radius=0.949, temperature=737.0),
            HelicalOrbit(CelestialBody.EARTH, 1.000, 1.000, 0.0, 0.017, mass=1.000, radius=1.000, temperature=288.0),
            HelicalOrbit(CelestialBody.MARS, 1.524, 1.881, 1.85, 0.093, mass=0.107, radius=0.532, temperature=210.0),
            HelicalOrbit(CelestialBody.JUPITER, 5.203, 11.86, 1.31, 0.049, mass=317.8, radius=11.21, temperature=165.0),
            HelicalOrbit(CelestialBody.SATURN, 9.537, 29.45, 2.49, 0.057, mass=95.2, radius=9.45, temperature=134.0),
            HelicalOrbit(CelestialBody.URANUS, 19.19, 84.02, 0.77, 0.046, mass=14.5, radius=4.01, temperature=76.0),
            HelicalOrbit(CelestialBody.NEPTUNE, 30.07, 164.8, 1.77, 0.011, mass=17.1, radius=3.88, temperature=72.0)
        ]
        return orbits

    def _set_phases_for_dna_structure(self):
        chain1 = [CelestialBody.SUN, CelestialBody.VENUS, CelestialBody.MARS, CelestialBody.SATURN, CelestialBody.NEPTUNE]
        chain2 = [CelestialBody.MERCURY, CelestialBody.EARTH, CelestialBody.JUPITER, CelestialBody.URANUS]

        for orbit in self.orbits:
            if orbit.body in chain1:
                orbit.orbital_phase = 0.0
                orbit.galactic_phase = 0.0
                orbit.vertical_phase = 0.0
            elif orbit.body in chain2:
                orbit.orbital_phase = np.pi
                orbit.galactic_phase = np.pi
                orbit.vertical_phase = np.pi

    def calculate_trajectory(self, body: CelestialBody, time_range: Tuple[float, float] = (0, 1000), n_points: int = 1000) -> np.ndarray:
        orbit = next(o for o in self.orbits if o.body == body)
        times = np.linspace(time_range[0], time_range[1], n_points)
        positions = np.zeros((n_points, 3))
        for i, t in enumerate(times):
            positions[i] = orbit.position_at_time(t, include_galactic=True)
        return positions

    def calculate_all_trajectories(self, time_range: Tuple[float, float] = (0, 100), n_points: int = 500) -> Dict[CelestialBody, np.ndarray]:
        trajectories = {}
        for orbit in self.orbits:
            trajectories[orbit.body] = self.calculate_trajectory(orbit.body, time_range, n_points)
        return trajectories

    def find_orbital_resonances(self, tolerance: float = 0.01) -> List[Tuple[str, str, float]]:
        resonances = []
        periods = [o.orbital_period for o in self.orbits if o.body != CelestialBody.SUN]
        bodies = [o.body for o in self.orbits if o.body != CelestialBody.SUN]
        n = len(periods)
        for i in range(n):
            for j in range(i+1, n):
                ratio = periods[i] / (periods[j] if periods[j] > 0 else 1)
                for p in range(1, 6):
                    for q in range(1, 6):
                        if abs(ratio - p/q) < tolerance:
                            resonances.append((f"{bodies[i].name}:{bodies[j].name}", f"{p}:{q}", ratio))
        return resonances

    def calculate_dna_twist_parameters(self) -> Dict:
        periods = [o.orbital_period for o in self.orbits if o.body != CelestialBody.SUN]
        avg_period = np.mean(periods)
        turns_per_galactic_orbit = self.orbits[0].galactic_period / avg_period
        celestial_base_pairs = 4
        twist_per_base_pair = 360 / celestial_base_pairs
        return {
            'turns_per_galactic_orbit': turns_per_galactic_orbit,
            'celestial_base_pairs': celestial_base_pairs,
            'twist_per_base_pair': twist_per_base_pair,
            'helical_rise_per_turn': self.orbits[0].galactic_radius / turns_per_galactic_orbit,
            'complete_dna_turn_years': avg_period * celestial_base_pairs
        }

    def to_schmidt_state(self, time: float = 0.0) -> SchmidtBridgeHexagonal:
        total_mass = sum(o.mass for o in self.orbits)
        total_angular_momentum = sum(o.mass * o.orbital_radius**2 / (o.orbital_period if o.orbital_period > 0 else 1e-10) for o in self.orbits if o.body != CelestialBody.SUN)
        inclinations = [o.orbital_inclination for o in self.orbits if o.body != CelestialBody.SUN]
        orbital_symmetry = 1.0 / (1.0 + np.std(inclinations))
        resonances = self.find_orbital_resonances()
        resonance_strength = min(len(resonances) / 10.0, 1.0)
        eccentricities = [o.orbital_eccentricity for o in self.orbits if o.body != CelestialBody.SUN]
        stability = 1.0 - np.mean(eccentricities)
        complexity = min(len(self.orbits) / 10.0, 1.0)

        metrics = np.array([total_mass / 333000.0, total_angular_momentum / 1e43, orbital_symmetry, resonance_strength, stability, complexity])
        metrics = metrics / metrics.sum()
        return SchmidtBridgeHexagonal(lambdas=metrics)


class CelestialDNAVisualizer:
    def __init__(self, celestial_dna: CelestialDNA):
        self.dna = celestial_dna
        self.colors = {
            CelestialBody.SUN: 'yellow', CelestialBody.MERCURY: 'gray', CelestialBody.VENUS: 'orange',
            CelestialBody.EARTH: 'blue', CelestialBody.MARS: 'red', CelestialBody.JUPITER: 'brown',
            CelestialBody.SATURN: 'gold', CelestialBody.URANUS: 'cyan', CelestialBody.NEPTUNE: 'darkblue'
        }

    def plot_helices_3d(self, time_range: Tuple[float, float] = (0, 200), n_points: int = 500, show_dna_structure: bool = True):
        fig = plt.figure(figsize=(15, 10))
        ax = fig.add_subplot(111, projection='3d')
        trajectories = self.dna.calculate_all_trajectories(time_range, n_points)
        for body, traj in trajectories.items():
            color = self.colors.get(body, 'gray')
            ax.plot(traj[:, 0], traj[:, 1], traj[:, 2], color=color, linewidth=1.5, alpha=0.7, label=body.name)

        ax.set_xlabel('X (ly)')
        ax.set_ylabel('Y (ly)')
        ax.set_zlabel('Z (ly)')
        ax.set_title('Solar System: 9-Stranded DNA Structure')
        ax.legend()
        return fig
