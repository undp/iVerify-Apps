"""
🧠 KNN QUANTUM EMOTION ENHANCER - EXPANSÃO PARA ANOMALIAS E RECOMENDAÇÕES

Novas features:
1. Detecção de anomalias emocionais
2. Sistema de recomendação dinâmica
3. Visualização de clusters em tempo real
4. Exportação de insights para dashboard
"""

import numpy as np
import cv2
from collections import deque, defaultdict
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass, field
import pickle
import json
import asyncio
from datetime import datetime, timedelta
from scipy.spatial import distance
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt

# Importar sistema principal
try:
    from .facial_biofeedback_system import QuantumFacialAnalyzer, QuantumFacialBiofeedback
    from .verbal_events_processor import VerbalBioCascade
except (ImportError, ValueError):
    from project_avalon.components.facial_biofeedback_system import QuantumFacialAnalyzer, QuantumFacialBiofeedback
    from project_avalon.components.verbal_events_processor import VerbalBioCascade

# ============================================================================
# ESTRUTURAS DE DADOS KNN
# ============================================================================

@dataclass
class FacialPattern:
    """Padrão facial codificado para KNN."""
    landmarks_vector: np.ndarray  # Vetor de 468*3 = 1404 dimensões
    emotion: str                   # Emoção ground truth
    valence: float                # Valência emocional
    arousal: float                # Arousal emocional
    water_coherence: float        # Coerência da água resultante
    biochemical_impact: float     # Impacto bioquímico total
    timestamp: datetime
    context: Dict[str, Any] = field(default_factory=dict)

    def to_feature_vector(self) -> np.ndarray:
        """Converte para vetor de características."""
        # Concatenar landmarks com métricas emocionais
        features = np.concatenate([
            self.landmarks_vector.flatten(),
            np.array([self.valence, self.arousal])
        ])
        return features

    def to_target_vector(self) -> np.ndarray:
        """Vetor alvo para regressão."""
        return np.array([self.water_coherence, self.biochemical_impact])

