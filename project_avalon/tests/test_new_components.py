import asyncio
import numpy as np
import pytest
from project_avalon.components.facial_biofeedback_system import QuantumFacialAnalyzer
from project_avalon.components.verbal_events_processor import VerbalBioCascade
from project_avalon.components.knn_emotion_enhancer import KNNEnhancedFacialAnalyzer
from project_avalon.components.neural_emotion_engine import NeuralQuantumAnalyzer
from project_avalon.components.arkhe_isomorphic_bridge import ArkheIsomorphicLab

def test_all_components_sync():
    asyncio.run(_test_all_components())

async def _test_all_components():
    print("Testing Quantum Facial Analyzer...")
    analyzer = QuantumFacialAnalyzer()
    frame = np.zeros((480, 640, 3), dtype=np.uint8)
    analysis = analyzer.analyze_frame(frame)
    # If using simulation mesh, it might return True. If actual mediapipe, False.
    if analyzer.face_mesh is None:
        assert analysis['face_detected'] == True
    else:
        assert analysis['face_detected'] == False
    print("  OK")

    print("Testing Verbal Bio Cascade...")
    cascade = VerbalBioCascade(text="Alignment")
    assert cascade.verbal_state.text == "Alignment"
    impact = cascade.calculate_total_impact()
    assert impact > 0
    print(f"  OK (Impact: {impact})")

    print("Testing KNN Enhanced Analyzer...")
    knn_analyzer = KNNEnhancedFacialAnalyzer()
    # Mock some data to train
    for i in range(11):
        analysis = knn_analyzer.analyze_frame(frame)
        analysis['emotion'] = 'happy'
        await knn_analyzer.process_emotional_state_with_knn(analysis)
    assert knn_analyzer.user_profile.knn_classifier is not None
    print("  OK")

    print("Testing Neural Quantum Analyzer...")
    neural_analyzer = NeuralQuantumAnalyzer()
    for i in range(12):
        analysis = neural_analyzer.analyze_frame_with_neural(frame)
        analysis['emotion'] = 'happy'
        await neural_analyzer.process_emotional_state_with_neural(analysis)
    # After 12 frames, we have 1 sequence added.
    assert len(neural_analyzer.user_profile.sequences) >= 1
    print("  OK")

    print("Testing Isomorphic Lab...")
    lab = ArkheIsomorphicLab()
    results = await lab.consciousness_molecule_design_session(
        target_experience="meditative_peace",
        verbal_intention="Paz profunda"
    )
    assert results['molecule'].drug_name.startswith("ConscioMol")
    print("  OK")

if __name__ == "__main__":
    asyncio.run(_test_all_components())
