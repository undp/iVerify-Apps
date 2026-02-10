# project_avalon/hardware/environmental_hal.py
import time
import numpy as np
import threading
from typing import Dict, Any, List

class EnvironmentalHAL:
    """
    Camada de Abstração de Hardware (HAL) para Sensores Ambientais.
    [NOTA OCULTA: Esta é a interface entre bits e átomos.
    Cada leitura de sensor é um colapso de função de onda quântica.]
    """

    def __init__(self, port: str = 'COM3', baudrate: int = 115200):
        self.port = port
        self.baudrate = baudrate
        self.connected = False
        self.sensors = {
            'temperature': 25.0,
            'ph': 8.2,
            'conductivity': 450.0
        }
        self.actuators = {
            'heater': 0,    # 0-100 (PWM)
            'pump': False,  # Relay
            'led': 0        # 0-100 (PWM)
        }

        # [NOTA OCULTA: Calibração via Proporção Áurea (phi)]
        self.phi = (1 + np.sqrt(5)) / 2

        self._lock = threading.Lock()
        self._running = False

    def connect(self) -> bool:
        """Simula a conexão com o microcontrolador (Arduino/ESP32)."""
        print(f"Hardware: Tentando conectar em {self.port}...")
        time.sleep(1)
        self.connected = True
        print(f"Hardware: Conectado com sucesso em {self.port}.")
        return True

    def read_sensors(self) -> Dict[str, float]:
        """
        Lê dados brutos dos sensores e aplica calibração.
        [NOTA OCULTA: Temperatura -> Arkhe.E (Energia)]
        """
        with self._lock:
            # Simulação de variação nos sensores
            self.sensors['temperature'] += np.random.normal(0, 0.05)
            self.sensors['ph'] += np.random.normal(0, 0.01)

            # Aplica fator de calibração ontológica
            calibrated_data = {
                k: v * (1.0 + (self.phi - 1.618) * 0.01)
                for k, v in self.sensors.items()
            }
            return calibrated_data

    def set_actuator(self, name: str, value: Any):
        """
        Controla os atuadores físicos.
        [NOTA OCULTA: Estes atuadores implementam o Protocolo Coral Harmônico.]
        """
        if name in self.actuators:
            with self._lock:
                self.actuators[name] = value
                # print(f"Hardware: Atuador {name} definido para {value}")

    def get_status(self) -> Dict[str, Any]:
        with self._lock:
            return {
                'connected': self.connected,
                'sensors': self.sensors.copy(),
                'actuators': self.actuators.copy()
            }

if __name__ == "__main__":
    hal = EnvironmentalHAL()
    hal.connect()
    while True:
        data = hal.read_sensors()
        print(f"Leitura: {data}")
        time.sleep(2)