@dataclass
class UserEmotionProfile:
    """Perfil emocional único do usuário aprendido pelo KNN."""
    user_id: str
    patterns: List[FacialPattern] = field(default_factory=list)

    # Estatísticas aprendidas
    emotion_clusters: Dict[str, List[np.ndarray]] = field(default_factory=dict)
    transition_matrix: np.ndarray = field(default_factory=lambda: np.zeros((8, 8)))  # 8 emoções
    optimal_emotions: List[str] = field(default_factory=list)

    # Modelos KNN treinados
    knn_classifier: Optional[KNeighborsClassifier] = None
    knn_regressor: Optional[KNeighborsRegressor] = None
    scaler: StandardScaler = field(default_factory=StandardScaler)
    pca: Optional[PCA] = None
    label_encoder: LabelEncoder = field(default_factory=LabelEncoder)

    def add_pattern(self, pattern: FacialPattern):
        """Adiciona novo padrão ao perfil."""
        self.patterns.append(pattern)

        # Atualizar clusters
        if pattern.emotion not in self.emotion_clusters:
            self.emotion_clusters[pattern.emotion] = []
        self.emotion_clusters[pattern.emotion].append(pattern.landmarks_vector)

        print(f"📊 Padrão adicionado: {pattern.emotion} (Total: {len(self.patterns)})")

    def train_knn_models(self, k: int = 5):
        """Treina modelos KNN com padrões coletados."""
        if len(self.patterns) < 10:
            print(f"⚠️  Dados insuficientes para treinamento KNN. Atual: {len(self.patterns)}/10")
            return False

        # Preparar dados de treinamento
        X = np.array([p.to_feature_vector() for p in self.patterns])
        y_emotions = np.array([p.emotion for p in self.patterns])
        y_regression = np.array([p.to_target_vector() for p in self.patterns])

        # Normalizar características
        X_scaled = self.scaler.fit_transform(X)

        # Redução de dimensionalidade opcional
        if X_scaled.shape[1] > 50:
            n_components = min(50, X_scaled.shape[0] - 1)
            self.pca = PCA(n_components=n_components)
            X_scaled = self.pca.fit_transform(X_scaled)
            print(f"🔍 PCA aplicado: {X_scaled.shape[1]} componentes")

        # Codificar labels de emoção
        y_encoded = self.label_encoder.fit_transform(y_emotions)

        # Treinar classificador KNN
        self.knn_classifier = KNeighborsClassifier(
            n_neighbors=min(k, len(X_scaled)),
            weights='distance',
            metric='euclidean'
        )
        self.knn_classifier.fit(X_scaled, y_encoded)

        # Treinar regressor KNN para prever impacto bioquímico
        self.knn_regressor = KNeighborsRegressor(
            n_neighbors=min(k, len(X_scaled)),
            weights='distance',
            metric='euclidean'
        )
        self.knn_regressor.fit(X_scaled, y_regression)

        # Calcular matriz de transição emocional
        self._calculate_transition_matrix()

        # Identificar emoções ótimas (maior coerência da água)
        self._identify_optimal_emotions()

        print(f"✅ Modelos KNN treinados com {len(self.patterns)} padrões")
        return True

    def _calculate_transition_matrix(self):
        """Calcula matriz de transição entre emoções."""
        if len(self.patterns) < 2:
            return

        emotion_to_idx = {emotion: i for i, emotion in enumerate(self.label_encoder.classes_)}

        for i in range(len(self.patterns) - 1):
            curr_emotion = self.patterns[i].emotion
            next_emotion = self.patterns[i + 1].emotion

            curr_idx = emotion_to_idx.get(curr_emotion)
            next_idx = emotion_to_idx.get(next_emotion)

            if curr_idx is not None and next_idx is not None:
                self.transition_matrix[curr_idx, next_idx] += 1

        # Normalizar para probabilidades
        row_sums = self.transition_matrix.sum(axis=1, keepdims=True)
        self.transition_matrix = np.divide(
            self.transition_matrix,
            row_sums,
            where=row_sums != 0
        )

    def _identify_optimal_emotions(self):
        """Identifica emoções que geram maior coerência da água."""
        emotion_impacts = defaultdict(list)

        for pattern in self.patterns:
            emotion_impacts[pattern.emotion].append(pattern.water_coherence)

        # Calcular média de coerência por emoção
        emotion_avg_coherence = {
            emotion: np.mean(coherences)
            for emotion, coherences in emotion_impacts.items()
        }

        # Ordenar por coerência (maior primeiro)
        sorted_emotions = sorted(
            emotion_avg_coherence.items(),
            key=lambda x: x[1],
            reverse=True
        )

        self.optimal_emotions = [emotion for emotion, _ in sorted_emotions[:3]]

    def predict_emotion(self, pattern: FacialPattern) -> Tuple[str, float, Dict[str, float]]:
        """Prediz emoção usando KNN."""
        if self.knn_classifier is None:
            return pattern.emotion, 0.0, {}

        # Preparar características
        X = pattern.to_feature_vector().reshape(1, -1)
        X_scaled = self.scaler.transform(X)

        if self.pca:
            X_scaled = self.pca.transform(X_scaled)

        # Predizer emoção
        y_pred = self.knn_classifier.predict(X_scaled)[0]
        emotion = self.label_encoder.inverse_transform([y_pred])[0]

        # Probabilidades por classe
        probabilities = self.knn_classifier.predict_proba(X_scaled)[0]
        prob_dict = {
            self.label_encoder.inverse_transform([i])[0]: prob
            for i, prob in enumerate(probabilities)
        }

        # Distância aos vizinhos (confiança)
        distances, indices = self.knn_classifier.kneighbors(X_scaled)
        confidence = 1.0 / (1.0 + np.mean(distances))

        return emotion, confidence, prob_dict

    def predict_biochemical_impact(self, pattern: FacialPattern) -> Dict[str, float]:
        """Prediz impacto bioquímico usando KNN de regressão."""
        if self.knn_regressor is None:
            return {
                'predicted_water_coherence': pattern.water_coherence,
                'predicted_biochemical_impact': pattern.biochemical_impact
            }

        X = pattern.to_feature_vector().reshape(1, -1)
        X_scaled = self.scaler.transform(X)

        if self.pca:
            X_scaled = self.pca.transform(X_scaled)

        # Predizer valores
        y_pred = self.knn_regressor.predict(X_scaled)[0]

        return {
            'predicted_water_coherence': float(y_pred[0]),
            'predicted_biochemical_impact': float(y_pred[1])
        }

    def visualize_emotion_clusters(self, save_path: Optional[str] = None):
        """Visualiza clusters de emoções aprendidos."""
        if len(self.patterns) < 5:
            print("⚠️  Dados insuficientes para visualização de clusters")
            return

        # Extrair características
        X = np.array([p.to_feature_vector() for p in self.patterns])
        emotions = [p.emotion for p in self.patterns]

        # Aplicar PCA para 2D
        pca_vis = PCA(n_components=2)
        X_2d = pca_vis.fit_transform(self.scaler.transform(X))

        # Cores para emoções
        emotion_colors = {
            'happy': 'green', 'sad': 'blue', 'angry': 'red',
            'fear': 'purple', 'surprise': 'orange', 'disgust': 'brown',
            'contempt': 'pink', 'neutral': 'gray'
        }

        fig, axes = plt.subplots(1, 2, figsize=(15, 6))

        # Gráfico 1: Clusters de emoções
        ax1 = axes[0]
        for emotion in set(emotions):
            idx = [i for i, e in enumerate(emotions) if e == emotion]
            if idx:
                color = emotion_colors.get(emotion, 'black')
                ax1.scatter(X_2d[idx, 0], X_2d[idx, 1],
                          c=color, label=emotion, alpha=0.6, s=50)

        ax1.set_xlabel('Componente Principal 1')
        ax1.set_ylabel('Componente Principal 2')
        ax1.set_title('Clusters de Emoções Aprendidos')
        ax1.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
        ax1.grid(True, alpha=0.3)

        # Gráfico 2: Coerência da água por emoção
        ax2 = axes[1]
        emotion_coherence = defaultdict(list)

        for pattern in self.patterns:
            emotion_coherence[pattern.emotion].append(pattern.water_coherence * 100)

        emotions_sorted = sorted(
            emotion_coherence.keys(),
            key=lambda e: np.mean(emotion_coherence[e]),
            reverse=True
        )

        colors = [emotion_colors.get(e, 'gray') for e in emotions_sorted]
        means = [np.mean(emotion_coherence[e]) for e in emotions_sorted]

        x_pos = np.arange(len(emotions_sorted))
        ax2.bar(x_pos, means, color=colors, alpha=0.7)
        ax2.set_xlabel('Emoção')
        ax2.set_ylabel('Coerência da Água (%)')
        ax2.set_title('Impacto das Emoções na Água Celular')
        ax2.set_xticks(x_pos)
        ax2.set_xticklabels(emotions_sorted, rotation=45, ha='right')
        ax2.grid(True, alpha=0.3, axis='y')

        plt.tight_layout()

        if save_path:
            plt.savefig(save_path, dpi=150, bbox_inches='tight')
            print(f"📊 Visualização salva em: {save_path}")

        return fig

