import pytest
import numpy as np
from project_avalon.core.unified_particle_system import UnifiedParticleSystem
from project_avalon.gui.view_3d import ConsciousnessVisualizer3D
from dataclasses import dataclass

@dataclass
class MockEEG:
    attention: float
    meditation: float
    coherence: float

def test_unified_system_modes():
    ps = UnifiedParticleSystem(num_particles=50)

    # Modo MANDALA (Top-Down)
    ps.set_mode("MANDALA")
    ps.update(0.1)
    data = ps.get_particle_data()
    assert data['mode'] == "MANDALA"

    # Modo BIOGENESIS (Bottom-Up)
    ps.set_mode("BIOGENESIS")
    ps.update(0.1)
    assert ps.target_mode == "BIOGENESIS"

def test_visualizer_integration():
    viz = ConsciousnessVisualizer3D(num_particles=50)

    # Trigger BIOGENESIS
    eeg = MockEEG(attention=50, meditation=50, coherence=0.9)
    viz.update_from_eeg(eeg)
    assert viz.particle_system.target_mode == "BIOGENESIS"

    # Interaction
    viz.handle_interaction(0, 0, 0) # Injeta sinal no centro [50, 50, 50]

    # Render frame (necessário para atualizar o grid a partir dos sinais injetados)
    frame = viz.render_frame(0.016)

    assert viz.particle_system.engine.field.signal_grid[50, 50, 50] > 0
    assert 'positions' in frame
    assert 'colors' in frame
    assert 'mode' in frame
