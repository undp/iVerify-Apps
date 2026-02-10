# project_avalon/examples/test_ricci_flow.py
import sys
import os

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from project_avalon.components.audio_synthesizer import generate_healing_sound


def test_ricci_flow():
    print("🌊 Testing Ricci Flow Audio Synthesis Engine...")
    # This will generate a wav file
    try:
        generate_healing_sound(duration_sec=2)
        print(
            "✅ Ricci Flow Audio synthesis complete. check avalon_ricci_flow_healing.wav"
        )
    except Exception as e:
        print(f"❌ Ricci Flow synthesis failed: {e}")


if __name__ == "__main__":
    test_ricci_flow()
