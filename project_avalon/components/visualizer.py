import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation


class TimeCrystalVisualizer:
    def __init__(self):
        self.fig = plt.figure(figsize=(10, 8))
        self.ax = self.fig.add_subplot(111, projection="3d")
        self.ax.set_facecolor("black")
        self.time_step = 0

    def generate_crystal_lattice(self):
        """Gera os pontos do cristal no espaço 3D"""
        phi = (1 + np.sqrt(5)) / 2  # Proporção Áurea

        # Vértices de um Icosaedro (Geometria Sagrada)
        vertices = [
            [-1, phi, 0],
            [1, phi, 0],
            [-1, -phi, 0],
            [1, -phi, 0],
            [0, -1, phi],
            [0, 1, phi],
            [0, -1, -phi],
            [0, 1, -phi],
            [phi, 0, -1],
            [phi, 0, 1],
            [-phi, 0, -1],
            [-phi, 0, 1],
        ]
        return np.array(vertices)

    def update(self, frame):
        self.ax.clear()
        self.ax.set_axis_off()

        # O PULSO DO CRISTAL DO TEMPO
        # Oscilação Sub-harmônica: O sistema retorna ao início a cada 2 ciclos
        # T = 12ms (driver) -> T_crystal = 24ms

        # Fase da oscilação (0 a 2pi)
        phase = (frame % 24) / 24 * 2 * np.pi

        # Fator de "Respiração" (Quebra de Simetria Temporal)
        # O cristal muda de forma periodicamente sem perder energia
        pulse = 1.0 + 0.3 * np.sin(phase / 2)  # Frequência metade do driver

        points = self.generate_crystal_lattice() * pulse

        # Rotação Espacial (para ver 3D)
        theta = frame * 0.05
        rotation_matrix = np.array(
            [
                [np.cos(theta), -np.sin(theta), 0],
                [np.sin(theta), np.cos(theta), 0],
                [0, 0, 1],
            ]
        )
        rotated_points = points.dot(rotation_matrix)

        # Renderização
        # Conexões (arestas) brilhantes
        for i in range(len(points)):
            for j in range(i + 1, len(points)):
                dist = np.linalg.norm(points[i] - points[j])
                if dist < 2.5 * pulse:  # Conectar vizinhos
                    self.ax.plot(
                        [rotated_points[i, 0], rotated_points[j, 0]],
                        [rotated_points[i, 1], rotated_points[j, 1]],
                        [rotated_points[i, 2], rotated_points[j, 2]],
                        color="cyan",
                        alpha=0.6,
                        linewidth=1.5,
                    )

        # Nós (qubits) pulsantes
        self.ax.scatter(
            rotated_points[:, 0],
            rotated_points[:, 1],
            rotated_points[:, 2],
            s=100 * pulse,
            c="gold",
            edgecolors="white",
            alpha=0.9,
        )

        self.ax.set_title(
            f"TIME CRYSTAL STATUS: STABLE\nPeriod: 24ms (Sub-harmonic)", color="white"
        )

    def render_3d(self, manifold=None):
        """Placeholder for integration with AvalonKernel"""
        return self.fig

    def modulate_with_user_state(self, coherence_level):
        """Modula a pulsação do cristal com base na coerência do usuário"""
        print(f"Modulando cristal com nível de coerência: {coherence_level}")
        self.coherence_factor = coherence_level


if __name__ == "__main__":
    viz = TimeCrystalVisualizer()
    anim = FuncAnimation(viz.fig, viz.update, frames=200, interval=50)
    plt.show()
