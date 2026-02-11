import numpy as np
import torch
from BioGenesis.core.bio_arkhe import ArkheGenome, BioAgent
from BioGenesis.core.constraint_engine import ConstraintLearner
from BioGenesis.core.particle_system import BioGenesisEngine
from project_avalon.components.neural_emotion_engine import UserNeuralProfile, NeuralFacialSequence
from project_avalon.components.arkhe_isomorphic_bridge import ArkheIsomorphicEngine
from project_avalon.components.knn_emotion_enhancer import UserEmotionProfile, FacialPattern
from datetime import datetime

def test_full_synthesis():
    print("Testing Full Synthesis...")

    # 1. Bio-Gênese Test
    genome = ArkheGenome(0.5, 0.5, 0.5, 0.5)
    engine = BioGenesisEngine(num_agents=5)
    engine.update(0.1)
    print("✓ Bio-Gênese Engine Operational")

    # 2. Neural Engine Test
    profile = UserNeuralProfile("test_user")
    seq = NeuralFacialSequence()
    # Mocking frames for tensor conversion
    seq.frames = [np.zeros((224, 224, 3), dtype=np.uint8)] * 5
    tensor = seq.to_tensor(sequence_length=5)
    assert tensor.shape == (5, 3, 224, 224)
    print("✓ Neural Emotion Engine (Tensors) Operational")

    # 3. Isomorphic Bridge Test
    iso_engine = ArkheIsomorphicEngine()
    mol = iso_engine.design_consciousness_molecule("meditative_peace", "Foco e paz")
    assert mol.drug_name.startswith("ConscioMol")
    print("✓ Arkhe-Isomorphic Bridge Operational")

    # 4. KNN Enhancer Test
    knn_profile = UserEmotionProfile("test_user")
    pattern = FacialPattern(
        landmarks_vector=np.zeros(1404),
        emotion="happy",
        valence=0.8,
        arousal=0.5,
        water_coherence=0.9,
        biochemical_impact=80.0,
        timestamp=datetime.now()
    )
    knn_profile.add_pattern(pattern)
    assert len(knn_profile.patterns) == 1
    print("✓ KNN Emotion Enhancer Operational")

    print("\n✅ ALL SYSTEMS GO")

if __name__ == "__main__":
    test_full_synthesis()
