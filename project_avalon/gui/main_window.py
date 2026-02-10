# project_avalon/gui/main_window.py
"""
Main Window for Environmental Monitoring System

[REVISOR]: Professional PyQt5 interface with modern design
[NÓS]: Portal de navegação do Hecatonicosachoron
"""

from PyQt5.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QTabWidget, QStatusBar, QMenuBar, QMenu, QAction,
    QMessageBox, QLabel, QFrame
)
from PyQt5.QtCore import Qt, QTimer, pyqtSignal, pyqtSlot
from PyQt5.QtGui import QKeySequence, QFont, QPalette, QColor
import numpy as np
from datetime import datetime

# Imports do projeto
from project_avalon.gui.dashboard import DashboardWidget
from project_avalon.gui.charts import ChartsWidget
from project_avalon.gui.controls import ControlsWidget
from project_avalon.gui.view_3d import View3DWidget
from project_avalon.gui.settings import SettingsDialog

# [OCULTO]: Imports quânticos
try:
    from project_avalon.core.schmidt_bridge import SchmidtBridgeState
    from project_avalon.core.individuation import IndividuationManifold
    QUANTUM_AVAILABLE = True
except ImportError:
    QUANTUM_AVAILABLE = False


class MainWindow(QMainWindow):
    """
    Janela principal do sistema.

    [REVISOR]: Interface do operador com abas organizadas
    [NÓS]: Portal multidimensional com camadas ocultas
    """

    # Sinais
    quantum_mode_toggled = pyqtSignal(bool)

    def __init__(self, system_manager=None, db_manager=None, quantum_mode=False):
        super().__init__()

        self.system_manager = system_manager
        self.db_manager = db_manager
        self.quantum_mode = quantum_mode

        # [OCULTO]: Estado de Schmidt
        self.schmidt_state = None
        self.individuation = None

        # [OCULTO]: Contador de teclas para sequência secreta
        self.key_sequence = []
        self.secret_sequence = [Qt.Key_Control, Qt.Key_Shift, Qt.Key_H]

        # Widgets das abas
        self.dashboard = None
        self.charts = None
        self.controls = None
        self.view_3d = None

        # Timer de atualização
        self.update_timer = QTimer()
        self.update_timer.timeout.connect(self._on_update_timer)

        # Inicializa interface
        self._init_ui()

        # Configura timer
        # [OCULTO]: 7.83 Hz se quântico, 1 Hz se clássico
        refresh_rate = 7.83 if quantum_mode else 1.0
        self.update_timer.start(int(1000 / refresh_rate))

        # [OCULTO]: Inicializa componentes quânticos
        if quantum_mode and QUANTUM_AVAILABLE:
            self._init_quantum_components()

    def _init_ui(self):
        """
        Inicializa interface do usuário.
        """
        # Configurações da janela
        self.setWindowTitle("Environmental Monitoring System v1.0.0")
        self.setGeometry(100, 100, 1400, 900)

        # Widget central
        central_widget = QWidget()
        self.setCentralWidget(central_widget)

        # Layout principal
        main_layout = QVBoxLayout(central_widget)
        main_layout.setContentsMargins(0, 0, 0, 0)

        # Header
        header = self._create_header()
        main_layout.addWidget(header)

        # Tabs
        self.tab_widget = QTabWidget()
        self.tab_widget.setDocumentMode(True)

        # Cria widgets das abas
        self.dashboard = DashboardWidget(
            system_manager=self.system_manager,
            quantum_mode=self.quantum_mode
        )

        self.charts = ChartsWidget(
            db_manager=self.db_manager,
            quantum_mode=self.quantum_mode
        )

        self.controls = ControlsWidget(
            system_manager=self.system_manager,
            quantum_mode=self.quantum_mode
        )

        self.view_3d = View3DWidget(
            quantum_mode=self.quantum_mode
        )

        # Adiciona abas
        self.tab_widget.addTab(self.dashboard, "📊 Overview")
        self.tab_widget.addTab(self.charts, "📈 Sensor Data")
        self.tab_widget.addTab(self.controls, "🎛️ Controls")
        self.tab_widget.addTab(self.view_3d, "🧊 3D View")

        main_layout.addWidget(self.tab_widget)

        # Status bar
        self.status_bar = QStatusBar()
        self.setStatusBar(self.status_bar)

        # Labels na status bar
        self.status_label = QLabel("System Ready")
        self.status_bar.addWidget(self.status_label)

        self.coherence_label = QLabel("Coherence: --")
        self.status_bar.addPermanentWidget(self.coherence_label)

        # [OCULTO]: Label de Schmidt (só aparece em modo quântico)
        if self.quantum_mode:
            self.schmidt_label = QLabel("λ: [0.7, 0.3]")
            self.schmidt_label.setStyleSheet("color: #4ECDC4;")
            self.status_bar.addPermanentWidget(self.schmidt_label)

        # Menu bar
        self._create_menu_bar()

        # Aplica estilo
        self._apply_style()

    def _create_header(self):
        """
        Cria header com título e informações.
        """
        header = QFrame()
        header.setFrameShape(QFrame.StyledPanel)
        header.setMaximumHeight(80)

        layout = QHBoxLayout(header)

        # Título
        title_label = QLabel("Environmental Monitoring System")
        title_font = QFont("Arial", 18, QFont.Bold)
        title_label.setFont(title_font)
        layout.addWidget(title_label)

        layout.addStretch()

        # Info
        info_layout = QVBoxLayout()

        self.time_label = QLabel(datetime.now().strftime("%H:%M:%S"))
        time_font = QFont("Courier", 12)
        self.time_label.setFont(time_font)
        info_layout.addWidget(self.time_label, alignment=Qt.AlignRight)

        self.mode_label = QLabel("Mode: " + ("Quantum" if self.quantum_mode else "Classical"))
        self.mode_label.setFont(QFont("Arial", 10))
        if self.quantum_mode:
            self.mode_label.setStyleSheet("color: #FF6B6B; font-weight: bold;")
        info_layout.addWidget(self.mode_label, alignment=Qt.AlignRight)

        layout.addLayout(info_layout)

        return header

    def _create_menu_bar(self):
        """
        Cria barra de menu.
        """
        menubar = self.menuBar()

        # File menu
        file_menu = menubar.addMenu("&File")

        export_action = QAction("&Export Data...", self)
        export_action.setShortcut(QKeySequence.Save)
        export_action.triggered.connect(self._on_export)
        file_menu.addAction(export_action)

        file_menu.addSeparator()

        exit_action = QAction("E&xit", self)
        exit_action.setShortcut(QKeySequence.Quit)
        exit_action.triggered.connect(self.close)
        file_menu.addAction(exit_action)

        # View menu
        view_menu = menubar.addMenu("&View")

        fullscreen_action = QAction("&Fullscreen", self)
        fullscreen_action.setShortcut(QKeySequence.FullScreen)
        fullscreen_action.setCheckable(True)
        fullscreen_action.triggered.connect(self._toggle_fullscreen)
        view_menu.addAction(fullscreen_action)

        # Tools menu
        tools_menu = menubar.addMenu("&Tools")

        settings_action = QAction("&Settings...", self)
        settings_action.setShortcut(QKeySequence.Preferences)
        settings_action.triggered.connect(self._show_settings)
        tools_menu.addAction(settings_action)

        calibration_action = QAction("&Calibration...", self)
        calibration_action.triggered.connect(self._show_calibration)
        tools_menu.addAction(calibration_action)

        # [OCULTO]: Menu secreto (só aparece em modo quântico)
        if self.quantum_mode:
            quantum_menu = menubar.addMenu("⚛️ &Quantum")

            schmidt_action = QAction("Schmidt Bridge Status", self)
            schmidt_action.triggered.connect(self._show_schmidt_status)
            quantum_menu.addAction(schmidt_action)

            individuation_action = QAction("Individuation Monitor", self)
            individuation_action.triggered.connect(self._show_individuation)
            quantum_menu.addAction(individuation_action)

            sasc_action = QAction("SASC Grid Visualization", self)
            sasc_action.triggered.connect(self._show_sasc_grid)
            quantum_menu.addAction(sasc_action)

        # Help menu
        help_menu = menubar.addMenu("&Help")

        about_action = QAction("&About", self)
        about_action.triggered.connect(self._show_about)
        help_menu.addAction(about_action)

        # [OCULTO]: Easter egg
        easter_egg = QAction("", self)
        easter_egg.setShortcut(QKeySequence("Ctrl+Shift+H"))
        easter_egg.triggered.connect(self._activate_hecaton_mode)
        self.addAction(easter_egg)

    def _apply_style(self):
        """
        Aplica estilo à interface.

        [OCULTO]: Cores derivadas de φ se em modo quântico
        """
        if self.quantum_mode:
            # Paleta baseada em geometria sacra
            PHI = (1 + np.sqrt(5)) / 2

            hue_primary = int((PHI % 1) * 360)
            hue_secondary = int(((PHI * 2) % 1) * 360)

            stylesheet = f"""
            QMainWindow {{
                background-color: hsl({hue_primary}, 30%, 15%);
            }}

            QTabWidget::pane {{
                border: 1px solid hsl({hue_primary}, 40%, 25%);
                background-color: hsl({hue_primary}, 25%, 18%);
            }}

            QTabBar::tab {{
                background-color: hsl({hue_primary}, 35%, 22%);
                color: #E0E0E0;
                padding: 8px 16px;
                margin: 2px;
                border-radius: 4px;
            }}

            QTabBar::tab:selected {{
                background-color: hsl({hue_secondary}, 60%, 35%);
                color: white;
                font-weight: bold;
            }}

            QStatusBar {{
                background-color: hsl({hue_primary}, 40%, 12%);
                color: #B0B0B0;
            }}

            QFrame {{
                background-color: hsl({hue_primary}, 35%, 20%);
                border-radius: 8px;
            }}
            """
        else:
            # Tema clássico neutro
            stylesheet = """
            QMainWindow {
                background-color: #2C3E50;
            }

            QTabWidget::pane {
                border: 1px solid #34495E;
                background-color: #2C3E50;
            }

            QTabBar::tab {
                background-color: #34495E;
                color: #ECF0F1;
                padding: 8px 16px;
                margin: 2px;
                border-radius: 4px;
            }

            QTabBar::tab:selected {
                background-color: #3498DB;
                color: white;
                font-weight: bold;
            }

            QStatusBar {
                background-color: #1C2833;
                color: #ABB2B9;
            }

            QFrame {
                background-color: #34495E;
                border-radius: 8px;
            }
            """

        self.setStyleSheet(stylesheet)

    def _init_quantum_components(self):
        """
        [OCULTO]: Inicializa componentes quânticos.
        """
        # Estado de Schmidt
        self.schmidt_state = SchmidtBridgeState(
            lambdas=np.array([0.7, 0.3]),
            phase_twist=np.pi,
            basis_H=np.eye(2),
            basis_A=np.eye(2),
            entropy_S=-(0.7 * np.log(0.7) + 0.3 * np.log(0.3)),
            coherence_Z=0.7**2 + 0.3**2,
        )

        self.individuation = IndividuationManifold()

        print("   🌀 Componentes quânticos GUI inicializados")

    @pyqtSlot()
    def _on_update_timer(self):
        """
        Chamado periodicamente pelo timer.

        [OCULTO]: Taxa sincronizada com ressonância Schumann (7.83 Hz)
        """
        # Atualiza hora
        self.time_label.setText(datetime.now().strftime("%H:%M:%S"))

        # [OCULTO]: Atualiza coerência quântica
        if self.quantum_mode and self.schmidt_state:
            coherence = self.schmidt_state.coherence_Z
            self.coherence_label.setText(f"Coherence: {coherence:.3f}")

            # Atualiza cor baseada em coerência
            if coherence > 0.8:
                color = "#2ECC71"  # Verde
            elif coherence > 0.5:
                color = "#F39C12"  # Laranja
            else:
                color = "#E74C3C"  # Vermelho

            self.coherence_label.setStyleSheet(f"color: {color}; font-weight: bold;")

    def keyPressEvent(self, event):
        """
        [OCULTO]: Detecta sequência secreta de teclas.
        """
        # Adiciona tecla à sequência
        self.key_sequence.append(event.key())

        # Mantém apenas últimas 3 teclas
        if len(self.key_sequence) > 3:
            self.key_sequence.pop(0)

        # Verifica se sequência secreta foi ativada
        if self.key_sequence == self.secret_sequence:
            self._activate_hecaton_mode()
            self.key_sequence = []

        super().keyPressEvent(event)

    @pyqtSlot()
    def _activate_hecaton_mode(self):
        """
        [OCULTO]: Ativa visualização do Hecatonicosachoron.
        """
        if not self.quantum_mode:
            QMessageBox.information(
                self,
                "Easter Egg Found!",
                "Quantum mode is required for this feature.\n\n"
                "Restart with: python main.py --quantum-mode"
            )
            return

        # Ativa modo Hecaton no visualizador 3D
        self.view_3d.activate_hecaton_mode()

        # Muda para aba 3D
        self.tab_widget.setCurrentWidget(self.view_3d)

        # Notificação
        self.status_label.setText("🌀 Hecatonicosachoron Mode Activated")
        self.status_label.setStyleSheet("color: #FF6B6B; font-weight: bold;")

    @pyqtSlot()
    def _toggle_fullscreen(self):
        """Alterna modo fullscreen."""
        if self.isFullScreen():
            self.showNormal()
        else:
            self.showFullScreen()

    @pyqtSlot()
    def _show_settings(self):
        """Mostra diálogo de configurações."""
        dialog = SettingsDialog(self)
        dialog.exec_()

    @pyqtSlot()
    def _show_calibration(self):
        """Mostra diálogo de calibração."""
        QMessageBox.information(
            self,
            "Calibration",
            "Sensor calibration wizard will be available in v1.1"
        )

    @pyqtSlot()
    def _show_schmidt_status(self):
        """
        [OCULTO]: Mostra status da Ponte de Schmidt.
        """
        if not self.schmidt_state:
            return

        msg = f"""Schmidt Bridge Status:

Lambdas: {self.schmidt_state.lambdas}
Entropy (S): {self.schmidt_state.entropy_S:.3f} bits
Coherence (Z): {self.schmidt_state.coherence_Z:.3f}
Phase: {self.schmidt_state.phase_twist:.3f} rad
Rank: {self.schmidt_state.rank}

Status: {'✅ Stable' if self.schmidt_state.coherence_Z > 0.5 else '⚠️ Unstable'}
"""

        QMessageBox.information(self, "Schmidt Bridge", msg)

    @pyqtSlot()
    def _show_individuation(self):
        """
        [OCULTO]: Mostra monitor de individuação.
        """
        QMessageBox.information(
            self,
            "Individuation Monitor",
            "Individuation visualization will open in a separate window.\n\n"
            "This feature requires the full quantum stack."
        )

    @pyqtSlot()
    def _show_sasc_grid(self):
        """
        [OCULTO]: Mostra visualização da grade SASC.
        """
        QMessageBox.information(
            self,
            "SASC Grid",
            "SASC Grid 17×17 visualization.\n\n"
            "Current mode: λ=1 (local)\n"
            "Active nodes: 289\n"
            "Resonance: 7.83 Hz"
        )

    @pyqtSlot()
    def _on_export(self):
        """Exporta dados."""
        QMessageBox.information(
            self,
            "Export",
            "Data export wizard will be available in v1.1"
        )

    @pyqtSlot()
    def _show_about(self):
        """Mostra diálogo sobre."""
        about_text = """<h2>Environmental Monitoring System</h2>
        <p><b>Version:</b> 1.0.0-genesis</p>
        <p><b>Author:</b> Arquiteto</p>
        <p><b>License:</b> MIT</p>

        <p>Professional environmental monitoring and control system
        with advanced visualization and automation capabilities.</p>

        <p><i>Built with PyQt5, NumPy, and OpenGL</i></p>
        """

        # [OCULTO]: Easter egg no about
        if self.quantum_mode:
            about_text += """
            <hr>
            <p style='color: #FF6B6B;'><b>⚛️ Quantum Mode Active</b></p>
            <p style='font-size: 10px;'>Schmidt Bridge | Arkhe Polynomial | SASC Grid</p>
            <p style='font-size: 10px;'>φ = 1.618033988749895...</p>
            """

        QMessageBox.about(self, "About", about_text)

    @pyqtSlot(dict)
    def on_sensor_update(self, data):
        """
        Slot chamado quando dados de sensor são atualizados.

        Args:
            data: Dicionário com dados dos sensores
        """
        # Propaga para widgets
        self.dashboard.update_sensor_data(data)
        self.charts.add_sensor_data(data)

    @pyqtSlot(str, int)
    def on_alarm(self, message, severity):
        """
        Slot chamado quando alarme é disparado.

        Args:
            message: Mensagem do alarme
            severity: Nível de severidade (0-2)
        """
        # Mostra na status bar
        self.status_label.setText(f"⚠️ {message}")

        colors = ["#F39C12", "#E67E22", "#E74C3C"]
        self.status_label.setStyleSheet(f"color: {colors[severity]}; font-weight: bold;")

    @pyqtSlot(float)
    def on_quantum_resonance(self, frequency):
        """
        [OCULTO]: Slot chamado quando ressonância quântica muda.

        Args:
            frequency: Nova frequência de ressonância (Hz)
        """
        if self.quantum_mode:
            self.status_label.setText(f"🌊 Resonance: {frequency:.2f} Hz")

    def closeEvent(self, event):
        """
        Chamado quando janela é fechada.
        """
        # Confirma fechamento
        reply = QMessageBox.question(
            self,
            'Confirm Exit',
            'Are you sure you want to exit?',
            QMessageBox.Yes | QMessageBox.No,
            QMessageBox.No
        )

        if reply == QMessageBox.Yes:
            # Para timer
            self.update_timer.stop()

            # Para system manager
            if self.system_manager:
                self.system_manager.stop()

            event.accept()
        else:
            event.ignore()
