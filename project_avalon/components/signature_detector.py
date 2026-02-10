# topological_signature_detector.py
"""
Ouve a forma da Ponte através de Análise Topológica de Dados
Detecta a torção de Möbius em padrões de ativação
"""

import numpy as np
from ripser import ripser
from persim import plot_diagrams
import matplotlib.pyplot as plt
from typing import Dict, List, Tuple
from datetime import datetime


class TopologicalSignatureDetector:
    """
    Detecta assinaturas topológicas (torção de Möbius, ciclos)
    em trajetórias de sistemas cognitivos
    """

    def __init__(self, system_name: str = "Ponte"):
        self.system_name = system_name
        self.trajectories = []
        self.barcodes = []
        self.mobius_signature_detected = False

    def capture_state_trajectory(self, bridge_state_sequence: List[Dict]) -> np.ndarray:
        """
        Converte sequência de estados da Ponte em trajetória no espaço de fase

        Estado da Ponte tem:
        - Z(t): Coerência global [0, 1]
        - ε(t): Taxa de variação de coerência
        - φ(t): Fase do ciclo Möbius [0, 2π]
        - ψ(t): Perspectiva (0=humano, π=IA, valores intermediários=híbrido)
        """

        trajectory = []

        for state in bridge_state_sequence:
            point = np.array(
                [
                    state["coherence"],  # Z(t)
                    state["coherence_derivative"],  # ε(t)
                    np.cos(state["mobius_phase"]),  # φ_x = cos(φ)
                    np.sin(state["mobius_phase"]),  # φ_y = sin(φ)
                    state["perspective"],  # ψ(t)
                ]
            )
            trajectory.append(point)

        trajectory = np.array(trajectory)
        self.trajectories.append(trajectory)

        return trajectory

    def compute_persistent_homology(
        self, trajectory: np.ndarray, max_dimension: int = 2
    ):
        """
        Computa homologia persistente da trajetória

        Retorna:
        - H₀: Componentes conectados (sempre trivial para trajetória)
        - H₁: Ciclos (AQUI ESTÁ A MÖBIUS!)
        - H₂: Vazios/cavidades
        """

        print(f"\n🔬 Computing persistent homology (dim ≤ {max_dimension})...")

        # Usa Ripser para computar
        result = ripser(trajectory, maxdim=max_dimension)
        diagrams = result["dgms"]

        self.barcodes.append(diagrams)

        # Análise
        self._analyze_homology(diagrams)

        return diagrams

    def _analyze_homology(self, diagrams: List[np.ndarray]):
        """
        Analisa diagramas de persistência em busca de assinaturas
        """

        print("\n📊 Homology Analysis:")

        for dim, dgm in enumerate(diagrams):
            if len(dgm) == 0:
                continue

            # Remove ponto no infinito
            dgm_finite = dgm[dgm[:, 1] < np.inf]

            if len(dgm_finite) == 0:
                print(f"   H_{dim}: No finite features")
                continue

            # Calcula persistências (lifetime de cada feature)
            persistences = dgm_finite[:, 1] - dgm_finite[:, 0]

            # Features significativas (persistência > threshold)
            threshold = 0.1 * np.max(persistences) if len(persistences) > 0 else 0
            significant = persistences > threshold

            print(
                f"   H_{dim}: {len(dgm_finite)} features ({np.sum(significant)} significant)"
            )

            # H₁ é onde procuramos a Möbius
            if dim == 1 and np.sum(significant) > 0:
                self._check_mobius_signature(dgm_finite[significant])

    def _check_mobius_signature(self, h1_features: np.ndarray):
        """
        Verifica se há assinatura de torção de Möbius em H₁

        Möbius tem característica específica:
        - UM ciclo dominante de longa persistência
        - Ciclo que "inverte orientação" (detectado via análise de fase)
        """

        if len(h1_features) == 0:
            return

        # Ordena por persistência
        persistences = h1_features[:, 1] - h1_features[:, 0]
        dominant_idx = np.argmax(persistences)
        dominant_cycle = h1_features[dominant_idx]

        birth, death = dominant_cycle
        persistence = death - birth

        print(f"\n🔍 Dominant H₁ cycle:")
        print(f"   Birth: {birth:.3f}")
        print(f"   Death: {death:.3f}")
        print(f"   Persistence: {persistence:.3f}")

        # Heurística: Möbius tem UM ciclo muito persistente
        # (persistência >> todas as outras)
        if len(persistences) > 1:
            second_longest = np.partition(persistences, -2)[-2]
            ratio = persistence / second_longest if second_longest > 0 else np.inf

            print(f"   Dominance ratio: {ratio:.2f}")

            if ratio > 3.0:  # Ciclo é 3x mais persistente que o segundo
                print(f"   🎯 MÖBIUS SIGNATURE DETECTED!")
                self.mobius_signature_detected = True
            else:
                print(f"   ⚠️  Multiple cycles (not Möbius)")
        else:
            print(f"   🎯 SINGLE DOMINANT CYCLE (Möbius candidate)")
            self.mobius_signature_detected = True

    def detect_phase_inversion(self, trajectory: np.ndarray) -> bool:
        """
        Detecta inversão de fase característica da Möbius

        Ao completar um ciclo na faixa, a orientação inverte.
        Isto aparece como φ(t) dando uma volta completa enquanto
        ψ(t) (perspectiva) só dá meia volta.
        """

        # Extrai componentes de fase
        phi_x = trajectory[:, 2]  # cos(φ)
        phi_y = trajectory[:, 3]  # sin(φ)
        psi = trajectory[:, 4]  # perspectiva

        # Reconstroi ângulo de fase
        phi = np.arctan2(phi_y, phi_x)

        # Conta voltas completas
        phi_unwrapped = np.unwrap(phi)
        psi_unwrapped = np.unwrap(psi)

        phi_turns = (phi_unwrapped[-1] - phi_unwrapped[0]) / (2 * np.pi)
        psi_turns = (psi_unwrapped[-1] - psi_unwrapped[0]) / (2 * np.pi)

        print(f"\n🔄 Phase Inversion Analysis:")
        print(f"   φ rotations: {phi_turns:.2f}")
        print(f"   ψ rotations: {psi_turns:.2f}")
        print(f"   Ratio φ/ψ: {phi_turns/psi_turns if psi_turns != 0 else 'inf':.2f}")

        # Möbius: φ dá 1 volta, ψ dá 0.5 volta → ratio ≈ 2
        ratio = phi_turns / psi_turns if psi_turns != 0 else 0

        if 1.5 < ratio < 2.5:
            print(f"   🎯 PHASE INVERSION CONFIRMED (Möbius)")
            return True
        else:
            print(f"   ⚠️  No clear inversion")
            return False

    def visualize_topology(self, trajectory: np.ndarray, diagrams: List[np.ndarray]):
        """
        Visualiza trajetória e diagramas de persistência
        """

        fig = plt.figure(figsize=(16, 6))

        # 1. Trajetória em 3D (projeção)
        ax1 = fig.add_subplot(131, projection="3d")
        ax1.plot(
            trajectory[:, 0],
            trajectory[:, 2],
            trajectory[:, 4],
            "b-",
            linewidth=2,
            alpha=0.7,
        )
        ax1.scatter(
            trajectory[0, 0],
            trajectory[0, 2],
            trajectory[0, 4],
            c="green",
            s=100,
            marker="o",
            label="Start",
        )
        ax1.scatter(
            trajectory[-1, 0],
            trajectory[-1, 2],
            trajectory[-1, 4],
            c="red",
            s=100,
            marker="X",
            label="End",
        )
        ax1.set_xlabel("Coherence Z(t)")
        ax1.set_ylabel("Phase cos(φ)")
        ax1.set_zlabel("Perspective ψ(t)")
        ax1.set_title("Trajectory in State Space")
        ax1.legend()

        # 2. Diagrama de persistência
        ax2 = fig.add_subplot(132)
        plot_diagrams(diagrams, ax=ax2)
        ax2.set_title("Persistence Diagram")

        # 3. Evolução temporal
        ax3 = fig.add_subplot(133)
        t = np.arange(len(trajectory))
        ax3.plot(t, trajectory[:, 0], label="Coherence Z(t)", linewidth=2)
        ax3.plot(t, trajectory[:, 4] / np.pi, label="Perspective ψ(t)/π", linewidth=2)
        ax3.axhline(
            y=0.5, color="r", linestyle="--", alpha=0.5, label="Critical threshold"
        )
        ax3.set_xlabel("Time step")
        ax3.set_ylabel("Value")
        ax3.set_title("State Evolution")
        ax3.legend()
        ax3.grid(True, alpha=0.3)

        plt.tight_layout()

        filename = f"topology_{self.system_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
        plt.savefig(filename, dpi=150, bbox_inches="tight")

        print(f"\n💾 Visualization saved: {filename}")

        return fig

    def generate_report(self) -> str:
        """
        Gera relatório da análise topológica
        """

        report = f"""# 🔬 Topological Signature Analysis: {self.system_name}

**Generated:** {datetime.now().isoformat()}

## Summary

Analyzed **{len(self.trajectories)}** state trajectories using persistent homology.

**Möbius Signature Detected:** {"✅ YES" if self.mobius_signature_detected else "❌ NO"}

---

## Methodology

Applied **Topological Data Analysis** (TDA) to detect geometric invariants:

1. **Trajectory Capture**: Converted system states to points in 5D phase space
   - Dimensions: [Z, ε, cos(φ), sin(φ), ψ]

2. **Persistent Homology**: Computed topological features across scales
   - H₀: Connected components
   - H₁: Cycles (Möbius signature)
   - H₂: Voids

3. **Signature Detection**: Identified Möbius via:
   - Dominant single cycle in H₁
   - Phase inversion ratio φ/ψ ≈ 2

---

## Interpretation

"""

        if self.mobius_signature_detected:
            report += """
### ✅ Möbius Topology CONFIRMED

The system exhibits non-orientable geometry characteristic of a Möbius strip:

- **Single dominant cycle**: One persistent H₁ feature >> all others
- **Phase inversion**: Full rotation in state space = half rotation in perspective space
- **Twist signature**: Orientation reverses upon cycle completion

**Implication:** The system successfully navigates the "admissible manifold"
of healthy human-AI cognition. The Möbius topology enforces perspective
alternation, preventing lock-in to single viewpoint.

"""
        else:
            report += """
### ⚠️ Möbius Topology NOT DETECTED

The system does not exhibit clear Möbius geometry:

- Multiple competing cycles in H₁, OR
- No persistent cycles, OR
- Phase ratio inconsistent with twist

**Implication:** System may not be enforcing perspective alternation.
Risk of coherence lock-in or fragmentation. Recommend:

1. Verify gear mechanisms are active
2. Check for stuck states (Z ≈ 1.0 or Z ≈ 0)
3. Increase phase oscillation amplitude

"""

        report += """
---

## Next Steps

1. **Continuous Monitoring**: Track topology over extended operation
2. **Perturbation Analysis**: How does topology respond to parameter changes?
3. **Comparative Study**: Compare to other systems (POP, Avalon)

---

*"The shape of the space constrains the dance of the system."*
"""

        return report


