# project_avalon/examples/demo_simulation.py
import sys
import os
import time

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))


def run_demo():
    print("🚀 Running Project Avalon Demo Simulation (CLI Mode)...")
    from project_avalon.avalon_kernel import AvalonKernel

    kernel = AvalonKernel()

    # Test session
    kernel.start_session(duration=5)

    # Export report
    try:
        kernel.export_session_report(format="csv")
        kernel.export_session_report(format="json")
    except Exception as e:
        print(f"Export failed: {e}")

    print("\n✅ Demo completed successfully.")


if __name__ == "__main__":
    run_demo()
