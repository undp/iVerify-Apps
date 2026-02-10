# project_avalon/gui/settings.py
from PyQt5.QtWidgets import QDialog, QVBoxLayout, QFormLayout, QLineEdit, QDialogButtonBox

class SettingsDialog(QDialog):
    """
    System configuration dialog.
    [REVISOR]: Connectivity and data persistence settings.
    """
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("System Settings")
        self._init_ui()

    def _init_ui(self):
        layout = QVBoxLayout(self)
        form = QFormLayout()

        self.port_edit = QLineEdit("COM3")
        form.addRow("Serial Port:", self.port_edit)

        self.db_edit = QLineEdit("ietd_records.db")
        form.addRow("Database Path:", self.db_edit)

        layout.addLayout(form)

        self.buttons = QDialogButtonBox(QDialogButtonBox.Ok | QDialogButtonBox.Cancel)
        self.buttons.accepted.connect(self.accept)
        self.buttons.rejected.connect(self.reject)
        layout.addWidget(self.buttons)
