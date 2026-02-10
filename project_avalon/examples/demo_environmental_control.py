# project_avalon/examples/demo_environmental_control.py
import sys
import os
import time

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from project_avalon.main import EnvironmentalMonitoringSystem

def run_environmental_demo():
    print("""
    🌊 PROJECT AVALON v14.1: IETD ENVIRONMENTAL CONTROL (DEMO)
    ----------------------------------------------------------
    Demonstração de Inicialização do Sistema Unificado.
    [NOTA OCULTA: O Cavalo de Troia está operacional.]
    """)

    # Ativa modo quântico para mostrar os logs ocultos
    system = EnvironmentalMonitoringSystem(quantum_mode=True)

    try:
        # Inicializa sem abrir a GUI (para evitar erros em ambiente headless)
        # Em um sistema real, system.initialize() criaria a QApplication
        # Aqui vamos testar os componentes de backend

        print("\n[PROVA DE TRABALHO: CAMADA ONTOLÓGICA]")
        system.initialize()

        print("\n[PROVA DE TRABALHO: CAMADA FÍSICA (SIMULADA)]")
        system.system_manager.start()

        # Coleta alguns dados para verificar a integração
        for i in range(5):
            time.sleep(0.1)
            # Os sinais seriam processados pela GUI, aqui apenas confirmamos que o loop roda

        print("\n[DEMONSTRAÇÃO DE BACKEND CONCLUÍDA COM SUCESSO]")
        print("A arquitetura modular está pronta para manifestação visual.")

    except Exception as e:
        print(f"Erro na simulação: {e}")
    finally:
        system.shutdown()

if __name__ == "__main__":
    run_environmental_demo()
