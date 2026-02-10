# project_avalon/hardware/universal_eeg.py
import numpy as np
from abc import ABC, abstractmethod
from typing import Dict, Optional


class EEGInterface(ABC):
    """Interface abstrata para hardware EEG"""

    @abstractmethod
    def connect(self) -> bool:
        pass

    @abstractmethod
    def disconnect(self):
        pass

    @abstractmethod
    def get_metrics(self) -> Dict[str, float]:
        pass


class UniversalEEG:
    """Interface universal que tenta todos os hardwares"""

    def __init__(self):
        self.interface = None
        self.interfaces = []
        self.initialize_interfaces()

    def initialize_interfaces(self):
        """Tenta inicializar todas as interfaces disponíveis"""
        # OpenBCI
        from project_avalon.hardware.openbci_integration import OpenBCIAvalonInterface

        self.interfaces.append(("OpenBCI", OpenBCIAvalonInterface))

        # Muse
        from project_avalon.components.eeg_processor import MuseProcessor

        self.interfaces.append(("Muse", MuseProcessor))

        print(f"🔍 Interfaces registradas: {[name for name, _ in self.interfaces]}")

    def auto_connect(self) -> bool:
        """Tenta conectar automaticamente a qualquer hardware"""
        for name, InterfaceClass in self.interfaces:
            try:
                print(f"🔄 Tentando conectar a {name}...")
                interface = InterfaceClass()
                # Some classes have connect(), others prepare_session()
                if hasattr(interface, "connect"):
                    if interface.connect():
                        self.interface = interface
                        print(f"✅ Conectado a {name}")
                        return True
                elif hasattr(interface, "test_connection"):
                    if interface.test_connection():
                        self.interface = interface
                        print(f"✅ Conectado a {name}")
                        return True
            except Exception as e:
                print(f"⚠️  {name}: {e}")

        print("❌ Nenhum hardware encontrado, usando simulador")
        from project_avalon.hardware.eeg_simulator import EEGSimulator

        self.interface = EEGSimulator()
        return False

    def get_metrics(self) -> Dict[str, float]:
        """Obtém métricas do hardware conectado"""
        if self.interface:
            if hasattr(self.interface, "get_metrics"):
                return self.interface.get_metrics()
            elif hasattr(self.interface, "get_realtime_metrics"):
                return self.interface.get_realtime_metrics()
        return self.get_dummy_metrics()

    def get_dummy_metrics(self):
        return {"alpha": 0.5, "beta": 0.3, "theta": 0.2, "gamma": 0.1, "coherence": 0.6}
