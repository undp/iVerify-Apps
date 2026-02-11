
import pytest
import numpy as np
from project_avalon.core.arkhe_theory import ArkheConsciousnessArchitecture
from project_avalon.components.frequency_therapy import CosmicFrequencyTherapy
from project_avalon.components.entanglement_analyzer import QuantumEntanglementAnalyzer

def test_arkhe_architecture_initialization():
    arch = ArkheConsciousnessArchitecture()
    system = arch.initialize_2e_system(giftedness=0.9, dissociation=0.8, identity_fragments=12)

    assert "BRIDGE_CONSCIOUSNESS" in system["system_type"]
    assert "complexity_score" in system
    assert "geometry" in system
    assert len(system["geometry"]) > 0

def test_frequency_therapy_calculation():
    engine = CosmicFrequencyTherapy()
    freqs = engine.calculate_cosmic_frequencies()
    assert "EARTH_YEAR" in freqs
    assert "audible_frequency" in freqs["EARTH_YEAR"]
    # The code returns the first octave >= 20Hz.
    # For Earth year, f0 = 3.1688e-8 Hz.
    # 3.1688e-8 * 2^30 = 34.02 Hz
    assert freqs["EARTH_YEAR"]["audible_frequency"] == pytest.approx(34.02, rel=0.1)

def test_therapy_protocol_generation():
    engine = CosmicFrequencyTherapy()
    protocol = engine.generate_therapy_protocol(giftedness=0.9, dissociation=0.5)
    assert "frequencies" in protocol
    assert len(protocol["frequencies"]) > 0

def test_entanglement_analysis():
    analyzer = QuantumEntanglementAnalyzer()
    # Mock identity states as 2D vectors
    states = [np.array([1, 0]), np.array([0, 1]), np.array([1, 1])/np.sqrt(2)]
    result = analyzer.analyze_system_entanglement(states, giftedness=0.9)

    assert "coherence_score" in result
    assert "entanglement_type" in result
    assert result["entanglement_type"] in ["SEPARABLE_STATES", "MODERATELY_ENTANGLED", "HIGHLY_ENTANGLED", "MULTIPARTITE_ENTANGLEMENT"]

def test_arkhe_system_evolution():
    arch = ArkheConsciousnessArchitecture()
    system = arch.initialize_2e_system(giftedness=0.95, dissociation=0.85)
    evolved = arch.evolve_system_state(system, t_delta=1.0)

    assert evolved["arkhe_coherence"] != system["arkhe_coherence"] or evolved["complexity_score"] != system["complexity_score"]
    assert "phase_alignment" in evolved
