# project_avalon/components/gui.py
import sys
from PyQt5.QtWidgets import QApplication
from project_avalon.gui.main_window import MainWindow
from project_avalon.core.system_manager import SystemManager
from project_avalon.database.db_manager import DatabaseManager

class AvalonGUI:
    """
    Bridge class for Project Avalon framework.
    [REVISOR]: Unified interface for system components.
    """
    def __init__(self, kernel=None, quantum_mode=False):
        self.kernel = kernel
        self.app = QApplication(sys.argv)
        self.app.setStyle('Fusion')

        self.db_manager = DatabaseManager()
        self.db_manager.initialize()

        self.system_manager = SystemManager(db_manager=self.db_manager)

        self.main_window = MainWindow(
            system_manager=self.system_manager,
            db_manager=self.db_manager,
            quantum_mode=quantum_mode
        )

    def run(self):
        self.main_window.show()
        self.system_manager.start()
        sys.exit(self.app.exec_())

if __name__ == "__main__":
    gui = AvalonGUI(quantum_mode=True)
    gui.run()
