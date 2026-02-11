import sys
import os
# Add parent directory to path to allow imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from project_avalon.components.audio_synthesizer import generate_healing_sound

def test_ricci_flow():
    print("🌊 Testing Ricci Flow Audio Synthesis...")
    # This will generate a wav file in the current directory
    generate_healing_sound(duration_sec=3)
    print("✅ Ricci Flow Audio synthesis complete. Check avalon_ricci_flow_healing.wav")

if __name__ == "__main__":
    test_ricci_flow()
