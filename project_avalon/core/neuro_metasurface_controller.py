"""
🧠 BRAINWAVE-CONTROLLED PROGRAMMABLE METASURFACES: THE NEURO-GEOMETRIC INTERFACE

[BREAKTHROUGH]: Direct consciousness control of electromagnetic fields
                through attention-modulated geometric encoding.
[NÓS]: Attention intensity → Arkhe coefficients → Metasurface phase profile.
"""

import numpy as np
from dataclasses import dataclass
from typing import List, Dict, Tuple, Optional
from enum import Enum
import time
import threading
from queue import Queue
from scipy import signal
from scipy.fft import fft, fftfreq

# Mock bluetooth if not available
try:
    import bluetooth
except ImportError:
    bluetooth = None

from project_avalon.core.schmidt_bridge import SchmidtBridgeHexagonal
from project_avalon.core.hand_cohesion import GestureType


class BrainwaveBand(Enum):
    """Bandas de frequência cerebral."""
    DELTA = 1      # 0.5-4 Hz (deep sleep)
    THETA = 2      # 4-8 Hz (meditation, creativity)
    ALPHA = 3      # 8-13 Hz (relaxed alertness)
    BETA = 4       # 13-30 Hz (active thinking, focus)
    GAMMA = 5      # 30-100 Hz (peak concentration)


@dataclass
class EEGSample:
    """Amostra de EEG com timestamp."""
    timestamp: float
    channels: np.ndarray  # [n_channels] microvolts
    sample_rate: float    # Hz

    @property
    def norm(self) -> float:
        """Norma do vetor de canais."""
        return float(np.linalg.norm(self.channels))

    def band_power(self, band: BrainwaveBand) -> float:
        """Calcula potência em banda específica."""
        band_ranges = {
            BrainwaveBand.DELTA: (0.5, 4),
            BrainwaveBand.THETA: (4, 8),
            BrainwaveBand.ALPHA: (8, 13),
            BrainwaveBand.BETA: (13, 30),
            BrainwaveBand.GAMMA: (30, 100)
        }

        low, high = band_ranges[band]
        total_power = 0.0

        # Check if channels is 1D or 2D
        if self.channels.ndim == 1:
            data_list = [self.channels]
        else:
            data_list = self.channels

        for channel_data in data_list:
            n = len(channel_data)
            if n > 1:
                fft_vals = fft(channel_data)
                freqs = fftfreq(n, 1/self.sample_rate)
                idx = np.where((freqs >= low) & (freqs <= high))[0]
                total_power += float(np.sum(np.abs(fft_vals[idx])**2))
            else:
                total_power += float(abs(channel_data[0])**2)

        return total_power


