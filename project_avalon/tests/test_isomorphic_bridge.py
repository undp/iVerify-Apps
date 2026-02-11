import asyncio
import pytest
from project_avalon.components.arkhe_isomorphic_bridge import ArkheIsomorphicLab

def test_isomorphic_lab_session_sync():
    asyncio.run(_test_isomorphic_lab_session())

async def _test_isomorphic_lab_session():
    lab = ArkheIsomorphicLab(user_id="bridge_tester")

    # Session 1: Meditative Peace
    results = await lab.consciousness_molecule_design_session(
        target_experience="meditative_peace",
        verbal_intention="Minha mente torna-se cristalina e em paz."
    )

    assert 'molecule' in results
    assert 'administration' in results
    assert 'report' in results
    assert results['molecule'].binding_affinity > 5.0

    print("Isomorphic Lab Session Test Passed.")
    print(results['report'])

if __name__ == "__main__":
    asyncio.run(_test_isomorphic_lab_session())
