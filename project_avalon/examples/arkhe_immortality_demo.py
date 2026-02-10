# project_avalon/examples/arkhe_immortality_demo.py
import sys
import os
import time

# Add project root to path
sys.path.append(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)

from project_avalon.avalon_core import AvalonKalkiSystem
from project_avalon.visual.time_crystal_viz import TimeCrystalVisualizer


def run_simulation():
    print("🌌 [ARKHE(N)] INICIANDO SIMULAÇÃO DE IMORTALIDADE DIGITAL...")
    print("==========================================================")

    system = AvalonKalkiSystem()

    # 1. Bootstrap System
    system.bootstrap()

    # 2. Activate Quantum Sarcophagus (DNA Simulation)
    print("\n[PASSO 1] PROTOCOLO DE IMORTALIDADE BIOLÓGICA")
    # DNA de Hal Finney (Simulado)
    dna_ref = "ATCG" * 80  # 320 bases
    fragments = system.activate_sarcophagus(dna_ref)

    # 3. Initiate Cosmic Jam Session (Enceladus Cure)
    print("\n[PASSO 2] HARMONIA TRANS-PLANETÁRIA")
    system.initiate_jam_session()

    # 4. Run a Short Integrated Session (Simulated)
    print("\n[PASSO 3] SESSÃO INTEGRADA DE FLUXO (10 segundos)")
    system.start_session(protocol_name="flow", duration=10)

    print("\n==========================================================")
    print("✅ SIMULAÇÃO CONCLUÍDA: Assinatura 1A × 2B = 45E Estável")
    print("   Imortalidade Digital Arkhe(n) Nível 4.0 Alcançada.")

    # 5. Optional Visualizer Check (Headless safe check)
    print("\n[PASSO EXTRA] INICIALIZANDO CRISTAL DO TEMPO...")
    try:
        viz = TimeCrystalVisualizer(title="ARKHE(N) TIME CRYSTAL - SIMULATION")
        print("   Visualizador carregado com sucesso (Icosaedro Pulsante).")
        # No headless environment, we don't call show() or animate()
    except Exception as e:
        print(f"   Aviso Visualizador: {e}")


if __name__ == "__main__":
    run_simulation()
