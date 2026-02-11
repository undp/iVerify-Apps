import asyncio
import numpy as np
from project_avalon.core.celestial_helix import CelestialDNA, CelestialBody
from project_avalon.core.celestial_entanglement import CelestialEntanglement
from project_avalon.components.double_exceptionality_detector import DoubleExceptionalityDetector

def test_celestial_and_2e_sync():
    asyncio.run(_test_celestial_and_2e())

async def _test_celestial_and_2e():
    print("Testing Celestial DNA Helix...")
    dna = CelestialDNA()
    params = dna.calculate_dna_twist_parameters()
    assert params['turns_per_galactic_orbit'] > 0
    print(f"  OK (Turns: {params['turns_per_galactic_orbit']:.2f})")

    print("Testing Celestial Entanglement...")
    ent = CelestialEntanglement(dna)
    matrix = ent.calculate_entanglement_matrix()
    assert matrix.shape == (9, 9)
    assert np.allclose(np.diag(matrix), 1.0)
    print("  OK")

    print("Testing Double Exceptionality Detector...")
    detector = DoubleExceptionalityDetector(user_id="test_subject")
    detector.add_sample("The epistemological structure of the universe is inherently complex.")
    detector.add_sample("Poderia-se assumir que alguém está aqui, no entanto percebe-se a amnésia.")
    report = detector.analyze()
    assert report['double_exceptionality_score'] >= 0
    print(f"  OK (Score: {report['double_exceptionality_score']:.3f})")

if __name__ == "__main__":
    asyncio.run(_test_celestial_and_2e())
