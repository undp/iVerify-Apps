"""
BIO-GÊNESE: Active Component Assembly Engine
Substitui o sistema de partículas estáticas por agentes autônomos.
"""

import numpy as np
from typing import List, Dict, Tuple, Optional
import random
from dataclasses import dataclass
from project_avalon.core.bio_arkhe import BioAgent, ArkheGenome, MorphogeneticField

# Constantes do Sistema Vivo
INITIAL_POPULATION = 120 # Reduzido de 800 para manter compatibilidade e performance
FIELD_SIZE = (100, 100, 100)
SPAWN_RADIUS = 40
MUTATION_RATE = 0.01

@dataclass
class BioState:
    """Estado global do ecossistema"""
    time_step: int = 0
    total_energy: float = 0.0
    structure_coherence: float = 0.0
    signal_diversity: float = 0.0

class BioParticleEngine:
    """
    Motor principal que orquestra o ecossistema de agentes.
    Implementa os 5 princípios da inteligência biológica.
    """

    def __init__(self, num_agents: int = INITIAL_POPULATION):
        self.field = MorphogeneticField(size=FIELD_SIZE)
        self.agents: Dict[int, BioAgent] = {}
        self.agent_counter = 0
        self.state = BioState()
        self.signals: Dict[Tuple[int, int, int], float] = {}

        # Cria população inicial com diversidade genética
        self._create_primordial_soup(num_agents)

        # Adiciona fonte de sinal central
        self._add_signal_source(np.array(FIELD_SIZE) // 2, 10.0)

    def _create_primordial_soup(self, num_agents: int):
        """Cria a população inicial com diversidade genética"""
        center = np.array(FIELD_SIZE) // 2

        for i in range(num_agents):
            # Posição aleatória em esfera
            theta = random.random() * 2 * np.pi
            phi = random.random() * np.pi
            r = random.random() * SPAWN_RADIUS

            x = center[0] + r * np.sin(phi) * np.cos(theta)
            y = center[1] + r * np.sin(phi) * np.sin(theta)
            z = center[2] + r * np.cos(phi)

            # Genoma diversificado
            genome = ArkheGenome(
                C=random.uniform(0.3, 0.9),  # Química variada
                I=random.uniform(0.1, 0.7),  # Informação
                E=random.uniform(0.4, 1.0),  # Energia
                F=random.uniform(0.1, 0.5),  # Função
            )

            agent = BioAgent(
                id=self.agent_counter,
                position=np.array([x, y, z], dtype=np.float32),
                genome=genome,
                velocity=np.zeros(3)
            )

            self.agents[self.agent_counter] = agent
            self.agent_counter += 1

    def _add_signal_source(self, position: np.ndarray, strength: float):
        """Adiciona fonte de sinal ao campo morfogenético"""
        x, y, z = position.astype(int)
        # Clip to bounds
        x = max(0, min(FIELD_SIZE[0]-1, x))
        y = max(0, min(FIELD_SIZE[1]-1, y))
        z = max(0, min(FIELD_SIZE[2]-1, z))
        key = (x, y, z)
        self.signals[key] = strength

    def update(self, dt: float, external_signals: Optional[List] = None):
        """
        Atualiza o ecossistema completo
        """
        self.state.time_step += 1

        # 1. Processa sinais externos
        if external_signals:
            for sig in external_signals:
                pos = sig.get('position', np.array(FIELD_SIZE) // 2)
                strength = sig.get('strength', 5.0)
                self._add_signal_source(pos, strength)

        # 2. Atualiza campo morfogenético
        self._update_morphogenetic_field()

        # 3. Atualiza cada agente
        self._update_agents(dt)

        # 4. Processa interações e ligações
        self._process_interactions()

        # 5. Atualiza métricas do ecossistema
        self._update_ecosystem_metrics()

    def _update_morphogenetic_field(self):
        """Atualiza o campo com sinais de agentes e fontes externas"""
        # Limpa campo anterior
        self.field.signal_grid.fill(0)

        # Adiciona fontes de sinal fixas
        for (x, y, z), strength in self.signals.items():
            self.field.signal_grid[x, y, z] += strength

        # Adiciona emissões dos agentes
        for agent in self.agents.values():
            if agent.health > 0:
                emission = agent.genome.F * agent.genome.E * agent.health
                pos = agent.position.astype(int)
                x, y, z = pos

                # Emite para posição atual (protegido por limites)
                x = max(0, min(FIELD_SIZE[0]-1, x))
                y = max(0, min(FIELD_SIZE[1]-1, y))
                z = max(0, min(FIELD_SIZE[2]-1, z))
                self.field.signal_grid[x, y, z] += emission

        # Aplica difusão
        self.field._diffuse_signal()

    def _update_agents(self, dt: float):
        """Atualiza estado de todos os agentes"""
        for agent in list(self.agents.values()):
            if agent.health <= 0:
                continue

            # Coleta sensorial
            sensory_data = agent.sense_environment(self.field)

            # Decisão
            action = agent.decide_action(sensory_data, self.agents)

            # Ação (Física)
            agent.update_state(action, dt)

            # Mantém dentro dos limites do campo
            agent.position = np.clip(agent.position, 0, np.array(FIELD_SIZE) - 1)

            # Consome energia
            agent.health -= 0.001 * (1.0 - agent.genome.E)

            # Recupera energia em áreas de alto sinal
            local_signal = self.field.get_signal_at(agent.position)
            if local_signal > 5.0:
                agent.health += 0.002 * agent.genome.E

            agent.health = np.clip(agent.health, 0, 1.2)

    def _process_interactions(self):
        """Processa interações e forma ligações entre agentes"""
        agent_list = list(self.agents.values())

        for i, agent in enumerate(agent_list):
            if agent.health <= 0 or len(agent.neighbors) >= 6:
                continue

            for j, other in enumerate(agent_list[i+1:], i+1):
                if other.health <= 0 or len(other.neighbors) >= 6:
                    continue

                # Calcula distância
                diff = other.position - agent.position
                distance = np.linalg.norm(diff)

                # Verifica se estão próximos o suficiente para interagir
                if distance < 3.0:
                    # Calcula compatibilidade genética
                    compatibility = 1.0 - np.abs(agent.genome.C - other.genome.C)

                    # Chance de formar ligação baseada na compatibilidade
                    if compatibility > 0.8 and random.random() < 0.1:
                        if agent.id not in other.neighbors and other.id not in agent.neighbors:
                            agent.neighbors.append(other.id)
                            other.neighbors.append(agent.id)

                            # Reforça o sinal na posição da ligação
                            mid_point = (agent.position + other.position) / 2
                            x, y, z = mid_point.astype(int)
                            x = max(0, min(FIELD_SIZE[0]-1, x))
                            y = max(0, min(FIELD_SIZE[1]-1, y))
                            z = max(0, min(FIELD_SIZE[2]-1, z))
                            self.field.signal_grid[x, y, z] += 2.0

    def _update_ecosystem_metrics(self):
        """Atualiza métricas do ecossistema"""
        if not self.agents:
            return

        total_health = sum(agent.health for agent in self.agents.values())
        self.state.total_energy = total_health / len(self.agents)

        total_connections = sum(len(agent.neighbors) for agent in self.agents.values())
        max_connections = len(self.agents) * 6
        self.state.structure_coherence = total_connections / max_connections if max_connections > 0 else 0

        signal_values = self.field.signal_grid.flatten()
        self.state.signal_diversity = np.std(signal_values) / (np.mean(signal_values) + 1e-6)

    def get_render_data(self) -> Tuple[List[np.ndarray], List[float], List[List[int]]]:
        """Retorna dados para renderização"""
        positions = []
        energies = []
        connections = []

        for agent in self.agents.values():
            if agent.health > 0:
                positions.append(agent.position.copy())
                energies.append(agent.health)
                connections.append(agent.neighbors.copy())

        return positions, energies, connections

    def inject_signal(self, position: np.ndarray, strength: float = 10.0):
        """Injeta sinal em posição específica"""
        self._add_signal_source(position, strength)

    def clear_signals(self):
        """Limpa todos os sinais externos"""
        self.signals.clear()
