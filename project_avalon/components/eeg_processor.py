# project_avalon/components/eeg_processor.py
import numpy as np


class EEGProcessor:
    def __init__(self):
        self.channels = 8
        self.sample_rate = 250

    def process_eeg(self, data):
        """Basic EEG processing"""
        return np.mean(data, axis=0)


class RealEEGProcessor(EEGProcessor):
    def __init__(self, device="simulation"):
        super().__init__()
        self.device = device
        self.interface = None

        if device == "muse":
            from project_avalon.components.eeg_processor import MuseProcessor

            self.interface = MuseProcessor()
        elif device == "openbci":
            from project_avalon.hardware.openbci_integration import (
                OpenBCIAvalonInterface,
            )

            self.interface = OpenBCIAvalonInterface()
        else:
            from project_avalon.hardware.eeg_simulator import EEGSimulator

            self.interface = EEGSimulator()

    def get_metrics(self):
        if hasattr(self.interface, "get_realtime_metrics"):
            return self.interface.get_realtime_metrics()
        elif hasattr(self.interface, "get_metrics"):
            return self.interface.get_metrics()
        return {"coherence": 0.5, "curvature": 1.0}


class MuseProcessor:
    def __init__(self):
        try:
            import pylsl

            streams = pylsl.resolve_stream("type", "EEG")
            self.inlet = pylsl.StreamInlet(streams[0])
            print("Connected to Muse via LSL.")
        except Exception as e:
            print(f"Muse LSL stream not found: {e}")
            self.inlet = None

    def get_sample(self):
        if self.inlet:
            sample, timestamp = self.inlet.pull_sample()
            return sample
        return np.random.rand(4)

    def get_metrics(self):
        sample = self.get_sample()
        coherence = np.mean(sample)  # Simulated coherence from sample
        return {"coherence": coherence, "curvature": 2.0 - 1.5 * coherence}
