"""
PARTICLE SYSTEM v3.0 - Motor de Simulação com Spatial Hashing
Complexidade O(N) para detecção de colisões e interações
"""

import numpy as np
import random
from collections import defaultdict
from typing import Dict, List, Tuple, Set, Optional

from .bio_arkhe import BioAgent, ArkheGenome, MorphogeneticField
from .constraint_engine import ConstraintLearner


class SpatialHash:
    """
    Estrutura de dados espacial para consultas de vizinhança O(1).
    Divide o espaço em células e indexa agentes por célula.
    """

    def __init__(self, cell_size: float = 5.0):
        self.cell_size = cell_size
        self.grid: Dict[Tuple[int, ...], Set[int]] = defaultdict(set)

    def _get_cell(self, position: np.ndarray) -> Tuple[int, ...]:
        """Calcula chave da célula para uma posição."""
        return tuple((position / self.cell_size).astype(int))

    def insert(self, agent_id: int, position: np.ndarray) -> None:
        """Adiciona agente ao hash espacial."""
        cell = self._get_cell(position)
        self.grid[cell].add(agent_id)

    def query(self, position: np.ndarray, radius: float) -> List[int]:
        """
        Retorna IDs de agentes dentro do raio especificado.
        Apenas verifica células dentro do raio (otimização crucial).
        """
        center_cell = self._get_cell(position)
        radius_cells = int(np.ceil(radius / self.cell_size))

        neighbors = []
        # Itera apenas sobre células potencialmente relevantes
        for dx in range(-radius_cells, radius_cells + 1):
            for dy in range(-radius_cells, radius_cells + 1):
                for dz in range(-radius_cells, radius_cells + 1):
                    cell_key = (center_cell[0] + dx,
                               center_cell[1] + dy,
                               center_cell[2] + dz)
                    neighbors.extend(self.grid.get(cell_key, []))
        return neighbors

    def clear(self) -> None:
        """Limpa o hash para novo frame."""
        self.grid.clear()


