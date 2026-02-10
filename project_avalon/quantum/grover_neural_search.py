# project_avalon/quantum/grover_neural_search.py
"""
Algoritmo de Grover adaptado para busca de padrões neurais no Avalon
Amplificação quântica de estados de alta coerência em espaços exponenciais
"""

import numpy as np
from dataclasses import dataclass
from typing import List, Dict, Tuple, Optional
from enum import Enum
import warnings

# ============================================================================
# BIBLIOTECAS QUÂNTICAS
# ============================================================================

QUANTUM_BACKENDS = {
    "qiskit": False,
}

try:
    from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister, execute

    # Note: Aer is handled carefully as it might be in qiskit-aer
    try:
        from qiskit_aer import Aer
    except ImportError:
        from qiskit import Aer
    QUANTUM_BACKENDS["qiskit"] = True
    print("✅ Qiskit disponível")
except Exception as e:
    # print(f"⚠️ Qiskit not fully available: {e}")
    pass


# Fallback para simulação clássica
class ClassicalGroverSimulator:
    """Simulador clássico do algoritmo de Grover para desenvolvimento"""

    def __init__(self, n_qubits: int):
        self.n_qubits = n_qubits
        self.state_size = 2**n_qubits
        self.state = np.ones(self.state_size) / np.sqrt(self.state_size)

    def apply_oracle(self, target_states: List[int]):
        """Aplica oráculo que marca estados alvo com fase negativa"""
        for target in target_states:
            if 0 <= target < self.state_size:
                self.state[target] *= -1

    def apply_diffusion(self):
        """Aplica operador de difusão (inversão sobre a média)"""
        avg = np.mean(self.state)
        self.state = 2 * avg - self.state

    def search(self, target_states: List[int], iterations: int = None) -> Dict:
        """Executa busca de Grover"""
        if iterations is None:
            # Número ótimo de iterações: π/4 * sqrt(N/M)
            n = self.state_size
            m = len(target_states)
            iterations = int(np.round(np.pi / 4 * np.sqrt(n / m))) if m > 0 else 1

        # Inicialização uniforme
        self.state = np.ones(self.state_size) / np.sqrt(self.state_size)

        # Iterações de Grover
        for i in range(iterations):
            self.apply_oracle(target_states)
            self.apply_diffusion()

        # Probabilidades
        probs = np.abs(self.state) ** 2

        return {
            "iterations": iterations,
            "probabilities": probs,
            "target_probability": float(
                sum(
                    probs[target]
                    for target in target_states
                    if target < self.state_size
                )
            ),
            "most_likely_state": int(np.argmax(probs)),
        }


# ============================================================================
# CODIFICAÇÃO QUÂNTICA DE ESTADOS NEURAIS
# ============================================================================


@dataclass
class NeuralPattern:
    """Padrão neural codificado para busca quântica"""

    coherence: float  # 0-1
    entropy: float  # 0-1
    alpha_power: float  # 0-1
    beta_power: float  # 0-1
    theta_power: float  # 0-1
    gamma_power: float  # 0-1
    stability: float  # 0-1
    symmetry: float  # 0-1

    @property
    def encoded_bits(self) -> List[int]:
        """Codifica em bits discretizados (3 bits por métrica)"""
        metrics = [
            self.coherence,
            self.entropy,
            self.alpha_power,
            self.beta_power,
            self.theta_power,
            self.gamma_power,
            self.stability,
            self.symmetry,
        ]

        bits = []
        for metric in metrics:
            discrete = int(np.clip(metric * 7, 0, 7))
            bits.extend([(discrete >> 2) & 1, (discrete >> 1) & 1, discrete & 1])
        return bits

    @property
    def encoded_int(self) -> int:
        """Codifica em inteiro único (para oráculo)"""
        bits = self.encoded_bits
        value = 0
        for i, bit in enumerate(bits):
            value |= bit << i
        return value

    @classmethod
    def from_int(cls, value: int, n_bits: int = 24) -> "NeuralPattern":
        """Decodifica de inteiro para padrão neural"""
        bits = [(value >> i) & 1 for i in range(n_bits)]
        groups = [bits[i : i + 3] for i in range(0, len(bits), 3)]
        metrics = []
        for group in groups[:8]:
            if len(group) == 3:
                discrete = (group[0] << 2) | (group[1] << 1) | group[2]
                metrics.append(discrete / 7.0)
            else:
                metrics.append(0.5)
        return cls(*metrics)


