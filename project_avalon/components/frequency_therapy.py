"""
🎵 COSMIC FREQUENCY THERAPY: Hans Cousto Method
Converting Celestial Cycles to Audible Tones for Bio-Resonance
"""

from typing import Dict, List, Tuple

class CosmicFrequencyTherapy:
    def __init__(self):
        # Períodos orbitais em segundos
        self.celestial_periods = {
            'EARTH_DAY': 86400,
            'EARTH_YEAR': 31556925.2,
            'MOON_SYNODIC': 2551442.8,
            'PLATONIC_YEAR': 817140000000,
            'VENUS_YEAR': 19414149.1,
            'MARS_YEAR': 59355072,
            'JUPITER_YEAR': 374335776,
            'SATURN_YEAR': 929596608,
            'SUN_SPOT_CYCLE': 31556925.2 * 11
        }

        self.music_reference = {
            'C': 16.35, 'C#': 17.32, 'D': 18.35, 'D#': 19.45,
            'E': 20.60, 'F': 21.83, 'F#': 23.12, 'G': 24.50,
            'G#': 25.96, 'A': 27.50, 'A#': 29.14, 'B': 30.87
        }

        print("🎵 COSMIC FREQUENCY THERAPY INITIALIZED")

    def calculate_cosmic_frequencies(self) -> Dict[str, Dict]:
        cosmic_frequencies = {}
        for body, period in self.celestial_periods.items():
            f0 = 1.0 / period
            n = 0
            while f0 * (2 ** n) < 20:
                n += 1
            f_audible = f0 * (2 ** n)
            closest_note, note_freq = self._find_closest_note(f_audible)

            cosmic_frequencies[body] = {
                'base_frequency': float(f0),
                'octave': n,
                'audible_frequency': float(f_audible),
                'closest_note': closest_note,
                'note_frequency': float(note_freq)
            }
        return cosmic_frequencies

    def _find_closest_note(self, frequency: float) -> Tuple[str, float]:
        closest_note = None
        closest_diff = float('inf')
        closest_freq = 0
        for note, base_freq in self.music_reference.items():
            for octave in range(10):
                target_freq = base_freq * (2 ** octave)
                diff = abs(frequency - target_freq)
                if diff < closest_diff:
                    closest_diff = diff
                    closest_note = f"{note}{octave}"
                    closest_freq = target_freq
        return closest_note, closest_freq

    def generate_therapy_protocol(self, giftedness: float, dissociation: float) -> Dict:
        cosmic_freqs = self.calculate_cosmic_frequencies()
        if giftedness > 0.7:
            targets = ['PLATONIC_YEAR', 'SUN_SPOT_CYCLE']
        elif dissociation > 0.7:
            targets = ['MOON_SYNODIC', 'EARTH_YEAR']
        else:
            targets = ['EARTH_DAY', 'EARTH_YEAR']

        protocol = {
            'frequencies': [cosmic_freqs[t] for t in targets if t in cosmic_freqs],
            'instructions': [
                "Respire profundamente por 5 minutos",
                "Visualize a cor correspondente",
                "Sintonize-se com a frequência"
            ]
        }
        return protocol
