"""
🧠 DETECTOR DE DUPLA EXCEPCIONALIDADE (2e) - SUPERDOTAÇÃO + TDI
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional, Any, Set
from dataclasses import dataclass, field
from collections import defaultdict, Counter
import re
import os

import nltk
from nltk import pos_tag, word_tokenize, sent_tokenize

# Required NLTK resources
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
try:
    nltk.data.find('taggers/averaged_perceptron_tagger')
except LookupError:
    nltk.download('averaged_perceptron_tagger')
import textstat
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import DBSCAN
from sklearn.metrics import silhouette_score
from scipy import stats

# ============================================================================
# CONSTANTES
# ============================================================================

class LinguisticConstants:
    FUNCTION_WORDS = {
        'pronouns': ['I', 'me', 'my', 'mine', 'myself', 'you', 'your', 'he', 'him', 'she', 'her', 'we', 'us', 'they', 'them', 'it'],
        'articles': ['a', 'an', 'the'],
        'prepositions': ['in', 'on', 'at', 'by', 'with', 'about', 'between', 'into', 'through'],
        'conjunctions': ['and', 'but', 'or', 'nor', 'for', 'yet', 'so', 'because', 'although'],
        'auxiliary_verbs': ['am', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'can', 'could', 'will', 'would']
    }
    TRAUMA_MARKERS = {
        'dissociative_words': ['numb', 'float', 'detach', 'unreal', 'dream', 'fog', 'blank', 'disconnect', 'void', 'fragmented'],
        'hypervigilance_words': ['watch', 'alert', 'danger', 'safe', 'threat', 'careful', 'scan', 'protect'],
        'affect_words': ['empty', 'numb', 'flat', 'distant', 'robotic'],
        'body_words': ['disembodied', 'float', 'detach', 'numb', 'tingle']
    }
    GIFTED_MARKERS = {
        'cognitive_words': ['analyze', 'synthesize', 'theorize', 'conceptualize', 'abstract', 'metacognition', 'complex'],
        'curiosity_words': ['why', 'how', 'what if', 'explore', 'discover', 'investigate', 'question', 'hypothesize'],
        'perfectionism_words': ['perfect', 'flawless', 'exact', 'precise', 'meticulous', 'thorough'],
        'intensity_words': ['passionate', 'absorbed', 'immersed', 'focused', 'intense', 'deep', 'profound']
    }

@dataclass
class DigitalTextSample:
    text: str
    timestamp: datetime
    source: str
    metadata: Dict[str, Any] = field(default_factory=dict)

    def __post_init__(self):
        self.tokens = word_tokenize(self.text.lower())
        self.sentences = sent_tokenize(self.text)
        self.pos_tags = pos_tag(word_tokenize(self.text))

class LinguisticAnalyzer2e:
    @staticmethod
    def extract_features(sample: DigitalTextSample) -> Dict[str, float]:
        text = sample.text
        tokens = sample.tokens
        pos_tags = sample.pos_tags
        sentences = sample.sentences

        features = {
            'word_count': len(tokens),
            'avg_sentence_length': len(tokens) / len(sentences) if sentences else 0,
            'avg_word_length': np.mean([len(w) for w in tokens]) if tokens else 0,
            'flesch_kincaid_grade': textstat.flesch_kincaid_grade(text)
        }

        # TTR
        types = set(tokens)
        features['ttr'] = len(types) / len(tokens) if tokens else 0

        # POS ratios
        pos_counts = Counter([tag for _, tag in pos_tags])
        total_pos = sum(pos_counts.values())
        if total_pos > 0:
            for p in ['NN', 'VB', 'JJ', 'PRP']:
                features[f'pos_{p}_ratio'] = pos_counts.get(p, 0) / total_pos

        # Pronoun shifts
        first_p = len(re.findall(r'\b(I|me|my|mine|myself)\b', text, re.I))
        third_p = len(re.findall(r'\b(he|him|his|she|her|hers|it|its)\b', text, re.I))
        features['pronoun_shift_entropy'] = stats.entropy([first_p, third_p]) if (first_p + third_p) > 0 else 0

        # Markers
        text_lower = text.lower()
        features['gifted_marker_density'] = sum(1 for cat in LinguisticConstants.GIFTED_MARKERS.values() for m in cat if m in text_lower) / max(len(tokens), 1)
        features['dissociation_marker_density'] = sum(1 for cat in LinguisticConstants.TRAUMA_MARKERS.values() for m in cat if m in text_lower) / max(len(tokens), 1)

        return features

    @staticmethod
    def detect_style_clusters(samples: List[DigitalTextSample]):
        if len(samples) < 3: return {"clusters_detected": 1, "confidence": 0.0}

        data = [LinguisticAnalyzer2e.extract_features(s) for s in samples]
        df = pd.DataFrame(data).select_dtypes(include=[np.number]).fillna(0)

        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(df)

        try:
            clustering = DBSCAN(eps=0.5, min_samples=2).fit(X_scaled)
            n_clusters = len(set(clustering.labels_)) - (1 if -1 in clustering.labels_ else 0)
            return {"clusters_detected": max(1, n_clusters), "confidence": 0.5 if n_clusters > 1 else 0.0}
        except:
            return {"clusters_detected": 1, "confidence": 0.0}

class DoubleExceptionalityDetector:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.samples = []

    def add_sample(self, text: str, source: str = "digital"):
        sample = DigitalTextSample(text, datetime.now(), source)
        self.samples.append(sample)

    def analyze(self) -> Dict[str, Any]:
        if not self.samples: return {"error": "no data"}

        features_list = [LinguisticAnalyzer2e.extract_features(s) for s in self.samples]
        df = pd.DataFrame(features_list)

        gifted_score = df['gifted_marker_density'].mean() * 10 + (df['ttr'].mean() * 0.5)
        dissoc_score = df['dissociation_marker_density'].mean() * 10 + (df['pronoun_shift_entropy'].mean() * 0.5)

        clusters = LinguisticAnalyzer2e.detect_style_clusters(self.samples)
        if clusters['clusters_detected'] > 1:
            dissoc_score += 0.3

        final_score = (gifted_score * 0.5) + (dissoc_score * 0.5)

        return {
            "user_id": self.user_id,
            "double_exceptionality_score": float(np.clip(final_score, 0, 1)),
            "giftedness_evidence": float(gifted_score),
            "dissociation_evidence": float(dissoc_score),
            "style_clusters": clusters['clusters_detected'],
            "risk_level": "High" if final_score > 0.7 else "Moderate" if final_score > 0.4 else "Low"
        }
