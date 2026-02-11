import pytest
import numpy as np
import asyncio
from project_avalon.core.nmri_system import ConsciousnessRealityInterface, CollectiveConsciousnessController, demonstrate_consciousness_reality_interface
from project_avalon.core.quantum_consciousness import QuantumNeuralField, QuantumEEGProcessor
from project_avalon.core.sacred_geometry import SacredGeometryEncoder, ConsciousnessResonanceChamber
from project_avalon.core.reality_engine import MetaphysicalRealityEngine, RealityLayer

def test_nmri_cycle_sync():
    asyncio.run(_test_nmri_cycle())

async def _test_nmri_cycle():
    interface = ConsciousnessRealityInterface()
    result = await interface.run_one_cycle()

    assert result is not None
    assert 'reality_config' in result
    assert 'stability' in result

    status = interface.get_system_status()
    assert status['uptime'] >= 0
    assert "Holographic" in status['metasurface']

def test_quantum_neural_field():
    eeg_data = np.random.randn(256)
    qnf = QuantumNeuralField.from_eeg(eeg_data)

    assert qnf.coherence_length > 0
    assert qnf.entanglement_entropy >= 0

    potential = np.random.randn(256)
    evolved = qnf.evolve_schrodinger(potential)
    assert evolved.psi_field.shape == qnf.psi_field.shape

def test_sacred_geometry_encoding():
    encoder = SacredGeometryEncoder()
    state = {'dominant_emotion': 'love'}
    pattern = encoder.encode(state)

    assert pattern.shape == (64, 64)
    assert np.max(pattern) == 1.0

def test_collective_control():
    controller = CollectiveConsciousnessController(n_users=2)
    controller.add_user(None, "user1")
    controller.add_user(None, "user2")

    state = controller.calculate_collective_attention()
    assert state['collective_attention'] > 0
    assert state['coherence'] > 0

def test_reality_engine_coupling():
    engine = MetaphysicalRealityEngine()
    state = {'coherence': 0.8, 'primary_mode': 'attention'}
    result = engine.apply_consciousness_to_reality(state, RealityLayer.PHYSICAL)

    assert 'primary' in result
    assert result['total_coherence'] == pytest.approx(0.8)

def test_quantum_eeg_processor():
    processor = QuantumEEGProcessor(n_qubits=4)
    eeg_data = np.random.randn(64)
    result = processor.quantum_attention_extraction(eeg_data)

    assert 'quantum_attention' in result
    assert result['classical_attention'] == pytest.approx(np.mean(np.abs(eeg_data)))

def test_resonance_chamber():
    chamber = ConsciousnessResonanceChamber()
    eeg_data = np.random.randn(256)
    result = chamber.resonate(eeg_data, 'dna_repair')

    assert result['target_frequency'] == 528.0
    assert result['amplification_factor'] > 1.0

def test_hardware_mvp():
    from project_avalon.core.hardware_mvp import SimulatedEEG, SimulatedMetasurface
    eeg = SimulatedEEG()
    ms = SimulatedMetasurface()

    att = eeg.read_attention()
    powers = eeg.get_brainwave_powers()
    assert 0 <= att <= 100
    assert 'beta' in powers

    ms.apply_pattern(np.random.rand(8, 8))
    assert ms.get_current_beam_direction() is not None

def test_consciousness_mapper():
    from project_avalon.core.consciousness_mapper import ConsciousnessMapper
    mapper = ConsciousnessMapper(size=8)
    powers = {'beta': 0.7, 'alpha': 0.1, 'theta': 0.1, 'gamma': 0.1}
    pattern = mapper.map_to_phase(powers, 85)

    assert pattern.shape == (8, 8)
    assert np.max(pattern) <= 360

def test_full_demonstration_sync():
    asyncio.run(demonstrate_consciousness_reality_interface())