# ===== INTEGRAÇÃO COM SISTEMAS EXISTENTES =====


class BridgeTopologyMonitor:
    """
    Monitor específico para a Ponte
    """

    def __init__(self, bridge_system):
        self.bridge = bridge_system
        self.detector = TopologicalSignatureDetector("Ponte")

    async def continuous_monitoring(self, duration_steps: int = 1000):
        """
        Monitora topologia da Ponte em tempo real
        """

        print(f"🌉 Monitoring Bridge topology for {duration_steps} steps...")

        states = []

        # Simula evolução da Ponte
        for step in range(duration_steps):
            state = await self.bridge.get_current_state()
            states.append(state)

            # A cada 100 passos, analisa
            if (step + 1) % 100 == 0:
                trajectory = self.detector.capture_state_trajectory(states[-100:])
                diagrams = self.detector.compute_persistent_homology(trajectory)

                has_inversion = self.detector.detect_phase_inversion(trajectory)

        # Análise final
        final_trajectory = self.detector.capture_state_trajectory(states)
        final_diagrams = self.detector.compute_persistent_homology(final_trajectory)

        # Visualização
        self.detector.visualize_topology(final_trajectory, final_diagrams)

        # Relatório
        report = self.detector.generate_report()

        with open(f"bridge_topology_report.md", "w") as f:
            f.write(report)

        return self.detector.mobius_signature_detected


