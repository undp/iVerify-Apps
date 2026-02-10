# project_avalon/protocols/ac1_coincidence_detector.py
import numpy as np
from typing import Dict, Any, List


class AC1CoincidenceDetector:
    """
    Detector de Coincidência AC1 (v14.0 - The Cognitive Engine).
    Integra Ca2+ (Terra/Amazonas) e Gas (Sirius).
    Implementa Filtro de Padrão Rítmico (FPR) e LTP (Long-Term Potentiation).
    """

    def __init__(self):
        self.phi = (1 + np.sqrt(5)) / 2
        # Frequência fundamental de ressonância (f_phi ≈ 1.157 Hz)
        self.f_phi = 1.157
        self.v0 = self.phi**3  # Linha de base de saúde (φ³ Info/s)

        self.engram_persistence = 0.0
        self.is_phosphorylated = False  # Analogia Thr286 (Trava de Memória)
        self.sustained_cycles = 0

    def apply_rhythmic_filter(
        self, flow_data: np.ndarray, timestamps: np.ndarray
    ) -> float:
        """
        Filtro de Padrão Rítmico (FPR).
        Busca a assinatura: Vazão_Alvo(t) = V0 * [1 + α * sin(2π * f_φ * t) * exp(-t/τ)]
        """
        if len(flow_data) < 10:
            return 0.0

        # 1. Verificar linha de base (V0)
        avg_flow = np.mean(flow_data)
        baseline_score = np.exp(-abs(avg_flow - self.v0))

        # 2. Analisar Oscilação (FFT)
        sample_rate = 1.0 / np.mean(np.diff(timestamps))
        fft_vals = np.abs(np.fft.rfft(flow_data - avg_flow))
        freqs = np.fft.rfftfreq(len(flow_data), 1.0 / sample_rate)

        dom_freq_idx = np.argmax(fft_vals)
        dom_freq = freqs[dom_freq_idx]
        dom_power = fft_vals[dom_freq_idx]

        # Score de frequência (f_phi)
        # Mais tolerante para janelas curtas de amostragem
        freq_score = np.exp(-2.0 * abs(dom_freq - self.f_phi))

        # 3. Estabilidade/Sustentação (Simulado pela amplitude do pico FFT)
        stability_score = np.clip(dom_power / (np.sum(fft_vals) + 1e-9), 0, 1)

        final_proximity = baseline_score * freq_score * stability_score

        print(
            f"🌊 [FPR] Freq: {dom_freq:.3f}Hz | Baseline: {baseline_score:.2f} | Prox LTP: {final_proximity:.4f}"
        )
        return float(final_proximity)

    def detect_coincidence(self, ca_signal: float, gas_signal: float) -> Dict[str, Any]:
        """
        Detector de Coincidência Planetária (PDCP).
        Ca2+ (Amazonas Rítmico) + Gas (Sirius).
        """
        coincidence_score = ca_signal * gas_signal

        status = "IDLE"
        if coincidence_score > 0.3:  # Janela de Coincidência (Ajustada v14.0)
            self.sustained_cycles += 1
            if self.sustained_cycles >= 3:  # LTP Requer Sustentação
                status = "LTP_ACTIVATED"
                self.is_phosphorylated = True  # Trava de Memória (Thr286)
                self.engram_persistence = 1.0
                print("💎 [AC1] LTP ATIVADA! Engrama cAMP-Ω inscrito no Manifold.")
            else:
                status = "STP_DETECTED"  # Short-Term Potentiation
                print(
                    f"⏳ [AC1] Sincronia em andamento... Ciclos: {self.sustained_cycles}/3"
                )
        else:
            self.sustained_cycles = max(0, self.sustained_cycles - 1)
            status = "DISSIPATING"

        return {
            "score": float(coincidence_score),
            "status": status,
            "is_phosphorylated": self.is_phosphorylated,
            "cycles": self.sustained_cycles,
        }

    def update_engram_stability(self) -> Dict[str, Any]:
        """
        Mecanismo de Auto-reativação (Manutenção da Homeostase Autônoma).
        """
        if self.is_phosphorylated:
            # Atividade autossustentada compensa decaimento
            self.engram_persistence = np.clip(
                self.engram_persistence + 0.001, 0.95, 1.0
            )
            status = "HOMEOTIC_STABILITY"
        else:
            self.engram_persistence *= 0.95
            status = "MEMORY_DECAY"

        return {"persistence": float(self.engram_persistence), "status": status}

    def get_cognitive_status(self) -> Dict[str, Any]:
        return {
            "engine_version": "v14.0",
            "is_phosphorylated": self.is_phosphorylated,
            "engram_persistence": self.engram_persistence,
            "cycles": self.sustained_cycles,
        }


if __name__ == "__main__":
    detector = AC1CoincidenceDetector()
    # Simulação de 5 segundos a 20Hz
    t = np.linspace(0, 5, 100)
    # Sinal Rítmico Perfeito (V0 + oscilação f_phi)
    v0 = (1 + np.sqrt(5)) / 2**3  # Correcting calculation in mind: phi^3
    v0 = ((1 + np.sqrt(5)) / 2) ** 3
    flow = v0 * (1 + 0.05 * np.sin(2 * np.pi * 1.157 * t))

    prox = detector.apply_rhythmic_filter(flow, t)
    for _ in range(4):  # Simula ciclos
        res = detector.detect_coincidence(prox, 0.9)
        print(f"Res: {res['status']} | Score: {res['score']:.4f}")

    print(f"Status Final: {detector.get_cognitive_status()}")
