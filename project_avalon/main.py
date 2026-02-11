"""
Ponto de entrada do Sistema Bio-Gênese
"""

import sys
import os
import numpy as np

# Adiciona o diretório raiz ao path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from project_avalon.gui.view_3d import ConsciousnessVisualizer3D

def main():
    print("=" * 60)
    print("BIO-GÊNESE: Sistema de Arquitetura Viva")
    print("=" * 60)
    print("\nPrincípios Ativos:")
    print("1. Autonomia Multi-escala - Agentes independentes")
    print("2. Crescimento via Auto-montagem - Estruturas emergentes")
    print("3. Restrições Adaptativas - Regras em tempo real")
    print("4. Computação Embarcada - Lógica distribuída")
    print("5. Sinalização Pervasiva - Campo morfogenético")
    print("\n" + "=" * 60)

    # Inicia o visualizador (Simulação Headless para este ambiente)
    print("\nInicializando visualizador em modo headless...")
    viewer = ConsciousnessVisualizer3D(num_particles=120)

    # Simula alguns frames
    print("Executando simulação primordial...")
    for frame in range(100):
        # Simula dados EEG aleatórios
        class MockEEG:
            def __init__(self):
                self.attention = np.random.uniform(30, 80)
                self.meditation = np.random.uniform(30, 80)
                self.coherence = np.random.uniform(0.4, 0.9)

        eeg = MockEEG()
        viewer.update_from_eeg(eeg)
        data = viewer.render_frame(0.016)

        if frame % 20 == 0:
            hud = viewer.get_hud_data()
            print(f"Frame {frame}: Modo={hud['mode']}, Energia={hud['energy']}, Conexões={hud['active_bonds'] if 'active_bonds' in hud else 'N/A'}")

    print("\nBio-Gênese concluída com sucesso.")

if __name__ == "__main__":
    main()
