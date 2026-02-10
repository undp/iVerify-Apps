import unittest
import os
import sys

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from project_avalon.avalon_core import AvalonKalkiSystem


class TestAvalonCore(unittest.TestCase):
    def setUp(self):
        self.system = AvalonKalkiSystem()
        self.system.bootstrap()

    def test_session_start(self):
        # start_session returns report dict
        report = self.system.start_session(duration=2)
        self.assertIn("duration", report)
        self.assertGreater(len(self.system.session_data), 0)

    def test_report_generation(self):
        report = self.system.start_session(duration=2)
        self.assertIn("avg_focus", report)
        # Check if session file was created
        sessions_dir = os.path.join("project_avalon", "sessions")
        files = os.listdir(sessions_dir)
        self.assertGreater(len(files), 0)

    def test_arkhe_protocols(self):
        # Test Sarcophagus
        fragments = self.system.activate_sarcophagus()
        self.assertGreater(len(fragments), 0)

        # Test Jam Session
        self.system.initiate_jam_session()
        # No exception means success


if __name__ == "__main__":
    unittest.main()
