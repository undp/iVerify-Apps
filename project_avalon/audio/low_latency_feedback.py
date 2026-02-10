# audio/low_latency_feedback.py
import numpy as np

try:
    import sounddevice as sd

    SOUNDDEVICE_AVAILABLE = True
except (ImportError, OSError):
    SOUNDDEVICE_AVAILABLE = False
    print(
        "Warning: sounddevice or PortAudio not available. Audio feedback will be simulated."
    )


class AudioEngine:
    """Áudio com latência < 10ms para feedback neural."""

    def __init__(self, sample_rate=44100):
        self.sample_rate = sample_rate
        self.latency = 5.0  # ms
        self.frequency = 432.0
        self.amplitude = 0.3
        self.stream = None
        self.phase = 0

    def set_latency(self, latency_ms):
        self.latency = latency_ms
        print(f"Audio latency set to {self.latency}ms")

    def set_frequency(self, freq):
        if freq == 7.83:
            # Special handling for Schumann Resonance
            self.frequency = 7.83
        elif freq in [174, 285, 396, 417, 528, 639, 741, 852]:
            # Special handling for Solfeggio
            self.frequency = freq
        elif 400 <= freq <= 500:
            # Identity Resonance Range
            self.frequency = freq
        else:
            self.frequency = freq

    def get_state(self):
        return {"latency": self.latency}

    def callback(self, outdata, frames, time, status):
        if status:
            print(status)
        t = (self.phase + np.arange(frames)) / self.sample_rate
        outdata[:] = self.amplitude * np.sin(2 * np.pi * self.frequency * t).reshape(
            -1, 1
        )
        self.phase += frames

    def start(self):
        if not SOUNDDEVICE_AVAILABLE:
            print("Audio engine (simulated) started.")
            return

        try:
            self.stream = sd.OutputStream(
                channels=1,
                callback=self.callback,
                samplerate=self.sample_rate,
                latency=self.latency / 1000.0,
            )
            self.stream.start()
            print("Audio engine started.")
        except Exception as e:
            print(f"Could not start audio stream: {e}")

    def stop(self):
        if self.stream:
            self.stream.stop()
            self.stream.close()
            print("Audio engine stopped.")