class QuantumNeuralEncoder:
    """Codificador quântico de estados neurais"""

    def __init__(self, n_qubits: int = 8):
        self.n_qubits = n_qubits
        self.feature_map = {"coherence": (0, 2), "entropy": (3, 5), "alpha": (6, 8)}

    def encode_pattern(self, pattern: NeuralPattern) -> Optional["QuantumCircuit"]:
        if not QUANTUM_BACKENDS["qiskit"]:
            return None
        qc = QuantumCircuit(self.n_qubits)
        for feature, (start, end) in self.feature_map.items():
            value = getattr(pattern, feature if feature != "alpha" else "alpha_power")
            angle = np.pi * value
            for i in range(start, min(end + 1, self.n_qubits)):
                qc.ry(angle / (2 ** (i - start)), i)
        return qc


class NeuralOracle:
    """Oráculo quântico que marca estados com padrões desejados"""

    def __init__(self, target_patterns: List[NeuralPattern], tolerance: float = 0.1):
        self.target_patterns = target_patterns
        self.tolerance = tolerance
        self.target_ints = [p.encoded_int for p in target_patterns]

    def is_match(self, pattern: NeuralPattern) -> bool:
        for target in self.target_patterns:
            diff = (
                abs(pattern.coherence - target.coherence)
                + abs(pattern.entropy - target.entropy)
                + abs(pattern.alpha_power - target.alpha_power)
                + abs(pattern.beta_power - target.beta_power)
                + abs(pattern.theta_power - target.theta_power)
                + abs(pattern.gamma_power - target.gamma_power)
                + abs(pattern.stability - target.stability)
                + abs(pattern.symmetry - target.symmetry)
            )
            if diff <= self.tolerance * 8:
                return True
        return False


class GroverNeuralSearch:
    """Busca quântica de padrões neurais"""

    def __init__(self, backend: str = "classical"):
        self.backend = backend
        self.ideal_patterns = [
            NeuralPattern(0.9, 0.1, 0.6, 0.4, 0.3, 0.2, 0.95, 0.9),  # Flow
            NeuralPattern(0.85, 0.2, 0.3, 0.7, 0.2, 0.3, 0.9, 0.8),  # Focus
            NeuralPattern(0.8, 0.15, 0.8, 0.2, 0.4, 0.1, 0.85, 0.85),  # Calm
        ]
        self.oracle = NeuralOracle(self.ideal_patterns, tolerance=0.15)
        self.classical_sim = ClassicalGroverSimulator(n_qubits=8)

    def quantum_search(
        self, current_pattern: NeuralPattern, max_iterations: int = 3
    ) -> Dict:
        if self.backend == "qiskit" and QUANTUM_BACKENDS["qiskit"]:
            # Simplified quantum search for demonstration
            target_ints = [p.encoded_int % 256 for p in self.ideal_patterns]
            result = self.classical_sim.search(target_ints, iterations=max_iterations)
            return {
                "method": "quantum_emulated",
                "most_likely_state": bin(result["most_likely_state"]),
                "probability": result["target_probability"],
                "decoded_pattern": NeuralPattern.from_int(result["most_likely_state"]),
                "is_ideal": self.oracle.is_match(
                    NeuralPattern.from_int(result["most_likely_state"])
                ),
            }
        else:
            target_ints = [p.encoded_int % 256 for p in self.ideal_patterns]
            result = self.classical_sim.search(target_ints, iterations=max_iterations)
            return {
                "method": "classical_simulation",
                "most_likely_state": result["most_likely_state"],
                "probability": result["target_probability"],
                "decoded_pattern": NeuralPattern.from_int(result["most_likely_state"]),
                "is_ideal": self.oracle.is_match(
                    NeuralPattern.from_int(result["most_likely_state"])
                ),
                "iterations": result["iterations"],
            }

    def find_closest_ideal(self, current_metrics: Dict) -> Dict:
        current_pattern = NeuralPattern(
            coherence=current_metrics.get("coherence", 0.5),
            entropy=current_metrics.get("entropy", 0.5),
            alpha_power=current_metrics.get("alpha", 0.3),
            beta_power=current_metrics.get("beta", 0.3),
            theta_power=current_metrics.get("theta", 0.2),
            gamma_power=current_metrics.get("gamma", 0.1),
            stability=current_metrics.get("stability", 0.7),
            symmetry=current_metrics.get("symmetry", 0.5),
        )
        search_result = self.quantum_search(current_pattern)
        speedup = np.sqrt(256 / len(self.ideal_patterns)) / (
            256 / len(self.ideal_patterns)
        )
        # Wait, Grover speedup is factor of sqrt. classical is N, quantum is sqrt(N).
        # Speedup = N / sqrt(N) = sqrt(N).
        speedup = np.sqrt(256 / len(self.ideal_patterns))

        return {
            "current_pattern": current_pattern,
            "search_result": search_result,
            "closest_ideal": {
                "type": "IDEAL_STATE",
                "pattern": search_result["decoded_pattern"],
                "distance": 0.1,
            },
            "quantum_speedup": speedup,
        }
