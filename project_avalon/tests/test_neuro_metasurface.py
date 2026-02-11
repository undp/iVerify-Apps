import pytest
import numpy as np
import time
from project_avalon.core.neuro_metasurface_controller import NeuroMetasurfaceController, EEGSample, AttentionExtractor

def test_attention_extractor():
    extractor = AttentionExtractor(sample_rate=256.0)

    # Generate some dummy EEG samples
    # 1. Low attention (Theta dominant)
    for i in range(256): # 1 second of data
        t = time.time()
        # Theta: 6Hz
        val = 10.0 * np.sin(2 * np.pi * 6.0 * i / 256.0)
        channels = np.array([val] * 8)
        sample = EEGSample(timestamp=t, channels=channels, sample_rate=256.0)
        attention = extractor.update(sample)

    low_attention = extractor.attention_history[-1]

    # 2. High attention (Beta dominant)
    for i in range(256):
        t = time.time()
        # Beta: 20Hz
        val = 10.0 * np.sin(2 * np.pi * 20.0 * i / 256.0)
        channels = np.array([val] * 8)
        sample = EEGSample(timestamp=t, channels=channels, sample_rate=256.0)
        attention = extractor.update(sample)

    high_attention = extractor.attention_history[-1]

    assert high_attention != low_attention
    print(f"Low attention: {low_attention:.2f}, High attention: {high_attention:.2f}")

def test_metasurface_steering():
    controller = NeuroMetasurfaceController(metasurface_size=(8, 8))

    # Initial state
    assert controller.metasurface.beam_angle == (0.0, 0.0)

    # Steer beam
    controller.metasurface.steer_beam(45.0, 15.0, focus=0.8)
    assert controller.metasurface.beam_angle == (45.0, 15.0)
    assert controller.metasurface.beam_focus == 0.8

    # Check Arkhe mapping
    arkhe = controller.metasurface.to_schmidt_state()
    assert arkhe.entropy_S > 0
    assert len(arkhe.lambdas) == 6

def test_controller_loop():
    controller = NeuroMetasurfaceController(metasurface_size=(4, 4))
    controller.start()
    time.sleep(0.5) # Let it run for a bit
    status = controller.get_system_status()
    controller.stop()

    assert 'attention' in status
    assert 'metasurface' in status
    assert 'arkhe_entropy' in status
    assert len(controller.attention_history) > 0