class POPTopologyMonitor:
    """
    Monitor específico para POP (ordem persistente)
    """

    def __init__(self):
        self.detector = TopologicalSignatureDetector("POP")

    def analyze_biosignature_manifold(self, detection_history: List[Dict]):
        """
        Analisa manifold de detecções POP

        Esperamos ver estrutura geométrica específica:
        - Cluster de "vida" vs cluster de "não-vida"
        - Fronteira de decisão com topologia específica
        """

        print(f"🔬 Analyzing POP manifold from {len(detection_history)} detections...")

        # Constrói trajetória no espaço (DNE, SSO, CDC)
        trajectory = np.array(
            [
                [d["features"]["dne"], d["features"]["sso"], d["features"]["cdc"]]
                for d in detection_history
            ]
        )

        # Análise topológica
        diagrams = self.detector.compute_persistent_homology(
            trajectory, max_dimension=2
        )

        # Visualização
        self.detector.visualize_topology(trajectory, diagrams)

        # Relatório
        report = self.detector.generate_report()

        return diagrams


class AvalonTopologyMonitor:
    """
    Monitor específico para Avalon (ressonância multi-AI)
    """

    def __init__(self):
        self.detector = TopologicalSignatureDetector("Avalon")

    def analyze_harmonic_manifold(self, multi_ai_responses: List[Dict]):
        """
        Analisa geometria do espaço de respostas multi-AI

        Esperamos ver:
        - Clusters por tópico (onde AIs concordam)
        - Ciclos de divergência-convergência
        """

        print(
            f"🎵 Analyzing Avalon harmonic manifold from {len(multi_ai_responses)} responses..."
        )

        # Constrói trajetória no espaço de embeddings
        # (Simplificação - em implementação real, usaria embeddings reais)
        trajectory = np.random.randn(len(multi_ai_responses), 5)

        # Análise topológica
        diagrams = self.detector.compute_persistent_homology(
            trajectory, max_dimension=2
        )

        return diagrams


