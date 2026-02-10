# project_avalon/gui/controls.py
from PyQt5.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QSlider, QLabel, QGroupBox
from PyQt5.QtCore import Qt

class ControlsWidget(QWidget):
    """
    Actuator control panel.
    [REVISOR]: Manual override and parameter adjustment for environmental stability.
    """
    def __init__(self, system_manager=None, quantum_mode=False):
        super().__init__()
        self.system_manager = system_manager
        self.quantum_mode = quantum_mode
        self._init_ui()

    def _init_ui(self):
        layout = QVBoxLayout(self)

        # Heater Control
        h_group = QGroupBox("Thermal Stability [Arkhe.E]")
        h_layout = QVBoxLayout()
        self.heater_slider = QSlider(Qt.Horizontal)
        self.heater_slider.setRange(0, 100)
        h_layout.addWidget(QLabel("Heater Power (PWM):"))
        h_layout.addWidget(self.heater_slider)
        h_group.setLayout(h_layout)
        layout.addWidget(h_group)

        # Pump Control
        p_group = QGroupBox("Circulation [Arkhe.F]")
        p_layout = QHBoxLayout()
        self.pump_btn = QPushButton("Toggle Main Pump")
        p_layout.addWidget(self.pump_btn)
        p_group.setLayout(p_layout)
        layout.addWidget(p_group)

        # [OCULTO]: Resonance Control
        if self.quantum_mode:
            r_group = QGroupBox("Ontological Sychronization")
            r_layout = QVBoxLayout()
            self.res_btn = QPushButton("Trigger Harmonic Correction")
            r_layout.addWidget(self.res_btn)
            r_group.setLayout(r_layout)
            layout.addWidget(r_group)

        layout.addStretch()
