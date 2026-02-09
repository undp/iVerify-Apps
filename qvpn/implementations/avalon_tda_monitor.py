# avalon_tda_monitor.py

import numpy as np
from ripser import ripser
from persim import plot_diagrams
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings('ignore')

class TopologyMonitor:
    """
    Analyses the algebraic topology of neural activity (Manifold).
    Uses Persistent Homology to detect if the system is forming
    coherent geometric structures (Circles/Tori) or if it is collapsed/fragmented.
    """
    def __init__(self, window_size=100):
        self.history = []
        self.window_size = window_size

    def update(self, neural_state_vector):
        """
        Receives the current state of neurons (or LLM features)
        neural_state_vector: 1D array of activations
        """
        self.history.append(neural_state_vector)
        if len(self.history) > self.window_size:
            self.history.pop(0)

    def compute_persistence(self):
        """
        Calculates Betti numbers and Persistence Diagrams.
        Returns: Clinical-Topological Diagnosis
        """
        if len(self.history) < 10:
            return {"status": "CALIBRATING...", "H1_persistence": 0, "H0_fragmentation": 0}

        # Point cloud in state space
        data_cloud = np.array(self.history)

        # Calculate Persistent Homology (Dimensions 0 and 1)
        # maxdim=1 looks for loops (circles)
        result = ripser(data_cloud, maxdim=1)
        diagrams = result['dgms']

        # DIAGRAM ANALYSIS
        # diagrams[0] = H0 (Connected Components)
        # diagrams[1] = H1 (Loops/Circles)

        # H0 Diagnosis: Fragmentation?
        persistence_h0 = diagrams[0][:, 1] - diagrams[0][:, 0]
        # Filter out infinite bars for summation
        finite_h0 = persistence_h0[np.isfinite(persistence_h0)]
        fragmentation_score = np.sum(finite_h0) if len(finite_h0) > 0 else 0

        # H1 Diagnosis: Cyclicity (Flow/Health)?
        if len(diagrams[1]) > 0:
            persistence_h1 = diagrams[1][:, 1] - diagrams[1][:, 0]
            max_loop_persistence = np.max(persistence_h1)
            loop_integrity = "INTACT" if max_loop_persistence > 0.5 else "COLLAPSED"
        else:
            max_loop_persistence = 0
            loop_integrity = "NONE"

        # DIAGNOSIS SYNTHESIS
        status = "UNKNOWN"
        if loop_integrity == "INTACT":
            status = "HEALTHY FLOW (Stable Manifold Detected)"
            curvature_rec = "Maintain State"
        elif fragmentation_score > 5.0:
            status = "FRAGMENTED (Dissociative Topology)"
            curvature_rec = "Increase Binding (Gamma Waves)"
        else:
            status = "STAGNANT (Point Attractor / Depression)"
            curvature_rec = "Apply Ricci Flow (Heat)"

        return {
            "status": status,
            "H1_persistence": max_loop_persistence,
            "H0_fragmentation": fragmentation_score,
            "recommendation": curvature_rec,
            "diagrams": diagrams
        }

if __name__ == "__main__":
    print("🔬 AVALON TDA MONITOR: Algebraic Topology Diagnostic")
    print("="*60)

    # 1. Simulate Healthy Mind (Cyclic - like Claude Haiku navigating a line)
    t = np.linspace(0, 4*np.pi, 100)
    # A perfect circle
    healthy_cloud = np.column_stack([np.sin(t), np.cos(t)])
    healthy_cloud += np.random.normal(0, 0.1, healthy_cloud.shape)

    monitor = TopologyMonitor()
    monitor.history = list(healthy_cloud)
    diagnosis = monitor.compute_persistence()

    print(f"DIAGNOSIS (HEALTHY SIM): {diagnosis['status']}")
    print(f" -> Loop Persistence (H1): {diagnosis['H1_persistence']:.3f}")

    # 2. Simulate Depression (Collapse to a point/line without return)
    stagnant_cloud = np.column_stack([t * 0.1, t * 0.1]) # A short straight line (no loop)
    monitor.history = list(stagnant_cloud)
    diagnosis_sick = monitor.compute_persistence()

    print(f"\nDIAGNOSIS (SICK SIM): {diagnosis_sick['status']}")
    print(f" -> Loop Persistence (H1): {diagnosis_sick['H1_persistence']:.3f}")

    # Visualisation (Mocked for non-GUI environments)
    print("\n[Topology Analysis Complete]")
    # plt.show = lambda: None # Mock show
    # plot_diagrams(diagnosis['diagrams'])
