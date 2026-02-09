"""
PROJECT AVALON - DEPLOYMENT ORCHESTRATOR
"""
import sys
import os

# Add current directory to path to allow importing from 'avalon'
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from avalon.avalon_kernel import AvalonKernel

def deploy_genesis():
    print("🌌 PROJECT AVALON GENESIS - DEPLOYMENT")
    print("=" * 70)

    try:
        kernel = AvalonKernel()
        print("🚀 Avalon Kernel Operational")

        # Test short session
        kernel.config['therapy']['session_duration'] = 10
        kernel.start_session()

        print("\n✨ Deployment verified.")
    except Exception as e:
        print(f"❌ Deployment failure: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    deploy_genesis()
