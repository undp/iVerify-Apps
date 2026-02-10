# project_avalon/core/system_manager.py
from PyQt5.QtCore import QObject, pyqtSignal, QTimer
import numpy as np

class SystemManager(QObject):
    """
    Orquestrador central do sistema.
    [REVISOR]: Manage data flow between sensors, database and GUI.
    """
    sensor_data_updated = pyqtSignal(dict)
    alarm_triggered = pyqtSignal(str, int)

    def __init__(self, db_manager=None):
        super().__init__()
        self.db_manager = db_manager
        self.timer = QTimer()
        self.timer.timeout.connect(self._update_loop)

    def start(self):
        self.timer.start(1000) # 1Hz update

    def stop(self):
        self.timer.stop()

    def _update_loop(self):
        # Simulação de processamento de dados
        data = {
            'temperature': 26.5 + np.random.normal(0, 0.2),
            'ph': 8.1 + np.random.normal(0, 0.05),
            'conductivity': 480.0 + np.random.normal(0, 5),
            'coherence': 0.85 + np.random.normal(0, 0.02)
        }
        self.sensor_data_updated.emit(data)

        if data['temperature'] > 28.0:
            self.alarm_triggered.emit("Temperatura Alta!", 2)
