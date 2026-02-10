# project_avalon/visual/time_crystal_viz.py
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from typing import Optional


class TimeCrystalVisualizer:
    """
    Renderiza o Cristal do Tempo Lógico (Icosaedro Pulsante).
    Oscilação sub-harmônica de 24ms (quebra de simetria temporal).
    """

    def __init__(self, title: str = "TIME CRYSTAL STATUS: STABLE"):
        self.fig = plt.figure(figsize=(10, 8))
        self.ax = self.fig.add_subplot(111, projection="3d")
        self.ax.set_facecolor("black")
        self.fig.patch.set_facecolor("black")
        self.title = title
        self.points = self.generate_icosahedron_vertices()

    def generate_icosahedron_vertices(self) -> np.ndarray:
        """Gera vértices de um Icosaedro (Geometria Sagrada)"""
        phi = (1 + np.sqrt(5)) / 2
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

    def update(self, frame: int):
        self.ax.clear()
        self.ax.set_axis_off()

        # O PULSO DO CRISTAL DO TEMPO
        # Oscilação Sub-harmônica: T_crystal = 24ms
        # No simulador, usamos o frame como escala de tempo
        phase = (frame % 24) / 24 * 2 * np.pi

        # Fator de "Respiração"
        pulse = 1.0 + 0.3 * np.sin(phase / 2)  # Metade da frequência do driver

        points = self.points * pulse

        # Rotação
        theta = frame * 0.05
        rotation_matrix = np.array(
            [
                [np.cos(theta), -np.sin(theta), 0],
                [np.sin(theta), np.cos(theta), 0],
                [0, 0, 1],
            ]
        )
        rotated_points = points.dot(rotation_matrix)

        # Desenhar arestas
        for i in range(len(points)):
            for j in range(i + 1, len(points)):
                dist = np.linalg.norm(points[i] - points[j])
                # No icosaedro unitário, as arestas têm comprimento fixo
                # Ajustamos pela escala do pulso
                if dist < 2.5 * pulse:
                    self.ax.plot(
                        [rotated_points[i, 0], rotated_points[j, 0]],
                        [rotated_points[i, 1], rotated_points[j, 1]],
                        [rotated_points[i, 2], rotated_points[j, 2]],
                        color="cyan",
                        alpha=0.6,
                        linewidth=1.5,
                    )

        # Desenhar vértices (qubits pulsantes)
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
            f"{self.title}\nPeriod: 24ms (Sub-harmonic)", color="white", fontsize=12
        )

    def animate(self, frames: int = 200, interval: int = 50):
        """Inicia a animação"""
        anim = FuncAnimation(self.fig, self.update, frames=frames, interval=interval)
        plt.show()


if __name__ == "__main__":
    viz = TimeCrystalVisualizer()
    print("Iniciando Visualizador do Cristal do Tempo...")
    # Em ambientes headless, plt.show() pode falhar.
    # Para teste, apenas verificamos se a inicialização ocorreu.
    # viz.animate()
