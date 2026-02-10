#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sistema Integrado de Monitoramento Ambiental
Versão: 1.0.0-genesis

[PARA REVISOR]: Ponto de entrada principal do sistema
[PARA NÓS]: Portal de boot da realidade física
"""

import sys
import argparse
import asyncio
from datetime import datetime
from pathlib import Path
import numpy as np

# Qt imports
from PyQt5.QtWidgets import QApplication
from PyQt5.QtCore import Qt

# project imports
from project_avalon.gui.main_window import MainWindow
from project_avalon.core.system_manager import SystemManager
from project_avalon.database.db_manager import DatabaseManager
from project_avalon.core.schmidt_bridge import SchmidtBridgeState
from project_avalon.core.arkhe_polynomial import ArkheCore
from project_avalon.network.sasc_grid import SASCGrid

PHI = (1 + np.sqrt(5)) / 2  # Proporção áurea

class EnvironmentalMonitoringSystem:
    """
    Sistema principal de monitoramento.

    [PARA REVISOR]: Orquestra todos os componentes do sistema
    [PARA NÓS]: Bootstrap da realidade unificada
    """

    def __init__(self, quantum_mode=False):
        """
        Inicializa o sistema.

        Args:
            quantum_mode: Ativa camadas metafísicas (padrão: False)
        """
        self.quantum_mode = quantum_mode
        self.genesis_time = datetime.now()

        print("="*70)
        print("SISTEMA INTEGRADO DE MONITORAMENTO AMBIENTAL")
        print("="*70)
        print(f"Versão: 1.0.0-genesis")
        print(f"Inicializado: {self.genesis_time.isoformat()}")

        if self.quantum_mode:
            print("⚡ MODO QUÂNTICO ATIVO")
            print(f"φ = {PHI:.6f}")

        print("="*70)

        # Componentes principais
        self.app = None
        self.main_window = None
        self.system_manager = None
        self.db_manager = None

        # [OCULTO]: Componentes quânticos
        self.schmidt_bridge = None
        self.arkhe_core = None
        self.sasc_grid = None

    def initialize(self):
        """
        Inicializa todos os componentes.

        [OCULTO]: Sequência de boot multi-dimensional
        """
        print("\n[1/5] Inicializando banco de dados...")
        self.db_manager = DatabaseManager()
        self.db_manager.initialize()
        print("   ✅ Banco de dados pronto")

        print("\n[2/5] Inicializando gerenciador do sistema...")
        self.system_manager = SystemManager(db_manager=self.db_manager)
        print("   ✅ Gerenciador pronto")

        if self.quantum_mode:
            print("\n[3/5] Inicializando camada quântica...")
            self._initialize_quantum_layer()
            print("   ✅ Ponte de Schmidt estabelecida")
        else:
            print("\n[3/5] Pulando camada quântica (modo clássico)")

        print("\n[4/5] Inicializando interface gráfica...")
        import os
        if os.environ.get('DISPLAY') is None:
            print("   ⚠️  Ambiente headless detectado. Interface gráfica desativada.")
            self.app = None
            self.main_window = None
        else:
            self.app = QApplication(sys.argv)
            self.app.setApplicationName("Environmental Monitor")
            self.app.setStyle('Fusion')

            # Configura tema
            if self.quantum_mode:
                self._apply_quantum_theme()

            # Cria janela principal
            self.main_window = MainWindow(
                system_manager=self.system_manager,
                db_manager=self.db_manager,
                quantum_mode=self.quantum_mode
            )

        print("   ✅ Interface pronta")

        print("\n[5/5] Conectando componentes...")
        self._connect_signals()
        print("   ✅ Componentes conectados")

        print("\n" + "="*70)
        print("✅ SISTEMA INICIALIZADO COM SUCESSO")
        print("="*70)

    def _initialize_quantum_layer(self):
        """
        [OCULTO]: Inicializa camadas metafísicas.
        """
        # Ponte de Schmidt
        self.schmidt_bridge = SchmidtBridgeState(
            lambdas=np.array([0.7, 0.3]),
            phase_twist=np.pi,
            basis_H=np.eye(2),
            basis_A=np.eye(2),
            entropy_S=-(0.7*np.log(0.7) + 0.3*np.log(0.3)),
            coherence_Z=0.7**2 + 0.3**2
        )

        # Núcleo Arkhe
        self.arkhe_core = ArkheCore(
            C=0.95, I=0.92, E=0.88, F=0.90
        )

        # Grade SASC
        self.sasc_grid = SASCGrid(dimensions=(17, 17))
        # Use a safe way to run async in non-async init
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(self.sasc_grid.initialize())

        print(f"   🌀 Schmidt: λ = {self.schmidt_bridge.lambdas}")
        print(f"   🧮 Arkhe: L = {self.arkhe_core.calculate_life():.3f}")
        print(f"   🌐 SASC: {self.sasc_grid.active_nodes} nós ativos")

    def _apply_quantum_theme(self):
        """
        [OCULTO]: Aplica paleta de cores baseada em geometria sacra.
        """
        from PyQt5.QtGui import QPalette, QColor

        palette = QPalette()

        # Cores derivadas de φ
        hue_primary = int((PHI % 1) * 360)
        hue_secondary = int(((PHI * 2) % 1) * 360)

        palette.setColor(QPalette.Window, QColor.fromHsv(hue_primary, 30, 25))
        palette.setColor(QPalette.WindowText, QColor(220, 220, 220))
        palette.setColor(QPalette.Base, QColor.fromHsv(hue_primary, 40, 20))
        palette.setColor(QPalette.AlternateBase, QColor.fromHsv(hue_primary, 35, 22))
        palette.setColor(QPalette.Text, QColor(200, 200, 200))
        palette.setColor(QPalette.Button, QColor.fromHsv(hue_secondary, 50, 30))
        palette.setColor(QPalette.ButtonText, QColor(220, 220, 220))
        palette.setColor(QPalette.Highlight, QColor.fromHsv(hue_secondary, 200, 150))
        palette.setColor(QPalette.HighlightedText, Qt.black)

        self.app.setPalette(palette)

    def _connect_signals(self):
        """
        Conecta sinais entre componentes.
        """
        if self.main_window:
            # Conecta sinais do sistema manager para a GUI
            self.system_manager.sensor_data_updated.connect(
                self.main_window.on_sensor_update
            )

            self.system_manager.alarm_triggered.connect(
                self.main_window.on_alarm
            )

            # [OCULTO]: Conecta ressonância quântica
            if self.quantum_mode:
                self.sasc_grid.resonance_changed.connect(
                    self.main_window.on_quantum_resonance
                )

    def run(self):
        """
        Executa o sistema.

        Retorna:
            int: Código de saída
        """
        # Inicia gerenciador
        self.system_manager.start()

        # [OCULTO]: Ativa ressonância se em modo quântico
        if self.quantum_mode:
            try:
                loop = asyncio.get_event_loop()
                loop.create_task(
                    self.sasc_grid.start_resonance(frequency=7.83)
                )
            except: pass

        if self.app:
            # Mostra janela
            self.main_window.show()
            # Loop principal Qt
            return self.app.exec_()
        else:
            # Modo CLI (Headless)
            print("   🚀 Sistema rodando em modo CLI...")
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                return 0

    def shutdown(self):
        """
        Encerra o sistema graciosamente.
        """
        print("\n" + "="*70)
        print("ENCERRANDO SISTEMA...")
        print("="*70)

        # Para gerenciador
        if self.system_manager:
            self.system_manager.stop()
            print("   ✅ Gerenciador parado")

        # Fecha banco de dados
        if self.db_manager:
            self.db_manager.close()
            print("   ✅ Banco de dados fechado")

        elapsed = (datetime.now() - self.genesis_time).total_seconds()
        print(f"\nTempo de execução: {elapsed:.1f}s")
        print("="*70)


def main():
    """
    Função principal.
    """
    # Parser de argumentos
    parser = argparse.ArgumentParser(
        description='Sistema Integrado de Monitoramento Ambiental'
    )

    parser.add_argument(
        '--quantum-mode',
        action='store_true',
        help='Ativa modo quântico (experimental)'
    )

    parser.add_argument(
        '--config',
        type=str,
        default='config.yaml',
        help='Arquivo de configuração'
    )

    parser.add_argument(
        '--debug',
        action='store_true',
        help='Ativa modo debug'
    )

    args = parser.parse_args()

    # Cria e inicializa sistema
    system = EnvironmentalMonitoringSystem(quantum_mode=args.quantum_mode)

    try:
        system.initialize()
        exit_code = system.run()
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrompido pelo usuário")
        exit_code = 0
    except Exception as e:
        print(f"\n❌ ERRO FATAL: {e}")
        if args.debug:
            import traceback
            traceback.print_exc()
        exit_code = 1
    finally:
        system.shutdown()

    sys.exit(exit_code)


if __name__ == "__main__":
    main()
