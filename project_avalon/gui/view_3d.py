from project_avalon.core.unified_particle_system import UnifiedParticleSystem
import numpy as np

class ConsciousnessVisualizer3D:
    """
    Integrador de visualização 3D para estados de consciência.
    Conecta o UnifiedParticleSystem com a interface gráfica e dados EEG.
    """

    def __init__(self, num_particles=120):
        # Sistema de partículas (Orquestrador Bio-Arkhe)
        self.particle_system = UnifiedParticleSystem(num_particles=num_particles)

        # Estado do Biofeedback
        self.attention_level = 0.5
        self.meditation_level = 0.5
        self.emotional_coherence = 0.5

    def update_from_eeg(self, eeg_data):
        """
        Atualiza visualização baseada em dados EEG reais ou simulados.
        """
        if eeg_data:
            self.attention_level = getattr(eeg_data, 'attention', 50) / 100.0
            self.meditation_level = getattr(eeg_data, 'meditation', 50) / 100.0
            self.emotional_coherence = getattr(eeg_data, 'coherence', 0.5)

            # Lógica de troca de modo
            if self.emotional_coherence > 0.8:
                # Alta coerência ativa a Biogênese
                self.particle_system.set_mode("BIOGENESIS")
            elif self.attention_level > 0.7:
                self.particle_system.set_mode("DNA")
            elif self.meditation_level > 0.7:
                self.particle_system.set_mode("HYPERCORE")
            else:
                self.particle_system.set_mode("MANDALA")

    def handle_interaction(self, x, y, z=0):
        """
        Injeta um sinal de atração no campo morfogenético.
        Mapeia coordenadas de tela/mouse para o espaço do campo (0-100).
        """
        # Converte de [-5, 5] para [0, 100]
        field_x = (x * 10.0) + 50.0
        field_y = (y * 10.0) + 50.0
        field_z = (z * 10.0) + 50.0

        pos = np.array([field_x, field_y, field_z])
        self.particle_system.engine.inject_signal(pos, strength=20.0)
        print(f"📡 Sinal Bio-Arkhe injetado em: {pos}")

    def render_frame(self, dt):
        """
        Gera um frame da visualização.
        """
        # Atualiza sistema (física e lógica)
        self.particle_system.update(dt)

        # Obtém dados para renderização
        data = self.particle_system.get_particle_data()

        # Adiciona conexões de rede se estiver em modos complexos
        if data['mode'] in ["HYPERCORE", "BIOGENESIS"]:
            data['connections'] = self._get_network_lines()

        return data

    def _get_network_lines(self):
        """Retorna lista de pares de posições (visual) para desenhar arestas."""
        lines = []
        agents = self.particle_system.engine.agents
        for i, agent in agents.items():
            for neighbor_id in agent.neighbors:
                if neighbor_id in agents:
                    # Converte para espaço visual [-5, 5]
                    p1 = (agent.position - 50.0) / 10.0
                    p2 = (agents[neighbor_id].position - 50.0) / 10.0
                    lines.append((p1.tolist(), p2.tolist()))
        return lines

    def get_hud_data(self):
        """Retorna informações para o overlay da interface."""
        data = self.particle_system.get_particle_data()
        engine_state = self.particle_system.engine.state
        return {
            'mode': data['mode'],
            'transition': f"{data['transition']*100:.1f}%",
            'attention': f"{self.attention_level*100:.1f}%",
            'meditation': f"{self.meditation_level*100:.1f}%",
            'coherence': f"{self.emotional_coherence*100:.1f}%",
            'energy': f"{engine_state.total_energy:.3f}",
            'connectivity': f"{engine_state.structure_coherence:.3f}"
        }
