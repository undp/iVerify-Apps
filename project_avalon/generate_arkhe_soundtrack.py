import numpy as np
from scipy.io.wavfile import write


def generate_arkhe_soundtrack(duration_sec=60, sample_rate=44100):
    print("🎵 Gerando trilha sonora Arkhé (41.67Hz Base)...")

    t = np.linspace(0, duration_sec, int(sample_rate * duration_sec), endpoint=False)

    # Fundamental frequency (Arkhé)
    f_base = 41.67

    # Binaural components
    f_left = f_base
    f_right = f_base + 7.83  # Schumann Resonance offset

    # Golden Ratio harmonics
    phi = (1 + np.sqrt(5)) / 2
    harmonics = [f_base * (phi**i) for i in range(1, 4)]

    audio_left = np.sin(2 * np.pi * f_left * t)
    audio_right = np.sin(2 * np.pi * f_right * t)

    for h in harmonics:
        audio_left += 0.3 * np.sin(2 * np.pi * h * t)
        audio_right += 0.3 * np.sin(2 * np.pi * h * t)

    # Combine and normalize
    audio = np.vstack((audio_left, audio_right)).T
    audio = audio / np.max(np.abs(audio)) * 0.8

    audio_int16 = (audio * 32767).astype(np.int16)

    filename = "project_avalon/session_data/arkhe_principle.wav"
    write(filename, sample_rate, audio_int16)
    print(f"✅ Trilha sonora salva como: {filename}")


if __name__ == "__main__":
    generate_arkhe_soundtrack(duration_sec=10)
