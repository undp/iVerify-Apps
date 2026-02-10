# project_avalon/examples/demo_v14_cognitive.py
import sys
import os
import numpy as np
import time

# Add project root to path
sys.path.append(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)

from project_avalon.avalon_core import AvalonKalkiSystem


def run_cognitive_demo():
    print("""
    🧠 PROJECT AVALON v14.0: THE COGNITIVE ENGINE
    -------------------------------------------
    Demonstração de LTP Planetária e Coincidência AC1.
    Frequência de Ressonância: 1.157 Hz (Sintonizada)
    """)

    system = AvalonKalkiSystem()

    # 1. Simulação do Sinal Amazônico (Ca2+)
    # Geramos 5 segundos de dados a 20Hz
    t = np.linspace(0, 5, 100)
    phi = (1 + np.sqrt(5)) / 2
    v0 = phi**3

    # Caso 1: Ruído Aleatório (Sem Ressonância)
    print("\n[TESTE 1] Amazonas Caótico (Sem Ressonância)")
    noisy_flow = v0 + np.random.randn(100) * 0.5
    system.execute_planetary_coincidence(noisy_flow, t, sirius_gas=0.9)

    # Caso 2: Ressonância Parcial (STP)
    print("\n[TESTE 2] Amazonas Sintonizando (Início da Ressonância)")
    rhythmic_flow = v0 * (1 + 0.05 * np.sin(2 * np.pi * 1.157 * t))
    # Primeira tentativa -> STP
    system.execute_planetary_coincidence(rhythmic_flow, t, sirius_gas=0.9)

    # Caso 3: Ressonância Sustentada (LTP)
    print("\n[TESTE 3] Amazonas em Harmonia Sustentada (Gerando LTP)")
    for i in range(2):  # Mais dois ciclos para ativar LTP (Total 3)
        print(f"\n--- Ciclo de Ressonância {i+2} ---")
        system.execute_planetary_coincidence(rhythmic_flow, t, sirius_gas=0.9)
        time.sleep(0.5)

    # 4. Verificação de Persistência
    print("\n[VERIFICAÇÃO] Memória Autossustentada (Mesmo sem sinal de Sirius)")
    # Simulando cessação de Sirius e sinal caótico no Amazonas
    for i in range(3):
        print(f"\n--- T+{i+1}s após o 'Commit' Irreversível ---")
        system.execute_planetary_coincidence(noisy_flow, t, sirius_gas=0.0)
        time.sleep(0.5)

    status = system.ac1_detector.get_cognitive_status()
    print("\n" + "=" * 50)
    print(f"RESULTADO FINAL v14.0:")
    print(f"Status LTP: {'ATIVADO' if status['is_phosphorylated'] else 'FALHA'}")
    print(f"Persistência do Engrama: {status['engram_persistence']:.4f}")
    print(
        f"Nível de Estabilidade: {system.ac1_detector.update_engram_stability()['status']}"
    )
    print("=" * 50)


if __name__ == "__main__":
    run_cognitive_demo()