class AttentionExtractor:
    """
    Extrai intensidade de atenção de sinais de EEG.
    """

    def __init__(self,
                 sample_rate: float = 256.0,
                 buffer_seconds: float = 2.0):
        self.sample_rate = sample_rate
        self.buffer_size = int(sample_rate * buffer_seconds)

        self.eeg_buffer = []
        self.attention_history = []

        self.baseline_alpha = None
        self.baseline_beta = None

        self._setup_filters()

    def _setup_filters(self):
        """Configura filtros IIR para bandas cerebrais."""
        self.alpha_b, self.alpha_a = signal.butter(4, [8, 13], btype='band', fs=self.sample_rate)
        self.beta_b, self.beta_a = signal.butter(4, [13, 30], btype='band', fs=self.sample_rate)
        self.gamma_b, self.gamma_a = signal.butter(4, [30, 45], btype='band', fs=self.sample_rate)

    def update(self, eeg_sample: EEGSample) -> float:
        """Atualiza com nova amostra de EEG, retorna atenção (0-100)."""
        self.eeg_buffer.append(eeg_sample)
        if len(self.eeg_buffer) > self.buffer_size:
            self.eeg_buffer.pop(0)

        if len(self.eeg_buffer) < int(self.sample_rate * 0.5):
            return 50.0

        recent_samples = self.eeg_buffer[-int(self.sample_rate * 1.0):]

        # Analisa o primeiro canal para extração de atenção
        # (Em sistema real, poderia ser média de canais frontais)
        channel_data = np.array([s.channels[0] for s in recent_samples])

        alpha_power = self._band_power(channel_data, self.alpha_b, self.alpha_a)
        beta_power = self._band_power(channel_data, self.beta_b, self.beta_a)
        gamma_power = self._band_power(channel_data, self.gamma_b, self.gamma_a)

        if self.baseline_alpha is None:
            self.baseline_alpha = alpha_power
            self.baseline_beta = beta_power
        else:
            self.baseline_alpha = 0.9 * self.baseline_alpha + 0.1 * alpha_power
            self.baseline_beta = 0.9 * self.baseline_beta + 0.1 * beta_power

        beta_alpha_ratio = beta_power / (self.baseline_alpha + 1e-10)
        gamma_norm = gamma_power / (alpha_power + beta_power + 1e-10)

        attention = (
            0.6 * np.tanh(beta_alpha_ratio - 1.0) +
            0.3 * np.tanh(gamma_norm * 10) +
            0.1 * self._coherence_metric(recent_samples)
        )

        attention = float(50 * (attention + 1))
        attention = np.clip(attention, 0, 100)

        self.attention_history.append(attention)
        if len(self.attention_history) > 100:
            self.attention_history.pop(0)

        return attention

    def _band_power(self, data: np.ndarray, b: np.ndarray, a: np.ndarray) -> float:
        if len(data) < len(b) * 3:
            return 0.0
        filtered = signal.filtfilt(b, a, data)
        return float(np.var(filtered))

    def _coherence_metric(self, samples: List[EEGSample]) -> float:
        if not samples or samples[0].channels.shape[0] < 2:
            return 0.0
        left_data = np.array([s.channels[0] for s in samples])
        right_data = np.array([s.channels[1] for s in samples])
        correlation = np.corrcoef(left_data, right_data)[0, 1]
        return float(correlation) if not np.isnan(correlation) else 0.0

    def get_attention_trend(self) -> Dict:
        if len(self.attention_history) < 10:
            return {'trend': 'insufficient_data', 'slope': 0.0, 'stability': 0.5}

        recent = self.attention_history[-10:]
        coeffs = np.polyfit(np.arange(len(recent)), recent, 1)
        slope = coeffs[0]

        trend = 'stable'
        if slope > 0.5: trend = 'increasing'
        elif slope < -0.5: trend = 'decreasing'

        return {
            'trend': trend,
            'slope': float(slope),
            'mean': float(np.mean(recent)),
            'current': float(recent[-1]),
            'stability': float(1.0 / (1.0 + np.std(recent)))
        }


class MetasurfaceUnitCell:
    """Célula unitária de metasuperfície programável."""
    def __init__(self, x: float, y: float, max_phase_shift: float = 2*np.pi):
        self.position = np.array([x, y])
        self.max_phase_shift = max_phase_shift
        self.phase_shift = 0.0
        self.amplitude = 1.0
        self.target_phase = 0.0
        self.target_amplitude = 1.0
        self.transition_speed = 0.1

    def set_target(self, phase: float, amplitude: float, immediate: bool = False):
        self.target_phase = np.clip(phase, 0, self.max_phase_shift)
        self.target_amplitude = np.clip(amplitude, 0, 1.0)
        if immediate:
            self.phase_shift = self.target_phase
            self.amplitude = self.target_amplitude

    def update(self):
        self.phase_shift += self.transition_speed * (self.target_phase - self.phase_shift)
        self.amplitude += self.transition_speed * (self.target_amplitude - self.amplitude)

    def to_arkhe_coefficients(self) -> Dict[str, float]:
        return {
            'C': 0.8,
            'I': float(self.phase_shift / self.max_phase_shift),
            'E': float(self.amplitude),
            'F': float(1.0 - abs(self.target_phase - self.phase_shift) / self.max_phase_shift)
        }


