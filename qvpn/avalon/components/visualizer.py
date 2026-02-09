
"""
Visualizer - Simplified 3D visualization
"""
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import numpy as np

class Visualizer:
    def __init__(self):
        self.fig = None

    def render_3d(self, manifold, title="Neural Manifold"):
        """Renders manifold in 3D"""
        self.fig = plt.figure(figsize=(10, 8))
        ax = self.fig.add_subplot(111, projection='3d')

        x = np.linspace(-5, 5, manifold.shape[0])
        y = np.linspace(-5, 5, manifold.shape[1])
        X, Y = np.meshgrid(x, y)

        ax.plot_surface(X, Y, manifold, cmap='viridis', alpha=0.8)
        ax.set_title(title)
        ax.set_xlabel('X')
        ax.set_ylabel('Y')
        ax.set_zlabel('Potential')

        return self.fig

    def save(self, filename='visualization.png'):
        """Saves visualization"""
        if self.fig:
            self.fig.savefig(filename, dpi=150)
            plt.close(self.fig)
            print(f"✅ Visualization saved: {filename}")
