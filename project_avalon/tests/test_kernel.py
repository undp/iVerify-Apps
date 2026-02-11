import unittest
import os
import sys
# Add parent directory to path to allow imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from project_avalon.avalon_kernel import AvalonKernel

class TestAvalonKernel(unittest.TestCase):
    def setUp(self):
        self.kernel = AvalonKernel()

    def test_session_start(self):
        self.kernel.start_session(duration=2)
        self.assertEqual(len(self.kernel.session_timestamps), 2)
        self.assertEqual(len(self.kernel.coherence_history), 2)

    def test_export_report(self):
        self.kernel.start_session(duration=2)
        try:
            filename = self.kernel.export_session_report(format='json')
            self.assertTrue(os.path.exists(filename))
            os.remove(filename) # Cleanup
        except ImportError:
            self.skipTest("Pandas not installed")

if __name__ == "__main__":
    unittest.main()
