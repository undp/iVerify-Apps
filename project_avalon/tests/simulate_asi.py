# project_avalon/tests/simulate_asi.py
import sys
import os
import time

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from project_avalon.avalon_core import AvalonKalkiSystem, EEGMetrics


def run_asi_demo():
    print("🧠 Initializing Artificial Substrate Intelligence (ASI) Demo...")
    system = AvalonKalkiSystem()
    system.bootstrap()

    # Run a short session with periodic quantum searches
    print("\n[Simulation] Starting 15s session with ASI monitoring...")
    system.start_session(protocol_name="flow", duration=15)

    print("\n✅ ASI Simulation completed successfully.")


if __name__ == "__main__":
    run_asi_demo()
