# project_avalon/gui/charts.py
from PyQt5.QtWidgets import QWidget, QVBoxLayout
import pyqtgraph as pg
import numpy as np

class ChartsWidget(QWidget):
    """
    Historical sensor data visualization.
    [REVISOR]: Time-series plotting for trend analysis.
    """
    def __init__(self, db_manager=None, quantum_mode=False):
        super().__init__()
        self.db_manager = db_manager
        self.quantum_mode = quantum_mode
        self.data = {'temperature': [], 'ph': [], 'timestamp': []}
        self._init_ui()

    def _init_ui(self):
        layout = QVBoxLayout(self)

        self.plot_widget = pg.PlotWidget(title="Live Telemetry")
        self.plot_widget.setBackground('k')
        self.plot_widget.addLegend()

        self.temp_curve = self.plot_widget.plot(pen='r', name="Temp (°C)")
        self.ph_curve = self.plot_widget.plot(pen='c', name="pH")

        layout.addWidget(self.plot_widget)

    def add_sensor_data(self, data):
        self.data['temperature'].append(data.get('temperature', 0))
        self.data['ph'].append(data.get('ph', 0))

        if len(self.data['temperature']) > 200:
            self.data['temperature'].pop(0)
            self.data['ph'].pop(0)

        self.temp_curve.setData(self.data['temperature'])
        self.ph_curve.setData(self.data['ph'])
