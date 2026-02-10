import numpy as np
from scipy.linalg import eigh
from scipy.io.wavfile import write
from scipy.ndimage import gaussian_filter


def generate_healing_sound(duration_sec=20, sample_rate=44100):
    print("Initializing Quantum Audio Synthesis...")

    # 1. Configuração do Espaço (Manifold)
    N_space = 100
    x = np.linspace(-5, 5, N_space)
    dx = x[1] - x[0]

    # 2. Configuração do Tempo (Audio Frames)
    frame_rate = 10  # fps de atualização da física
    samples_per_frame = sample_rate // frame_rate
    num_frames = duration_sec * frame_rate

    audio_buffer = []

    # 3. Definir os Estados (Doente -> Saudável)
    V_sick = 0.5 * 0.1 * x**2 - 10 * np.exp(-((x - 1) ** 2) / 0.5)
    V_current = V_sick.copy()

    print("Processing Ricci Flow Evolution...")

    for frame in range(num_frames):
        H = np.zeros((N_space, N_space))
        off_diag = -0.5 / dx**2 * np.ones(N_space - 1)
        diag_kin = 1.0 / dx**2 * np.ones(N_space)
        diag_pot = V_current

        np.fill_diagonal(H, diag_kin + diag_pot)
        np.fill_diagonal(H[1:], off_diag)
        np.fill_diagonal(H[:, 1:], off_diag)

        evals, _ = eigh(H, subset_by_index=[0, 5])

        base_freq = 200  # Hz
        freqs = base_freq + (evals - evals[0]) * 150

        t = np.linspace(0, 1 / frame_rate, samples_per_frame, endpoint=False)
        frame_audio = np.zeros(samples_per_frame)

        envelope = np.ones_like(t)
        envelope[:100] = np.linspace(0, 1, 100)
        envelope[-100:] = np.linspace(1, 0, 100)

        for i, f in enumerate(freqs):
            amp = 1.0 / (i + 1)
            wave = amp * np.sin(2 * np.pi * f * t)
            frame_audio += wave

        frame_audio = frame_audio / np.max(np.abs(frame_audio)) * 0.5
        frame_audio *= envelope

        audio_buffer.append(frame_audio)

        if frame > 50:
            V_current = gaussian_filter(V_current, sigma=0.5)
            V_ideal = 0.5 * 0.5 * x**2
            V_current = V_current * 0.98 + V_ideal * 0.02

        if frame % 50 == 0:
            print(f"  -> Rendering Time: {frame/frame_rate:.1f}s")

    full_audio = np.concatenate(audio_buffer)
    full_audio_int16 = np.int16(full_audio * 32767)

    filename = "avalon_ricci_flow_healing.wav"
    write(filename, sample_rate, full_audio_int16)
    print(f"\nDONE. Audio file saved as: {filename}")


if __name__ == "__main__":
    generate_healing_sound(duration_sec=5)  # Reduced for quick test
