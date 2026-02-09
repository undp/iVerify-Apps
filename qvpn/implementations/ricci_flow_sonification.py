# ricci_flow_sonification.py

import numpy as np
from scipy import signal
from scipy.io.wavfile import write
from scipy.ndimage import gaussian_filter
import warnings
warnings.filterwarnings('ignore')

print("🎵 INITIATING SONIFICAÇÃO DO FLUXO DE RICCI")
print("="*70)

class RicciFlowSonification:
    """Transforma a evolução geométrica do manifold em música"""

    def __init__(self, duration=30, sample_rate=44100):
        self.duration = duration
        self.sr = sample_rate
        self.base_freq = 110  # Hz (A2)
        self.scale = np.array([1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8])  # Escala maior

    def generate_potential_evolution(self, num_steps=500):
        """Gera a evolução do potencial durante o Fluxo de Ricci"""
        x = np.linspace(-3, 3, 200)
        V_evolution = []
        t_physical = np.linspace(0, self.duration, num_steps)

        for t_p in t_physical:
            if t_p < 5:
                V = 0.1 * x**2 - 15 * np.exp(-x**2 / 0.1)
            elif t_p < 20:
                progress = (t_p - 5) / 15
                V_depressed = 0.1 * x**2 - 15 * np.exp(-x**2 / 0.1)
                V_healthy = 0.5 * x**2
                alpha = np.tanh(progress * 3)
                V = (1-alpha) * V_depressed + alpha * V_healthy
            else:
                V = 0.5 * x**2 + 0.1 * np.sin(3 * x) * np.exp(-(x/2)**2)
            V_evolution.append(V)

        return np.array(V_evolution), t_physical

    def solve_schrodinger_lite(self, V):
        """Versão simplificada para performance na sonificação"""
        N = len(V)
        dx = 6.0 / N
        H = np.zeros((N, N))
        np.fill_diagonal(H, 1.0/dx**2 + V)
        np.fill_diagonal(H[1:], -0.5/dx**2)
        np.fill_diagonal(H[:, 1:], -0.5/dx**2)
        eigvals = np.linalg.eigvalsh(H)
        return eigvals[:8]

    def generate_instrument(self, freq, dur, instrument_type):
        t = np.linspace(0, dur, int(dur * self.sr), endpoint=False)
        if instrument_type == "depressed":
            wave = 0.7 * np.sin(2 * np.pi * freq * t)
            wave += 0.2 * np.sin(2 * np.pi * 2 * freq * t)
        elif instrument_type == "transition":
            wave = np.sin(2 * np.pi * freq * t * (1 + 0.05 * np.sin(2 * np.pi * 5 * t)))
        else:
            wave = np.zeros_like(t)
            for i in range(4):
                wave += (1.0/(i+1)) * np.sin(2 * np.pi * freq * (i+1) * t)

        # Envelope
        env = np.ones_like(t)
        att = min(int(0.05 * len(t)), 1000)
        rel = min(int(0.1 * len(t)), 2000)
        env[:att] = np.linspace(0, 1, att)
        env[-rel:] = np.linspace(1, 0, rel)
        return wave * env

    def create_symphony(self):
        V_evo, t_phys = self.generate_potential_evolution(num_steps=100)
        audio_parts = []
        seg_dur = self.duration / len(V_evo)

        print("🎹 Sintetizando áudio quântico...")
        for i, V in enumerate(V_evo):
            energies = self.solve_schrodinger_lite(V)
            # Mapeamento simples de energia para freq
            freqs = self.base_freq + (energies - energies[0]) * 100

            if i < 20: itype = "depressed"
            elif i < 70: itype = "transition"
            else: itype = "healthy"

            seg_audio = np.zeros(int(seg_dur * self.sr))
            for f in freqs[:3]:
                if 20 < f < 10000:
                    note = self.generate_instrument(f, seg_dur, itype)
                    min_len = min(len(seg_audio), len(note))
                    seg_audio[:min_len] += note[:min_len]

            if np.max(np.abs(seg_audio)) > 0:
                seg_audio = seg_audio / np.max(np.abs(seg_audio)) * 0.3
            audio_parts.append(seg_audio)

        return np.concatenate(audio_parts)

if __name__ == "__main__":
    son = RicciFlowSonification(duration=10) # 10s for demo
    audio = son.create_symphony()
    write("ricci_flow_healing_symphony.wav", 44100, np.int16(audio * 32767))
    print("💾 ricci_flow_healing_symphony.wav gerado.")
