
"""
Ars Theurgia Goetia decoded through Arkhe hexagonal geometry.
"""

import numpy as np
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from enum import Enum
from project_avalon.core.schmidt_bridge import SchmidtBridgeHexagonal


class SpiritRank(Enum):
    KING = 1
    DUKE = 2
    MARQUIS = 3
    PRESIDENT = 4
    EARL = 5
    KNIGHT = 6


class ElementalDirection(Enum):
    EAST = 1
    WEST = 2
    NORTH = 3
    SOUTH = 4
    CENTER = 5


@dataclass
class AerialSpirit:
    number: int
    name: str
    rank: SpiritRank
    direction: ElementalDirection
    ruling_spirit: str
    appearance: str
    office: str
    servants: int
    seal_points: np.ndarray
    arkhe_coordinates: np.ndarray
    alternative_names: List[str] = field(default_factory=list)

    @classmethod
    def create_from_arkhe_point(cls, point_6d: np.ndarray, number: int) -> 'AerialSpirit':
        norm = np.linalg.norm(point_6d)
        if norm > 0: point_6d = point_6d / norm

        distance = np.linalg.norm(point_6d)
        if distance > 0.9: rank = SpiritRank.KING
        elif distance > 0.7: rank = SpiritRank.DUKE
        else: rank = SpiritRank.KNIGHT

        angle = np.arctan2(point_6d[1], point_6d[0])
        angle_deg = np.degrees(angle) % 360
        if 45 <= angle_deg < 135: direction = ElementalDirection.EAST
        elif 135 <= angle_deg < 225: direction = ElementalDirection.SOUTH
        elif 225 <= angle_deg < 315: direction = ElementalDirection.WEST
        else: direction = ElementalDirection.NORTH

        name = cls._generate_name_from_coordinates(point_6d)

        return cls(
            number=number,
            name=name,
            rank=rank,
            direction=direction,
            ruling_spirit="Oriens" if direction == ElementalDirection.EAST else "Paimon",
            appearance="Manifestation in Arkhe space",
            office="Geometric modulation",
            servants=100,
            seal_points=np.random.randn(6, 2),
            arkhe_coordinates=point_6d
        )

    @staticmethod
    def _generate_name_from_coordinates(coords: np.ndarray) -> str:
        syllables = ['Ba', 'Be', 'Ca', 'Ce', 'Da', 'De', 'El', 'Em']
        indices = np.abs(coords[:3] * 100).astype(int) % len(syllables)
        return "".join([syllables[i] for i in indices]) + "el"

    def calculate_resonance_frequency(self) -> float:
        product = np.prod(np.abs(self.arkhe_coordinates[self.arkhe_coordinates != 0]))
        return 7.83 * np.exp((product % 1.0) * np.log(963.0 / 7.83))

class ArsTheurgiaSystem:
    def __init__(self):
        self.spirits = []
        for i in range(31):
            point = np.random.randn(6)
            self.spirits.append(AerialSpirit.create_from_arkhe_point(point, i+1))
        print("🜂 Ars Theurgia System Initialized")

    def find_spirit_by_name(self, name: str) -> Optional[AerialSpirit]:
        for s in self.spirits:
            if s.name.lower() == name.lower(): return s
        return None

    def generate_invocation_sequence(self, purpose: str, n_spirits: int = 3) -> List[AerialSpirit]:
        return self.spirits[:n_spirits]
