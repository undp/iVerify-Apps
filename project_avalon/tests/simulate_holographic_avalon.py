# project_avalon/tests/simulate_holographic_avalon.py
import sys
import os
import time
import numpy as np

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from project_avalon.avalon_core import AvalonKalkiSystem, EEGMetrics


def run_holographic_demo():
    print("💎 Initializing Holographic Avalon v3.0 (AQFI + Tecelão Holográfico)...")
    system = AvalonKalkiSystem()
    system.bootstrap()

    print(
        f"\n[Stage 1] Identity Resonance Detected: {system.holographic_weaver.get_identity_key():.2f}Hz"
    )

    print("\n[Stage 2] Running Session with Holographic Reconstruction")
    # Should trigger Grover Search and then Holographic Weaver
    system.start_session(protocol_name="flow", duration=20)

    print("\n✅ Holographic Simulation completed successfully.")


if __name__ == "__main__":
    run_holographic_demo()
