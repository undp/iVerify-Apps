import numpy as np

class EEGProcessor:
    def __init__(self):
        self.channels = 8
        self.sample_rate = 250

    def process_eeg(self, data):
        """Basic EEG processing (simulated)"""
        return np.mean(data, axis=0)

class RealEEGProcessor(EEGProcessor):
    def __init__(self, device='muse'):
        super().__init__()
        self.device = device
        if device == 'muse':
            try:
                import pylsl
                print("Connecting to Muse via LSL...")
            except ImportError:
                print("pylsl not found. Using simulation mode.")
        elif device == 'openbci':
            try:
                import brainflow
                print("Using BrainFlow API for OpenBCI...")
            except ImportError:
                print("brainflow not found. Using simulation mode.")

class OpenBCIProcessor:
    def __init__(self, board_id=None, port=None):
        self.port = port
        try:
            from brainflow.board_shim import BoardShim, BoardIds
            self.board_id = board_id or BoardIds.CYTON_BOARD
            self.board = BoardShim(self.board_id, self.port)
            self.board.prepare_session()
            self.board.start_stream()
        except ImportError:
            print("BrainFlow not installed. OpenBCI interface disabled.")

    def get_eeg_data(self):
        if hasattr(self, 'board'):
            data = self.board.get_current_board_data(256)
            return self.process_eeg(data)
        return np.random.rand(8, 256)

    def process_eeg(self, data):
        return data

class MuseProcessor:
    def __init__(self):
        try:
            import pylsl
            streams = pylsl.resolve_stream('type', 'EEG')
            self.inlet = pylsl.StreamInlet(streams[0])
        except (ImportError, IndexError):
            print("Muse LSL stream not found. Muse interface disabled.")

    def get_sample(self):
        if hasattr(self, 'inlet'):
            sample, timestamp = self.inlet.pull_sample()
            return sample
        return np.random.rand(4)
