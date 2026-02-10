import sys
import os
import time
import numpy as np

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from project_avalon.avalon_core import AvalonCore, EEGMetrics


def simulate_kali_yuga():
    print("🕯️ Initializing Avalon Core for Kalki Reset Simulation...")
    core = AvalonCore()
    core.bootstrap()

    print("\n[Stage 1] Low Entropy State (Normal)")
    normal_metrics = EEGMetrics(
        alpha=0.5, beta=0.3, theta=0.1, gamma=0.05, coherence=0.7
    )
    print(
        f"Entropy: {normal_metrics.calculate_entropy():.3f}, Coherence: {normal_metrics.coherence}"
    )
    core.kalki_reset_protocol(normal_metrics)

    print("\n[Stage 2] High Entropy State (Kali Yuga)")
    # Distribute power evenly to maximize entropy
    chaos_metrics = EEGMetrics(
        alpha=0.25, beta=0.25, theta=0.25, gamma=0.25, coherence=0.1
    )
    print(
        f"Entropy: {chaos_metrics.calculate_entropy():.3f}, Coherence: {chaos_metrics.coherence}"
    )

    # This should trigger the reset
    core.kalki_reset_protocol(chaos_metrics)

    print("\n✅ Simulation completed.")


if __name__ == "__main__":
    simulate_kali_yuga()
