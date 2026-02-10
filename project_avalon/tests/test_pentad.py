import unittest
import os
import sys
import numpy as np

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from project_avalon.avalon_core import AvalonKalkiSystem


class TestAvalonPentad(unittest.TestCase):
    def setUp(self):
        self.system = AvalonKalkiSystem()
        self.system.bootstrap()

    def test_session_v5(self):
        report = self.system.start_session(duration=2)
        self.assertIn("avg_focus", report)

    def test_pobf_protocol(self):
        # Test KL Divergence and Fidelity
        dna = "ATCG" * 20
        # Hash ideal que combine com a distribuição uniforme de ATCG
        ideal_hash = "0123456789abcdef" * 4
        frags = self.system.sarcophagus.fragment_genome(dna, block_hash=ideal_hash)
        self.assertGreater(frags[0]["pobf_fidelity"], 0)
        self.assertIn("kl_divergence", frags[0])

    def test_echo_receiver(self):
        echo = self.system.scan_future_echoes()
        self.assertEqual(echo["timestamp_future"], 12024)
        self.assertTrue(len(echo["echo_block_id"]) > 0)

    def test_quaternary_viz_init(self):
        # Check if visualizer is initialized (even if simulated)
        self.assertTrue(self.system.modules["visual"] is not None)
        # Seed check (v14.0 Cognitive Engine uses Pentad multiplier 240240)
        self.assertEqual(self.system.modules["visual"].seed, 240240)


if __name__ == "__main__":
    unittest.main()
