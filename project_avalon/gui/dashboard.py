# project_avalon/gui/dashboard.py
from PyQt5.QtWidgets import QWidget, QVBoxLayout, QGridLayout, QLabel, QFrame
from PyQt5.QtCore import Qt, pyqtSlot
from PyQt5.QtGui import QFont

class DashboardWidget(QWidget):
    """
    Overview Dashboard for system metrics.
    [REVISOR]: Real-time monitoring of environmental parameters.
    """
    def __init__(self, system_manager=None, quantum_mode=False):
        super().__init__()
        self.system_manager = system_manager
        self.quantum_mode = quantum_mode
        self._init_ui()

    def _init_ui(self):
        layout = QVBoxLayout(self)
        grid = QGridLayout()

        self.metric_labels = {}
        metrics = [
            ("Temperature", "°C", "E"),
            ("pH Level", "", "C"),
            ("Conductivity", "ppm", "I"),
            ("Coherence", "Z", "F")
        ]

        for i, (name, unit, arkhe_ref) in enumerate(metrics):
            frame = QFrame()
            frame.setFrameShape(QFrame.StyledPanel)
            f_layout = QVBoxLayout(frame)

            title = QLabel(name)
            title.setFont(QFont("Arial", 10))
            f_layout.addWidget(title)

            val = QLabel("--")
            val.setFont(QFont("Courier", 24, QFont.Bold))
            val.setAlignment(Qt.AlignCenter)
            f_layout.addWidget(val)

            if self.quantum_mode:
                arkhe_lbl = QLabel(f"Arkhe Ref: {arkhe_ref}")
                arkhe_lbl.setStyleSheet("color: #4ECDC4; font-size: 8px;")
                f_layout.addWidget(arkhe_lbl)

            grid.addWidget(frame, i // 2, i % 2)
            self.metric_labels[name.lower().replace(" ", "_")] = val

        layout.addLayout(grid)
        layout.addStretch()

    @pyqtSlot(dict)
    def update_sensor_data(self, data):
        for key, val in data.items():
            if key in self.metric_labels:
                self.metric_labels[key].setText(f"{val:.2f}")
