import re
from typing import Dict, List, Any

class AbstractedAgencyDetector:
    """
    Detecta o 'Ruptura Epistemológica' através da mudança de voz ativa para passiva/teórica.
    """
    def __init__(self):
        # Using word boundaries where appropriate, handling hyphens
        self.active_patterns = [r"\b(eu|nós)\b", r"\b(fiz|fui|pensei|estava)\b"]
        self.passive_patterns = [r"(poderia-se|assumiria-se|percebe-se)", r"\b(um|alguém|provavelmente|teoricamente|possivelmente)\b"]

    def analyze(self, text: str) -> Dict[str, float]:
        text_lower = text.lower()
        active_hits = sum(len(re.findall(p, text_lower)) for p in self.active_patterns)
        passive_hits = sum(len(re.findall(p, text_lower)) for p in self.passive_patterns)

        total = active_hits + passive_hits
        if total == 0:
            return {"agency_score": 1.0, "theoretical_drift": 0.0}

        theoretical_drift = passive_hits / total
        agency_score = active_hits / total

        return {
            "agency_score": agency_score,
            "theoretical_drift": theoretical_drift,
            "is_rupture": theoretical_drift > 0.6
        }

class RecursiveRationalizationMonitor:
    """
    Monitora padrões de racionalização recursiva típicos de sistemas 2e DID.
    """
    def __init__(self):
        self.complexity_markers = [r"\b(devido ao fato|consequentemente|no entanto|além disso|visto que)\b"]

    def analyze(self, text: str) -> Dict[str, Any]:
        text_lower = text.lower()
        markers_found = sum(len(re.findall(p, text_lower)) for p in self.complexity_markers)
        words = text.split()
        avg_word_length = sum(len(w) for w in words) / len(words) if words else 0

        return {
            "rationalization_index": markers_found / (len(words) / 10 + 1),
            "lexical_density": avg_word_length,
            "is_masking": markers_found > 3 and avg_word_length > 6
        }
