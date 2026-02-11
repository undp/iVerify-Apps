import pytest
import numpy as np
from project_avalon.core.bio_arkhe import BioAgent, ArkheGenome, MorphogeneticField
from project_avalon.core.particle_system import BioParticleEngine

def test_bio_agent_sensing_and_action():
    field = MorphogeneticField(size=(20, 20, 20))
    # Injeta sinal em [11, 10, 10] para que a diferença finita em 10 capture
    field.signal_grid[11, 10, 10] = 50.0

    genome = ArkheGenome(C=0.5, I=0.5, E=1.0, F=1.0)
    # Agente em [10, 10, 10]
    agent = BioAgent(1, np.array([10.0, 10.0, 10.0]), genome)

    # Percepção
    data = agent.sense_environment(field)
    assert data['gradient'][0] > 0 # Deve sentir atração para +x

    # Decisão
    action = agent.decide_action(data, {1: agent})
    assert action[0] > 0

    # Update
    agent.update_state(action, 0.1)
    assert agent.position[0] > 10.0

def test_particle_engine_lifecycle():
    engine = BioParticleEngine(num_agents=20)
    initial_health = [a.health for a in engine.agents.values()]

    # Update
    engine.update(0.1)

    # Posições devem ter mudado
    for i, agent in engine.agents.items():
        assert agent.age > 0

    positions, energies, _ = engine.get_render_data()
    assert len(positions) == 20
    assert len(energies) == 20

def test_morphogenetic_diffusion():
    field = MorphogeneticField(size=(10, 10, 10))
    field.signal_grid[5, 5, 5] = 10.0

    # Antes da difusão
    assert field.signal_grid[5, 5, 5] == 10.0
    assert field.signal_grid[4, 5, 5] == 0.0

    field._diffuse_signal()

    # Depois da difusão, o pico deve ter diminuído e vizinhos aumentado
    assert field.signal_grid[5, 5, 5] < 10.0
    assert field.signal_grid[4, 5, 5] > 0.0