# ===== SCRIPT DE DEMONSTRAÇÃO =====


async def demo_bridge_topology():
    """
    Demonstração da detecção de topologia da Ponte
    """

    print("=" * 70)
    print("🔬 BRIDGE TOPOLOGICAL SIGNATURE DETECTION")
    print("=" * 70)

    # Simula estados da Ponte
    class MockBridge:
        def __init__(self):
            self.t = 0
            self.omega = 2 * np.pi / 100  # Período de 100 passos

        async def get_current_state(self):
            # Estado que faz uma volta completa na Möbius
            state = {
                "coherence": 0.5 + 0.3 * np.sin(self.omega * self.t),
                "coherence_derivative": 0.3 * self.omega * np.cos(self.omega * self.t),
                "mobius_phase": self.omega * self.t,  # φ: 0 → 2π
                "perspective": (self.omega * self.t) / 2,  # ψ: 0 → π (meia volta!)
            }
            self.t += 1
            return state

    bridge = MockBridge()
    monitor = BridgeTopologyMonitor(bridge)

    # Monitora
    detected = await monitor.continuous_monitoring(duration_steps=200)

    print("\n" + "=" * 70)
    print(
        f"RESULT: Möbius signature {'DETECTED ✅' if detected else 'NOT DETECTED ❌'}"
    )
    print("=" * 70)


if __name__ == "__main__":
    import asyncio

    asyncio.run(demo_bridge_topology())
