import math
import numpy as np
from typing import Dict, List, Tuple, Optional
from project_avalon.core.hypercore_geometry import get_mandala_pos, get_dna_pos, get_hypercore_pos
from project_avalon.core.bio_arkhe import BioAgent, ArkheGenome, MorphogeneticField, MAX_NEIGHBORS
from project_avalon.core.particle_system import BioParticleEngine

class UnifiedParticleSystem:
    """
    Sistema de partículas unificado que orquestra estados de consciência:
    - MANDALA: Ordem/Proteção
    - DNA: Vida/Evolução
    - HYPERCORE: Consciência 4D
    - BIOGENESIS: Emergência de Organismo Vivo
    """

    def __init__(self, num_particles=120):
        self.time = 0.0
        self.current_mode = "MANDALA"
        self.target_mode = "MANDALA"
        self.transition_progress = 1.0
        self.transition_speed = 0.02

        # O motor Bio-Gênese que gerencia agentes autônomos
        self.engine = BioParticleEngine(num_agents=num_particles)

    def set_mode(self, new_mode):
        """Inicia transição para novo modo."""
        allowed = ["MANDALA", "DNA", "HYPERCORE", "BIOGENESIS"]
        if new_mode in allowed and new_mode != self.target_mode:
            self.current_mode = self.target_mode if self.transition_progress >= 1.0 else self.current_mode
            self.target_mode = new_mode
            self.transition_progress = 0.0
            print(f"🔄 Transição iniciada: {self.current_mode} -> {self.target_mode}")

    def update(self, dt):
        """Atualiza o sistema."""
        self.time += dt

        # 1. Atualiza progresso da transição
        if self.transition_progress < 1.0:
            self.transition_progress += self.transition_speed
            if self.transition_progress >= 1.0:
                self.transition_progress = 1.0
                self.current_mode = self.target_mode

        # 2. Atualiza o motor biológico (ele sempre roda em background para manter a 'vida')
        # Se estivermos em BIOGENESIS, os agentes são guiados pelo campo.
        # Caso contrário, eles são atraídos para formas geométricas.

        if self.target_mode == "BIOGENESIS":
            self.engine.update(dt)
        else:
            # Modos Geométricos (Top-Down)
            num_p = len(self.engine.agents)
            for i, agent in self.engine.agents.items():
                # Calcula posição alvo geométrica
                if self.target_mode == "MANDALA":
                    target = get_mandala_pos(i, num_p, self.time)
                elif self.target_mode == "DNA":
                    target = get_dna_pos(i, num_p, self.time)
                else: # HYPERCORE
                    target = get_hypercore_pos(i, num_p, self.time)

                # Escala do campo (0-100) para geometria (-5 a 5 aprox)
                # Mapeia [-5, 5] para [45, 55] no grid
                world_target = target * 10.0 + 50.0

                # Se estiver em transição, interpola com a posição atual
                if self.transition_progress < 1.0:
                    t = self.transition_progress
                    smooth_t = t * t * (3 - 2 * t)
                    # Força de atração para a geometria
                    force = (world_target - agent.position) * 0.1
                    agent.update_state(force, dt)
                else:
                    # Trava na geometria com leve suavização
                    agent.position = agent.position * 0.8 + world_target * 0.2

                # Adiciona ruído
                agent.position += np.random.normal(0, 0.002, 3)

    def get_particle_data(self):
        """Retorna dados para o renderer."""
        positions, energies, neighbors = self.engine.get_render_data()

        # Converte posições de volta para escala do mundo visual (centralizado em 0)
        visual_positions = [(np.array(p) - 50.0) / 10.0 for p in positions]

        colors = []
        sizes = []
        for i, energy in enumerate(energies):
            colors.append(self._get_color(energy, i))
            sizes.append(1.0 + len(neighbors[i]) * 0.2)

        return {
            'positions': [p.tolist() for p in visual_positions],
            'colors': colors,
            'sizes': sizes,
            'mode': self.target_mode,
            'transition': self.transition_progress
        }

    def _get_color(self, energy, index):
        mode = self.target_mode
        if mode == "MANDALA":
            hue, sat, val = 0.12, 0.8, 0.7 + 0.3 * energy
        elif mode == "DNA":
            hue, sat, val = 0.5, 0.9, 0.6 + 0.4 * math.sin(self.time + index * 0.1)
        elif mode == "HYPERCORE":
            hue, sat, val = 0.8, 0.7, 0.5 + 0.5 * math.sin(self.time * 2 + index * 0.05)
        else: # BIOGENESIS
            hue = 0.3 + (energy * 0.2)
            sat, val = 0.8, 0.8
        return self.hsv_to_rgb(hue, sat, val)

    def hsv_to_rgb(self, h, s, v):
        i = int(h * 6.0)
        f = (h * 6.0) - i
        p = v * (1.0 - s)
        q = v * (1.0 - s * f)
        t = v * (1.0 - s * (1.0 - f))
        i = i % 6
        if i == 0: rgb = (v, t, p)
        elif i == 1: rgb = (q, v, p)
        elif i == 2: rgb = (p, v, t)
        elif i == 3: rgb = (p, q, v)
        elif i == 4: rgb = (t, p, v)
        else: rgb = (v, p, q)
        return [float(rgb[0]), float(rgb[1]), float(rgb[2]), 1.0]