class BioGenesisEngine:
    """
    Motor principal da simulação Bio-Gênese.
    Gerencia agentes, campo morfogenético e interações sociais.
    """

    def __init__(self, num_agents: int = 300):
        self.field = MorphogeneticField((100, 100, 100))
        self.spatial_hash = SpatialHash(cell_size=5.0)

        self.agents: Dict[int, BioAgent] = {}
        self.next_id = 0
        self.simulation_time = 0.0

        # Fontes de sinal ambientais
        self.signal_sources = []

        # Estatísticas
        self.stats = {
            'births': 0,
            'deaths': 0,
            'bonds_formed': 0,
            'bonds_broken': 0
        }

        # Inicializa população com estrutura tribal
        self._initialize_population(num_agents)

        # Fontes de nutrientes iniciais
        self._add_initial_signal_sources()

    def _initialize_population(self, num_agents: int) -> None:
        """
        Cria população inicial com 3 tribos distintas.
        Cada tribo tem preferência química (C) similar, incentivando clustering.
        """
        # Centros das tribos
        tribe_centers = [
            np.array([25.0, 25.0, 50.0]),   # Tribo 1: C baixo
            np.array([50.0, 75.0, 50.0]),   # Tribo 2: C médio
            np.array([75.0, 50.0, 25.0])    # Tribo 3: C alto
        ]
        base_chemistry = [0.25, 0.50, 0.75]

        for i in range(num_agents):
            tribe = i % 3

            # Posição com distribuição gaussiana ao redor do centro tribal
            pos = (tribe_centers[tribe] +
                   np.random.randn(3).astype(np.float32) * 15)
            pos = np.clip(pos, 5, 94)

            # Genoma com química tribal + variação individual
            genome = ArkheGenome(
                C=np.clip(base_chemistry[tribe] + np.random.normal(0, 0.08), 0.1, 0.9),
                I=np.random.uniform(0.2, 0.8),
                E=np.random.uniform(0.4, 1.0),
                F=np.random.uniform(0.2, 0.8)
            )

            agent = BioAgent(self.next_id, pos[0], pos[1], pos[2], genome)
            brain = ConstraintLearner(self.next_id, genome.to_vector())
            agent.set_brain(brain)

            self.agents[self.next_id] = agent
            self.next_id += 1

    def _add_initial_signal_sources(self) -> None:
        """Adiciona fontes de nutrientes iniciais."""
        # Fonte central principal
        self.add_signal_source(np.array([50.0, 50.0, 50.0]), 25.0, float('inf'))

        # Fontes secundárias
        for _ in range(3):
            pos = np.random.rand(3) * 60 + 20
            self.add_signal_source(pos, 12.0, 500.0)

    def add_signal_source(self, position: np.ndarray,
                         strength: float,
                         duration: float = 200.0) -> None:
        """Adiciona fonte de sinal temporária ou permanente."""
        self.signal_sources.append({
            'position': position.copy(),
            'strength': strength,
            'duration': duration
        })

    def update(self, dt: float = 0.1) -> None:
        """
        Loop principal de simulação.
        Executa em ordem: campo físico → percepção → decisão → ação → aprendizado
        """
        self.simulation_time += dt

        # 1. Atualiza campo morfogenético (difusão e decaimento)
        self.field.diffuse_and_decay()

        # Processa fontes de sinal
        new_sources = []
        for source in self.signal_sources:
            self.field.add_signal(
                source['position'][0],
                source['position'][1],
                source['position'][2],
                source['strength']
            )
            if source['duration'] != float('inf'):
                source['duration'] -= 1
                if source['duration'] > 0:
                    new_sources.append(source)
        self.signal_sources = new_sources

        # 2. Atualiza hash espacial para consultas eficientes
        self.spatial_hash.clear()
        for agent in self.agents.values():
            if agent.is_alive():
                self.spatial_hash.insert(agent.id, agent.position)

        # Armazena saúde anterior para cálculo de delta
        previous_health = {
            aid: agent.health
            for aid, agent in self.agents.items()
            if agent.is_alive()
        }

        # 3. Processa comportamento de cada agente
        for agent in list(self.agents.values()):
            if not agent.is_alive():
                continue

            # Percepção: detecta sinais do campo
            signal_strength = self.field.get_signal_at(
                agent.position[0], agent.position[1], agent.position[2]
            )

            # Comportamento: quimiotaxia se sinal forte, exploração se fraco
            if signal_strength > 2.0:
                # Move-se em direção ao gradiente (fonte de nutrientes)
                gradient = self.field.get_gradient(
                    agent.position[0], agent.position[1], agent.position[2]
                )
                agent.velocity += gradient * agent.genome.E * 0.15
                agent.state = "foraging"

                # Absorve energia do campo
                agent.health = min(1.0, agent.health + 0.002 * agent.genome.E)
            else:
                # Exploração aleatória (movimento browniano)
                noise = np.random.randn(3).astype(np.float32) * 0.08
                agent.velocity += noise * agent.genome.E
                agent.state = "exploring"

            # Emissão de sinal (função F): agentes saudáveis sinalizam presença
            if agent.health > 0.6 and agent.genome.F > 0.4:
                self.field.add_signal(
                    agent.position[0], agent.position[1], agent.position[2],
                    agent.genome.F * 0.3
                )

            # Atualiza física
            agent.apply_physics(dt, self.field.size)

        # 4. Processa interações sociais (O(N) com spatial hash)
        self._process_interactions()

        # 5. Aprendizado Hebbiano baseado em mudanças de energia
        self._apply_learning_feedback(previous_health)

        # 6. Limpeza de agentes mortos
        self._cleanup_dead_agents()

    def _process_interactions(self) -> None:
        """
        Detecta colisões e processa interações sociais.
        Usa spatial hash para O(N) em vez de O(N²).
        """
        processed_pairs = set()

        for agent in self.agents.values():
            if not agent.is_alive():
                continue

            # Busca vizinhos próximos (raio de interação = 4 unidades)
            nearby_ids = self.spatial_hash.query(agent.position, radius=4.0)

            for other_id in nearby_ids:
                # Evita duplicatas e auto-interação
                if other_id <= agent.id:
                    continue
                if other_id not in self.agents:
                    continue

                other = self.agents[other_id]
                if not other.is_alive():
                    continue

                pair = tuple(sorted((agent.id, other_id)))
                if pair in processed_pairs:
                    continue
                processed_pairs.add(pair)

                # Calcula distância real
                dist = np.linalg.norm(agent.position - other.position)
                if dist > 3.5:  # Raio de interação efetiva
                    continue

                # Compatibilidade química (gene C)
                compatibility = 1.0 - abs(agent.genome.C - other.genome.C)

                # Se já conectados: metabolismo compartilhado
                if other_id in agent.connections:
                    # Energia trocada baseada na compatibilidade
                    energy_exchange = (compatibility - 0.5) * 0.012

                    if energy_exchange > 0:
                        # Simbiose benéfica
                        agent.health = min(1.0, agent.health + energy_exchange)
                        other.health = min(1.0, other.health + energy_exchange)

                        # Reforça vínculo
                        agent.bond_strengths[other_id] = min(
                            agent.bond_strengths.get(other_id, 0.5) + 0.008, 1.0
                        )
                        agent.state = "socializing"
                    else:
                        # Incompatibilidade: perda de energia
                        agent.health += energy_exchange  # valor negativo
                        other.health += energy_exchange
                else:
                    # Potencial nova conexão: avaliação cognitiva bilateral
                    if len(agent.connections) < 6 and len(other.connections) < 6:
                        if agent.brain and other.brain:
                            score_a = agent.brain.evaluate_partner(
                                other.genome, self.simulation_time
                            )[0]
                            score_b = other.brain.evaluate_partner(
                                agent.genome, self.simulation_time
                            )[0]

                            # Consenso para conexão (ambos devem querer)
                            if score_a > 0.05 and score_b > 0.05:
                                success = agent.form_bond(other,
                                    strength=(score_a + score_b) / 2)
                                if success:
                                    self.stats['bonds_formed'] += 1

                                    # Aprendizado positivo imediato
                                    agent.brain.learn_from_experience(
                                        other.genome, 0.1, self.simulation_time
                                    )
                                    other.brain.learn_from_experience(
                                        agent.genome, 0.1, self.simulation_time
                                    )
                            else:
                                # Aprendizado negativo (evitar no futuro)
                                if score_a < -0.2:
                                    agent.brain.learn_from_experience(
                                        other.genome, -0.05, self.simulation_time
                                    )
                                if score_b < -0.2:
                                    other.brain.learn_from_experience(
                                        agent.genome, -0.05, self.simulation_time
                                    )

    def _apply_learning_feedback(self, previous_health: Dict[int, float]) -> None:
        """
        Aplica aprendizado Hebbiano baseado na mudança de energia (delta).
        Distribui o "crédito" ou "culpa" entre os vizinhos conectados.
        """
        for agent_id, agent in self.agents.items():
            if not agent.is_alive() or not agent.brain:
                continue

            delta_health = agent.health - previous_health.get(agent_id, agent.health)

            # Aprendizado só ocorre se houve mudança significativa
            if abs(delta_health) > 0.0005 and agent.connections:
                # Divide o feedback entre os vizinhos
                share = delta_health / len(agent.connections)

                for neighbor_id in agent.connections:
                    if neighbor_id in self.agents:
                        neighbor = self.agents[neighbor_id]
                        if neighbor.is_alive() and neighbor.brain:
                            agent.brain.learn_from_experience(
                                neighbor.genome, share, self.simulation_time
                            )

    def _cleanup_dead_agents(self) -> None:
        """Remove agentes mortos e notifica vizinhos."""
        dead_ids = [
            aid for aid, agent in self.agents.items()
            if not agent.is_alive()
        ]

        for aid in dead_ids:
            agent = self.agents[aid]

            # Notifica vizinhos da morte (aprendizado negativo)
            for neighbor_id in agent.connections:
                if neighbor_id in self.agents:
                    neighbor = self.agents[neighbor_id]
                    neighbor.break_bond(aid)

                    if neighbor.brain:
                        neighbor.brain.learn_from_experience(
                            agent.genome, -0.2, self.simulation_time
                        )

            del self.agents[aid]
            self.stats['deaths'] += 1

    def inject_signal(self, x: float, y: float, z: float,
                     strength: float = 15.0) -> None:
        """API para injetar sinal externo (interação do usuário)."""
        self.field.add_signal(x, y, z, strength)

    def get_render_data(self) -> Tuple[List, List, List, List]:
        """
        Retorna dados para visualização.
        Formato: (posições, saúdes, conexões, perfis)
        """
        positions = []
        healths = []
        connections = []
        profiles = []

        for agent in self.agents.values():
            if not agent.is_alive():
                continue

            positions.append(agent.position.copy())
            healths.append(agent.health)
            connections.append(agent.connections.copy())

            if agent.brain:
                profiles.append(agent.brain.get_cognitive_profile())
            else:
                profiles.append("Sem cérebro")

        return positions, healths, connections, profiles

    def get_stats(self) -> dict:
        """Retorna estatísticas da simulação."""
        alive = [a for a in self.agents.values() if a.is_alive()]
        return {
            'agents': len(alive),
            'time': round(self.simulation_time, 1),
            'bonds': self.stats['bonds_formed'],
            'deaths': self.stats['deaths'],
            'avg_health': round(np.mean([a.health for a in alive]), 3) if alive else 0
        }

    def get_agent_info(self, agent_id: int) -> Optional[dict]:
        """Retorna informações detalhadas de um agente específico."""
        if agent_id not in self.agents:
            return None

        agent = self.agents[agent_id]
        if not agent.is_alive():
            return None

        info = {
            'id': agent.id,
            'position': agent.get_position(),
            'health': round(agent.health, 3),
            'age': round(agent.age, 1),
            'state': agent.state,
            'genome': {
                'C': round(agent.genome.C, 2),
                'I': round(agent.genome.I, 2),
                'E': round(agent.genome.E, 2),
                'F': round(agent.genome.F, 2)
            },
            'connections': len(agent.connections),
            'profile': (agent.brain.get_cognitive_profile()
                       if agent.brain else "N/A"),
            'preferences': (agent.brain.get_preferences()
                          if agent.brain else "N/A")
        }

        if agent.brain:
            cog = agent.brain.get_cognitive_state()
            info['cognitive_state'] = cog

        return info
