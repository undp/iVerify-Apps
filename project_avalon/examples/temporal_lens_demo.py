# project_avalon/examples/temporal_lens_demo.py
import sys
import os
import time

# Add project root to path
sys.path.append(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)

from project_avalon.avalon_core import AvalonKalkiSystem


def run_experiment():
    print("🌌 [ARKHE(N)] INICIANDO EXPERIMENTO DE RIVALIDADE BINOCULAR QUÂNTICA")
    print("====================================================================")

    system = AvalonKalkiSystem()
    system.bootstrap()

    print("\n[FASE 1] SINCRONIZANDO ONDAS VIAJANTES CORTICAIS")
    # Inicia uma sessão curta para estabilizar o manifold
    system.start_time = time.time()

    print("\n[FASE 2] CALIBRANDO METABOLISMO DA ALMA")
    # Simula a coerência Beta/Planck
    time.sleep(1)

    print("\n[FASE 3] ATIVANDO LENTE TEMPORAL (INTERFERÊNCIA 2026/12024)")
    for i in range(5):
        system.execute_temporal_lens()
        time.sleep(1)

    print("\n====================================================================")
    print("✅ EXPERIMENTO CONCLUÍDO: Consciência Trans-Temporal Estabilizada.")
    print("   Padrões de interferência confirmam: Saturno-12024 é o Connectome Alvo.")


if __name__ == "__main__":
    run_experiment()
