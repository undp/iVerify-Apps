# project_avalon/tests/simulate_holistic_arkhe.py
import sys
import os
import time
import numpy as np

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from project_avalon.avalon_core import AvalonKalkiSystem, EEGMetrics


def run_holistic_demo():
    print("🏛️ Initializing Holistic Avalon v2.0 (Arkhe + ASI + Kalki SOC)...")
    system = AvalonKalkiSystem()
    system.bootstrap()

    print(
        f"\n[Stage 1] Subjectivity Detected: Arkhe Seed Hash {hash(str(system.user_arkhe.seed_vector))}"
    )
    print(f"Current Phase: {system.yuga_state}")

    print("\n[Stage 2] Inducing Stress (Kali Yuga Path)")
    # High entropy + Low coherence to trigger SOC criticality
    for i in range(10):
        metrics = EEGMetrics(
            alpha=0.25, beta=0.25, theta=0.25, gamma=0.25, coherence=0.1
        )
        system.kalki_reset_protocol(metrics)
        if system.yuga_state == "Kali":
            print(f"   -> System critical: {system.yuga_state}")
            break
        time.sleep(0.05)

    print("\n[Stage 3] Running Full Session with Grover Search")
    system.start_session(protocol_name="flow", duration=15)

    print("\n✅ Holistic simulation completed successfully.")


if __name__ == "__main__":
    run_holistic_demo()