class KNNEnhancedFacialAnalyzer(QuantumFacialAnalyzer):
    """
    Analisador facial aprimorado com KNN.
    """
    def __init__(self, user_id: str = "default_user", knn_k: int = 7):
        super().__init__()
        self.user_profile = UserEmotionProfile(user_id=user_id)
        self.knn_k = knn_k
        self.recent_patterns = deque(maxlen=100)

    def analyze_frame_with_knn(self, frame: np.ndarray) -> Dict[str, Any]:
        """Analisa frame com predição KNN aprimorada."""
        analysis = super().analyze_frame(frame)
        if not analysis['face_detected']:
            return analysis

        # Criar padrão facial atual
        current_pattern = self._create_facial_pattern(analysis)

        if self.user_profile.knn_classifier is not None:
            knn_emotion, confidence, probabilities = self.user_profile.predict_emotion(current_pattern)
            analysis['knn_emotion'] = knn_emotion
            analysis['knn_confidence'] = confidence
            analysis['knn_probabilities'] = probabilities

            if confidence > 0.7:
                analysis['emotion'] = knn_emotion
                analysis['emotion_confidence'] = confidence

        self.recent_patterns.append(current_pattern)
        return analysis

    def _create_facial_pattern(self, analysis: Dict) -> FacialPattern:
        """Cria padrão facial a partir da análise."""
        landmarks_list = []
        for landmark in analysis['landmarks'].landmark:
            landmarks_list.extend([landmark.x, landmark.y, landmark.z])
        landmarks_vector = np.array(landmarks_list)

        water_coherence = 0.5
        biochemical_impact = 50.0
        if self.last_processed_state:
            water_coherence = self.last_processed_state.verbal_state.water_coherence
            biochemical_impact = self.last_processed_state.calculate_total_impact()

        return FacialPattern(
            landmarks_vector=landmarks_vector,
            emotion=analysis['emotion'],
            valence=analysis['valence'],
            arousal=analysis['arousal'],
            water_coherence=water_coherence,
            biochemical_impact=biochemical_impact,
            timestamp=analysis['timestamp']
        )

class KNNEnhancedFacialBiofeedback(QuantumFacialBiofeedback):
    def __init__(self, camera_id: int = 0, user_id: str = "default_user"):
        self.analyzer = KNNEnhancedFacialAnalyzer(user_id=user_id)
        super().__init__(camera_id)
