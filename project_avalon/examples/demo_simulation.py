import sys
import os
# Add parent directory to path to allow imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from project_avalon.avalon_kernel import AvalonKernel
from project_avalon.components.visualizer import TimeCrystalVisualizer
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

def run_demo():
    print("🚀 Running Project Avalon Demo Simulation...")
    kernel = AvalonKernel()

    # Test session
    kernel.start_session(duration=5)

    # Show Time Crystal Visualizer
    print("🔮 Visualizing Time Crystal...")
    viz = kernel.visualizer
    anim = FuncAnimation(viz.fig, viz.update, frames=100, interval=50)
    plt.show()

if __name__ == "__main__":
    run_demo()