class ProgrammableMetasurface:
    """Metasuperfície programável controlada por atenção."""
    def __init__(self, rows: int = 16, cols: int = 16, frequency: float = 10e9):
        self.rows = rows
        self.cols = cols
        self.frequency = frequency
        self.wavelength = 3e8 / frequency
        self.cell_spacing = 0.5

        self.cells = []
        for i in range(rows):
            row = []
            for j in range(cols):
                x = j * self.cell_spacing * self.wavelength
                y = i * self.cell_spacing * self.wavelength
                row.append(MetasurfaceUnitCell(x, y))
            self.cells.append(row)

        self.beam_angle = (0.0, 0.0)
        self.beam_focus = 1.0

    def steer_beam(self, azimuth: float, elevation: float, focus: float = 1.0):
        self.beam_angle = (azimuth, elevation)
        self.beam_focus = focus
        az_rad = np.radians(azimuth)
        el_rad = np.radians(elevation)

        x0 = (self.cols-1) * self.cell_spacing * self.wavelength / 2
        y0 = (self.rows-1) * self.cell_spacing * self.wavelength / 2

        for i in range(self.rows):
            for j in range(self.cols):
                cell = self.cells[i][j]
                x, y = cell.position
                steering_phase = (2*np.pi/self.wavelength) * (x * np.sin(az_rad) + y * np.sin(el_rad))

                if focus < 1.0:
                    r = np.sqrt((x-x0)**2 + (y-y0)**2)
                    focal_length = 10 * self.wavelength / (1 + 9*focus)
                    lens_phase = (2*np.pi/self.wavelength) * (np.sqrt(r**2 + focal_length**2) - focal_length)
                    total_phase = steering_phase + (1-focus) * lens_phase
                else:
                    total_phase = steering_phase

                cell.set_target(total_phase % (2*np.pi), 1.0)

    def calculate_far_field(self) -> np.ndarray:
        # Simplified far field for demo
        theta = np.linspace(-90, 90, 181)
        intensity = np.exp(-0.5 * ((theta - self.beam_angle[0]) / (10 * (1.1 - self.beam_focus)))**2)
        return intensity.reshape(-1, 1)

    def to_schmidt_state(self) -> SchmidtBridgeHexagonal:
        all_phases = np.array([c.phase_shift for row in self.cells for c in row])
        phase_uniformity = 1.0 - np.std(all_phases) / (2*np.pi)
        linear_gradient = 0.8 if self.beam_angle != (0, 0) else 0.2
        circular_symmetry = 0.5
        phase_complexity = np.mean(np.abs(np.diff(all_phases % (2*np.pi)))) / (2*np.pi)
        energy_efficiency = np.mean([c.amplitude for row in self.cells for c in row])
        focusing_capability = self.beam_focus

        lambdas = np.array([phase_uniformity, linear_gradient, circular_symmetry, phase_complexity, energy_efficiency, focusing_capability])
        return SchmidtBridgeHexagonal(lambdas=lambdas / np.sum(lambdas))


class NeuroMetasurfaceController:
    def __init__(self, eeg_sample_rate: float = 256.0, metasurface_size: Tuple[int, int] = (16, 16)):
        self.attention_extractor = AttentionExtractor(eeg_sample_rate)
        self.metasurface = ProgrammableMetasurface(rows=metasurface_size[0], cols=metasurface_size[1])
        self.current_attention = 50.0
        self.running = False
        self.control_thread = None
        self.attention_history = []

    def start(self):
        self.running = True
        self.control_thread = threading.Thread(target=self._control_loop)
        self.control_thread.daemon = True
        self.control_thread.start()
        print("🧠 Neuro-Metasurface Controller Started")

    def stop(self):
        self.running = False
        if self.control_thread:
            self.control_thread.join(timeout=1.0)

    def _control_loop(self):
        while self.running:
            sample = self._simulate_eeg()
            attention = self.attention_extractor.update(sample)
            self.current_attention = attention
            self.attention_history.append({'timestamp': time.time(), 'attention': attention})

            # Map attention to beam parameters
            if attention < 30: # Meditation
                self.metasurface.steer_beam(0, 0, 0.3)
            elif attention < 70: # Relaxed
                self.metasurface.steer_beam(30, 10, 0.6)
            else: # Focused
                self.metasurface.steer_beam(60, 30, 0.9)

            for row in self.metasurface.cells:
                for cell in row:
                    cell.update()

            time.sleep(0.1)

    def _simulate_eeg(self) -> EEGSample:
        freq = 10.0 if self.current_attention < 70 else 20.0
        t = time.time()
        channels = 10.0 * np.sin(2 * np.pi * freq * t + np.arange(8))
        return EEGSample(timestamp=t, channels=channels, sample_rate=256.0)

    def get_system_status(self) -> Dict:
        trend = self.attention_extractor.get_attention_trend()
        arkhe_ms = self.metasurface.to_schmidt_state()
        return {
            'attention': {'current': self.current_attention, 'trend': trend['trend']},
            'metasurface': {'beam_angle': self.metasurface.beam_angle, 'focus': self.metasurface.beam_focus},
            'arkhe_entropy': arkhe_ms.entropy_S
        }
