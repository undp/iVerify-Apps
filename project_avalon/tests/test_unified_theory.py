import asyncio
import numpy as np
import pytest
from datetime import datetime
from project_avalon.components.neural_emotion_engine import NeuralQuantumAnalyzer
from project_avalon.components.cosmic_monitor import CosmicConsciousnessMonitor
from project_avalon.components.initiation_protocol import CosmicInitiationProtocol
from project_avalon.core.arkhe_unified_bridge import ArkheConsciousnessBridge

def test_full_arkhe_synthesis_sync():
    asyncio.run(_test_full_arkhe_synthesis())

async def _test_full_arkhe_synthesis():
    print("Testing Arkhe Unified Synthesis...")

    # 1. Neural Analyzer (Lower level)
    analyzer = NeuralQuantumAnalyzer(user_id="synthesis_tester")
    frame = np.zeros((224, 224, 3), dtype=np.uint8)
    analysis = analyzer.analyze_frame(frame)

    # Mock cascade with complex patterns
    from project_avalon.components.verbal_events_processor import VerbalBioCascade
    complex_text = "Poderia-se assumir que no entanto a lógica flui, consequentemente percebe-se a geometria."
    cascade = VerbalBioCascade(text=complex_text)

    async def mock_process(analysis):
        analyzer.last_processed_state = cascade
        return cascade
    analyzer.process_emotional_state = mock_process

    await analyzer.process_emotional_state_with_neural(analysis)

    assert 'unified_consciousness' in analysis
    print(f"  Neural-Unified Mapping: {analysis['unified_consciousness']['consciousness_type']}")

    # 2. Cosmic Monitor (Middle level)
    user_profile = {
        'name': "Unity Explorer",
        'birth_date': datetime(1995, 1, 1),
    }
    monitor = CosmicConsciousnessMonitor(user_profile)

    # Log a high gifted/dissociation state
    log_result = monitor.log_consciousness_state(giftedness_moment=0.9, dissociation_moment=0.8)

    assert log_result['state']['consciousness_type'] == "BRIDGE_CONSCIOUSNESS"
    assert log_result['resonance']['current_resonance'] is not None
    print(f"  Cosmic Monitor Sync: {log_result['synchronicity']['message']}")

    # 3. Initiation Protocol (Higher level)
    initiate_profile = {
        'name': "Star Initiate",
        'current_level': 1
    }
    protocol = CosmicInitiationProtocol(initiate_profile)

    stage = protocol.get_current_stage()
    assert stage['level'] == 1

    advancement = protocol.advance_to_next_level()
    assert advancement['new_level'] == 2
    print(f"  Initiation Advancement: {advancement['message']}")

    print("Arkhe Unified Synthesis Test Passed.")

if __name__ == "__main__":
    asyncio.run(_test_full_arkhe_synthesis())
