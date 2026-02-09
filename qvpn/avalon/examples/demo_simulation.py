#!/usr/bin/env python
"""
Demo Simulation - Rapid system demonstration
"""
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from scipy.ndimage import gaussian_filter

def run_demo():
    """Executes visual demonstration"""
    print("🎮 PROJECT AVALON DEMONSTRATION")
    print("="*50)

    # Create example manifold
    size = 80
    x = np.linspace(-5, 5, size)
    y = np.linspace(-5, 5, size)
    X, Y = np.meshgrid(x, y)

    # Manifold with "trauma"
    healthy = 0.5 * (X**2 + Y**2)
    trauma = -2 * np.exp(-(X**2 + Y**2) / 2)
    manifold = healthy + trauma

    # Apply smoothing (simulated Ricci Flow)
    smoothed = gaussian_filter(manifold, sigma=2)

    # Visualize
    fig = plt.figure(figsize=(15, 5))

    # Before
    ax1 = fig.add_subplot(131, projection='3d')
    ax1.plot_surface(X, Y, manifold, cmap='plasma', alpha=0.8)
    ax1.set_title('Before - With Trauma')

    # After
    ax2 = fig.add_subplot(132, projection='3d')
    ax2.plot_surface(X, Y, smoothed, cmap='viridis', alpha=0.8)
    ax2.set_title('After - With Ricci Flow')

    # Difference
    ax3 = fig.add_subplot(133, projection='3d')
    diff = smoothed - manifold
    ax3.plot_surface(X, Y, diff, cmap='RdBu_r', alpha=0.8)
    ax3.set_title('Curvature Reduction')

    plt.suptitle('Geometric Healing Process', fontsize=16)
    plt.tight_layout()
    plt.savefig('demo_result.png', dpi=150)

    print("✅ Demonstration complete!")
    print("📊 Visualization saved: demo_result.png")
    print("\nTo execute the full system:")
    print("  PYTHONPATH=. python qvpn/avalon/avalon_kernel.py --quick-test")

if __name__ == "__main__":
    run_demo()
