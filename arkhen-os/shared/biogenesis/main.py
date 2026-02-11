#!/usr/bin/env python3
"""
BIO-GÊNESE COGNITIVA v3.0
Sistema Multi-Agente com Aprendizado Hebbiano Emergente
"""

import sys
import os

def check_dependencies():
    """Verifica dependências necessárias."""
    try:
        import numpy
        import pyglet
        print("✓ Dependências verificadas (numpy, pyglet)")
        return True
    except ImportError as e:
        print(f"✗ Dependência faltando: {e}")
        print("\nInstale com:")
        print("  pip install numpy pyglet")
        return False

def main():
    """Ponto de entrada principal."""
    print("=" * 70)
    print("  🧬 BIO-GÊNESE COGNITIVA v3.0")
    print("  Sistema de Vida Artificial com Cognição Embarcada")
    print("=" * 70)

    if not check_dependencies():
        sys.exit(1)

    # Configura path
    current_dir = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, current_dir)

    try:
        from gui.view_3d import main as viewer_main
        viewer_main()
    except Exception as e:
        print(f"\n❌ Erro crítico: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
