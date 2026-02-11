"""
VIEW_3D v3.0 - Visualizador Pyglet para Bio-Gênese Cognitiva
Renderização otimizada com instancing e feedback visual rico
"""

import pyglet
from pyglet.gl import *
import numpy as np
import sys
import os

# Adiciona diretório pai ao path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class BioGenesisViewer(pyglet.window.Window):
    """
    Janela principal de visualização 3D.
    Implementa controles de câmera orbital e seleção de agentes.
    """

    def __init__(self, width: int = 1200, height: int = 800):
        super().__init__(width, height, "Bio-Gênese Cognitiva v3.0",
                        resizable=True, vsync=True)

        # Configuração OpenGL
        glEnable(GL_DEPTH_TEST)
        glEnable(GL_BLEND)
        glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)
        glEnable(GL_POINT_SMOOTH)
        glEnable(GL_LINE_SMOOTH)
        glHint(GL_LINE_SMOOTH_HINT, GL_NICEST)

        # Importa e inicializa motor
        from core.particle_system import BioGenesisEngine
        self.engine = BioGenesisEngine(num_agents=250)

        # Controles de câmera orbital
        self.camera = {
            'distance': 180.0,
            'rotation_x': 30.0,
            'rotation_y': 45.0,
            'target': np.array([50.0, 50.0, 50.0])
        }

        # Estado da interface
        self.paused = False
        self.show_connections = True
        self.selected_agent_id = None
        self.frame_count = 0

        # Elementos de UI
        self._setup_ui()

        # Agenda atualizações
        pyglet.clock.schedule_interval(self.update, 1/60.0)

    def _setup_ui(self):
        """Configura elementos de interface."""
        self.stats_label = pyglet.text.Label(
            '', x=10, y=self.height - 30,
            font_size=11, color=(0, 255, 200, 255),
            font_name='Consolas'
        )

        self.agent_info_label = pyglet.text.Label(
            '', x=10, y=self.height - 200,
            font_size=10, color=(255, 255, 200, 255),
            multiline=True, width=380,
            font_name='Consolas'
        )

        self.help_label = pyglet.text.Label(
            '[ESPAÇO] Pausar  [C] Conexões  [R] Reiniciar  [Click] Selecionar',
            x=10, y=10, font_size=9, color=(150, 150, 150, 255)
        )

    def update(self, dt: float):
        """Atualiza simulação e interface."""
        if not self.paused:
            self.engine.update(dt)
            self.frame_count += 1

        # Atualiza estatísticas a cada 10 frames
        if self.frame_count % 10 == 0:
            stats = self.engine.get_stats()
            self.stats_label.text = (
                f"Agentes: {stats['agents']} | "
                f"Tempo: {stats['time']:.1f}s | "
                f"Vínculos: {stats['bonds']} | "
                f"Mortes: {stats['deaths']} | "
                f"Saúde Média: {stats['avg_health']:.3f}"
            )

            # Atualiza info do agente selecionado
            if self.selected_agent_id is not None:
                info = self.engine.get_agent_info(self.selected_agent_id)
                if info:
                    text = f"Agente #{info['id']} | {info['state'].upper()}\n"
                    text += f"Saúde: {info['health']} | Idade: {info['age']}\n"
                    text += f"Genoma: C={info['genome']['C']} I={info['genome']['I']} "
                    text += f"E={info['genome']['E']} F={info['genome']['F']}\n"
                    text += f"Conexões: {info['connections']} | Perfil: {info['profile']}\n"
                    text += f"Preferências: {info['preferences']}"

                    if 'cognitive_state' in info:
                        cog = info['cognitive_state']
                        text += f"\nExploração: {cog['exploration_rate']} | "
                        text += f"Memórias: {cog['memory_size']}"

                    self.agent_info_label.text = text
                else:
                    self.selected_agent_id = None

    def on_draw(self):
        """Renderiza cena 3D e interface."""
        self.clear()

        # Configura câmera 3D
        self._setup_3d_projection()

        # Obtém dados do motor
        positions, healths, connections, profiles = self.engine.get_render_data()

        # Desenha conexões sociais
        if self.show_connections and positions:
            self._draw_connections(positions, connections, profiles)

        # Desenha agentes
        if positions:
            self._draw_agents(positions, healths, profiles)

        # Desenha interface 2D
        self._draw_interface()

    def _setup_3d_projection(self):
        """Configura matriz de projeção 3D."""
        glViewport(0, 0, self.width, self.height)

        glMatrixMode(GL_PROJECTION)
        glLoadIdentity()
        gluPerspective(60.0, self.width / float(self.height), 1.0, 1000.0)

        glMatrixMode(GL_MODELVIEW)
        glLoadIdentity()

        # Posiciona câmera orbital
        glTranslatef(0, 0, -self.camera['distance'])
        glRotatef(self.camera['rotation_x'], 1, 0, 0)
        glRotatef(self.camera['rotation_y'], 0, 1, 0)
        glTranslatef(-50, -50, -50)  # Centraliza no campo

    def _draw_connections(self, positions, connections, profiles):
        """Desenha linhas de conexão entre agentes."""
        glBegin(GL_LINES)

        # Mapeia posições por índice para lookup rápido
        pos_dict = {i: pos for i, pos in enumerate(positions)}

        for i, conns in enumerate(connections):
            if i >= len(positions):
                continue

            x1, y1, z1 = positions[i]

            for conn_id in conns:
                if conn_id in pos_dict and conn_id > i:  # Evita duplicatas
                    x2, y2, z2 = pos_dict[conn_id]

                    # Cor baseada no tipo de conexão
                    if profiles[i] == "Especialista" or profiles[conn_id] == "Especialista":
                        glColor4f(0.0, 0.8, 1.0, 0.4)  # Ciano para especialistas
                    else:
                        glColor4f(0.5, 0.5, 0.5, 0.2)  # Cinza para outros

                    glVertex3f(x1, y1, z1)
                    glVertex3f(x2, y2, z2)

        glEnd()

    def _draw_agents(self, positions, healths, profiles):
        """Desenha agentes como pontos coloridos."""
        glPointSize(8.0)
        glBegin(GL_POINTS)

        for i, (pos, health, profile) in enumerate(zip(positions, healths, profiles)):
            x, y, z = pos

            # Seleção de cor baseada no perfil cognitivo
            if profile == "Especialista":
                r, g, b = 0.0, 1.0, 0.2      # Verde brilhante
            elif profile == "Aprendiz":
                r, g, b = 1.0, 0.9, 0.0      # Amarelo
            elif profile == "Explorador":
                r, g, b = 0.0, 0.6, 1.0      # Azul claro
            elif profile == "Cauteloso":
                r, g, b = 1.0, 0.4, 0.0      # Laranja
            else:  # Neófito ou inexperiente
                r, g, b = 0.5, 0.5, 0.8      # Azul acinzentado

            # Modulação por saúde (agentes fracos ficam mais escuros)
            health_factor = 0.4 + health * 0.6
            r *= health_factor
            g *= health_factor
            b *= health_factor

            # Agente selecionado é destacado em branco
            if self.selected_agent_id == i:
                r, g, b = 1.0, 1.0, 1.0

            glColor3f(r, g, b)
            glVertex3f(x, y, z)

        glEnd()

        # Desenha halo para agente selecionado
        if self.selected_agent_id is not None and self.selected_agent_id < len(positions):
            glPointSize(14.0)
            glBegin(GL_POINTS)
            glColor4f(1.0, 1.0, 1.0, 0.3)
            pos = positions[self.selected_agent_id]
            glVertex3f(pos[0], pos[1], pos[2])
            glEnd()

    def _draw_interface(self):
        """Desenha elementos de interface 2D."""
        # Muda para projeção ortográfica
        glMatrixMode(GL_PROJECTION)
        glPushMatrix()
        glLoadIdentity()
        gluOrtho2D(0, self.width, 0, self.height)

        glMatrixMode(GL_MODELVIEW)
        glPushMatrix()
        glLoadIdentity()

        # Desenha labels
        self.stats_label.draw()
        self.agent_info_label.draw()
        self.help_label.draw()

        # Legenda de cores
        legend_y = self.height - 280
        legend_items = [
            ("🟢 Especialista (>75% sucesso)", (0, 255, 50)),
            ("🟡 Aprendiz (45-75%)", (255, 230, 0)),
            ("🔵 Explorador (curioso)", (0, 150, 255)),
            ("🟠 Cauteloso (<25%)", (255, 100, 0)),
            ("⚪ Neófito (inexperiente)", (150, 150, 200))
        ]

        for i, (text, color) in enumerate(legend_items):
            label = pyglet.text.Label(
                text, x=self.width - 250, y=legend_y - i * 20,
                font_size=9, color=(*color, 255)
            )
            label.draw()

        # Restaura projeção 3D
        glPopMatrix()
        glMatrixMode(GL_PROJECTION)
        glPopMatrix()
        glMatrixMode(GL_MODELVIEW)

    def on_mouse_drag(self, x, y, dx, dy, buttons, modifiers):
        """Rotaciona câmera com mouse."""
        if buttons & pyglet.window.mouse.LEFT:
            self.camera['rotation_y'] += dx * 0.5
            self.camera['rotation_x'] += dy * 0.5
            self.camera['rotation_x'] = max(-89, min(89, self.camera['rotation_x']))

    def on_mouse_scroll(self, x, y, scroll_x, scroll_y):
        """Zoom com scroll do mouse."""
        self.camera['distance'] += scroll_y * 8
        self.camera['distance'] = max(50, min(400, self.camera['distance']))

    def on_mouse_press(self, x, y, button, modifiers):
        """Seleciona agente ao clicar."""
        if button == pyglet.window.mouse.LEFT:
            # Seleção cíclica simples
            positions, _, _, _ = self.engine.get_render_data()
            if positions:
                if self.selected_agent_id is None:
                    self.selected_agent_id = 0
                else:
                    self.selected_agent_id = (self.selected_agent_id + 1) % len(positions)

        elif button == pyglet.window.mouse.RIGHT:
            # Injeção de sinal na "posição do mouse" (simplificado)
            self.engine.inject_signal(50, 50, 50, 20.0)

    def on_key_press(self, symbol, modifiers):
        """Controles de teclado."""
        if symbol == pyglet.window.key.SPACE:
            self.paused = not self.paused

        elif symbol == pyglet.window.key.C:
            self.show_connections = not self.show_connections

        elif symbol == pyglet.window.key.R:
            # Reinicia simulação
            from core.particle_system import BioGenesisEngine
            self.engine = BioGenesisEngine(num_agents=250)
            self.selected_agent_id = None
            self.frame_count = 0

        elif symbol == pyglet.window.key.ESCAPE:
            self.close()

    def run(self):
        """Inicia loop principal."""
        pyglet.app.run()


def main():
    """Ponto de entrada do visualizador."""
    print("=" * 70)
    print("🧬 BIO-GÊNESE COGNITIVA v3.0")
    print("=" * 70)
    print("Sistema de vida artificial com aprendizado Hebbiano")
    print("Cada agente possui um cérebro que aprende com experiência")
    print("\nControles:")
    print("  Mouse Esquerdo + Arrastar: Rotacionar câmera")
    print("  Scroll: Zoom")
    print("  Clique Esquerdo: Selecionar agente")
    print("  C: Mostrar/Esconder conexões")
    print("  ESPAÇO: Pausar/Continuar")
    print("  R: Reiniciar simulação")
    print("=" * 70 + "\n")

    try:
        window = BioGenesisViewer()
        window.run()
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
