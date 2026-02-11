import sys
import matplotlib.pyplot as plt
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg
try:
    from PyQt5.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QPushButton, QWidget
    from PyQt5.QtCore import QTimer
    PYQT5_AVAILABLE = True
except ImportError:
    PYQT5_AVAILABLE = False

class AvalonGUI:
    def __init__(self, kernel=None):
        self.kernel = kernel
        if PYQT5_AVAILABLE:
            self.app = QApplication(sys.argv)
            self.main_window = QMainWindow()
            self.setup_ui()
        else:
            print("PyQt5 not installed. GUI will use matplotlib fallback.")

    def setup_ui(self):
        self.main_window.setWindowTitle("Project Avalon - Epiphany Engine")
        self.main_window.setGeometry(100, 100, 1200, 800)

        central_widget = QWidget()
        self.main_window.setCentralWidget(central_widget)
        layout = QVBoxLayout(central_widget)

        # Canvas para visualização 3D
        if self.kernel and self.kernel.visualizer:
            self.canvas = FigureCanvasQTAgg(self.kernel.visualizer.fig)
            layout.addWidget(self.canvas)

        # Controles
        self.start_button = QPushButton("Iniciar Sessão")
        self.start_button.clicked.connect(self.start_session)
        layout.addWidget(self.start_button)

    def start_session(self):
        if self.kernel:
            self.kernel.start_session()
            self.kernel.export_session_report()

    def run(self):
        if PYQT5_AVAILABLE:
            self.main_window.show()
            sys.exit(self.app.exec_())
        else:
            # Matplotlib fallback
            if self.kernel and self.kernel.visualizer:
                plt.show()

if __name__ == "__main__":
    from project_avalon.avalon_kernel import AvalonKernel
    kernel = AvalonKernel()
    gui = AvalonGUI(kernel)
    gui.run()
