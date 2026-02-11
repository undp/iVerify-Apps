"""
🧬 BIO-ARKHE: Active Component Assembly Architecture
Implementação dos 5 Princípios Biológicos de Inteligência.
"""

import numpy as np
from dataclasses import dataclass
from typing import List, Tuple, Dict, Optional, Set

# Constantes de Vida
MAX_NEIGHBORS = 6  # Simetria Hexagonal (Packing eficiente)
SIGNAL_DECAY = 0.95 # O sinal enfraquece com a distância
ASSEMBLY_THRESHOLD = 0.8 # Afinidade necessária para ligação

@dataclass
class ArkheGenome:
    """O DNA do Agente: Define sua personalidade e função."""
    C: float  # Chemistry: Força de ligação (Afinidade)
    I: float  # Information: Capacidade de restrição/memória
    E: float  # Energy: Mobilidade/Taxa de mudança
    F: float  # Function: Frequência/Intensidade de sinalização

class MorphogeneticField:
    """
    O Meio Ambiente Ativo.
    Mantém o mapa de sinais que guia a auto-montagem.
    """
    def __init__(self, size=(100, 100, 100)):
        self.size = size
        self.signal_grid = np.zeros(size)

    def get_local_gradient(self, position: np.ndarray) -> np.ndarray:
        """Calcula gradiente local do campo de sinal"""
        x, y, z = position.astype(int)

        # Garante que estamos dentro dos limites
        x = max(1, min(self.size[0] - 2, x))
        y = max(1, min(self.size[1] - 2, y))
        z = max(1, min(self.size[2] - 2, z))

        # Calcula gradiente usando diferenças finitas
        dx = (self.signal_grid[x+1, y, z] - self.signal_grid[x-1, y, z]) / 2.0
        dy = (self.signal_grid[x, y+1, z] - self.signal_grid[x, y-1, z]) / 2.0
        dz = (self.signal_grid[x, y, z+1] - self.signal_grid[x, y, z-1]) / 2.0

        gradient = np.array([dx, dy, dz])

        # Normaliza se não for zero
        norm = np.linalg.norm(gradient)
        if norm > 1e-6:
            gradient = gradient / norm

        return gradient

    def get_signal_at(self, position: np.ndarray) -> float:
        """Obtém valor do sinal em posição específica"""
        x, y, z = position.astype(int)
        if 0 <= x < self.size[0] and 0 <= y < self.size[1] and 0 <= z < self.size[2]:
            return self.signal_grid[x, y, z]
        return 0.0

    def _diffuse_signal(self):
        """Aplica difusão simples ao campo de sinal"""
        # Kernel de difusão 3D simplificado
        # Em produção, usaria scipy.ndimage.gaussian_filter
        from scipy.ndimage import uniform_filter
        self.signal_grid = uniform_filter(self.signal_grid, size=3)
        self.signal_grid *= SIGNAL_DECAY

class BioAgent:
    """
    A Célula Autônoma com física melhorada
    """

    def __init__(self, id: int, position: np.ndarray, genome: ArkheGenome, velocity: np.ndarray = None):
        self.id = id
        self.position = position.astype(np.float32)
        self.velocity = velocity if velocity is not None else np.zeros(3, dtype=np.float32)
        self.genome = genome

        # Estado interno
        self.neighbors: List[int] = []
        self.health = 1.0  # Vitalidade do agente
        self.age = 0
        self.last_signal = 0.0

        # Memória de curto prazo (Princípio 3: Restrições Adaptativas)
        self.memory: List[Tuple[np.ndarray, float]] = []  # (posição, sinal)
        self.memory_capacity = max(3, int(genome.I * 10))

    def sense_environment(self, field: MorphogeneticField) -> Dict:
        """Coleta informações do ambiente"""
        signal_val = field.get_signal_at(self.position)
        gradient = field.get_local_gradient(self.position)

        # Armazena na memória
        self.memory.append((self.position.copy(), signal_val))
        if len(self.memory) > self.memory_capacity:
            self.memory.pop(0)

        return {
            'signal': signal_val,
            'gradient': gradient,
            'memory': self.memory.copy()
        }

    def decide_action(self, sensory_data: Dict, other_agents: Dict[int, 'BioAgent']) -> np.ndarray:
        """Decide ação baseada em percepção e genoma"""
        gradient = sensory_data['gradient']

        # Comportamento baseado no genoma
        if self.genome.C > 0.7:  # Social
            # Busca outros agentes
            avg_pos = np.zeros(3)
            count = 0
            # Amostragem para performance
            agent_ids = list(other_agents.keys())
            sample_size = min(10, len(agent_ids))
            sample_ids = np.random.choice(agent_ids, sample_size, replace=False)

            for other_id in sample_ids:
                if other_id != self.id:
                    other = other_agents[other_id]
                    dist = np.linalg.norm(other.position - self.position)
                    if dist < 20:
                        avg_pos += other.position
                        count += 1

            if count > 0:
                social_vector = (avg_pos / count - self.position)
                norm = np.linalg.norm(social_vector)
                if norm > 1e-6:
                    social_vector = social_vector / norm
                    gradient = gradient * 0.3 + social_vector * 0.7

        elif self.genome.F > 0.6:  # Explorador
            # Segue gradiente mais forte
            if np.linalg.norm(gradient) < 0.1:
                # Explora aleatoriamente se não há gradiente claro
                gradient = np.random.randn(3)
                norm = np.linalg.norm(gradient)
                if norm > 1e-6:
                    gradient = gradient / norm

        # Modifica pela energia
        action = gradient * self.genome.E

        return action

    def update_state(self, action: np.ndarray, dt: float):
        """Atualiza estado físico do agente"""
        # Atualiza velocidade com inércia
        self.velocity = self.velocity * 0.85 + action * 0.15

        # Limita velocidade máxima
        speed = np.linalg.norm(self.velocity)
        max_speed = self.genome.E * 3.0
        if speed > max_speed:
            self.velocity = self.velocity / speed * max_speed

        # Atualiza posição
        self.position += self.velocity * dt

        # Envelhece
        self.age += dt
