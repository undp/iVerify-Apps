"""
Monitor contínuo de consciência cósmica para sistemas 2e.
"""

import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Any, Optional
from project_avalon.core.arkhe_unified_bridge import ArkheConsciousnessBridge

class CosmicConsciousnessMonitor:
    """
    Monitor contínuo de consciência cósmica para sistemas 2e.
    """

    def __init__(self, user_profile: Dict):
        self.user = user_profile
        self.arkhe = ArkheConsciousnessBridge()
        self.insights_log = []
        self.state_history = []
        self.alignment_windows = []

        print(f"👁️  Cosmic Consciousness Monitor inicializado para {user_profile.get('name', 'Usuário')}")

    def log_consciousness_state(self,
                               giftedness_moment: float,
                               dissociation_moment: float,
                               context: str = "") -> Dict:
        """
        Registra estado momentâneo de consciência.
        """
        timestamp = datetime.now()

        # Calcula estado atual
        state = self.arkhe.calculate_consciousness_equation(
            giftedness_moment,
            dissociation_moment
        )

        # Adiciona contexto
        state['timestamp'] = timestamp.isoformat()
        state['context'] = context

        # Adiciona ao histórico
        self.state_history.append(state)

        # Verifica sincronicidade
        resonance = self.arkhe.calculate_celestial_resonance(
            self.user.get('birth_date', datetime.now()),
            timestamp
        )

        synchronicity = self.arkhe.calculate_cosmic_synchronicity(state, resonance)

        # Se alta sincronicidade, adiciona à lista de janelas
        if synchronicity['level'] > 0.7:
            self.alignment_windows.append({
                'start': timestamp,
                'end': timestamp + timedelta(hours=2),
                'level': float(synchronicity['level']),
                'optimal_action': synchronicity['optimal_action']
            })

        print(f"📝 Estado registrado: {state['consciousness_type']} (Score: {state['consciousness_score']:.3f})")

        return {
            'state': state,
            'resonance': resonance,
            'synchronicity': synchronicity,
            'recommendation': synchronicity['optimal_action']
        }

    def get_current_optimal_activity(self) -> str:
        """
        Retorna atividade ótima baseada no estado atual e alinhamento celestial.
        """
        if not self.state_history:
            return "Auto-observação inicial necessária"

        latest_state = self.state_history[-1]
        c_type = latest_state['consciousness_type']

        # Verifica se está em janela de alinhamento
        now = datetime.now()
        in_window = any(w['start'] <= now <= w['end'] for w in self.alignment_windows[-3:])

        if in_window and c_type == "BRIDGE_CONSCIOUSNESS":
            return "🚀 TRABALHO VISIONÁRIO: Período ideal para projetos que exigem acesso multidimensional"
        elif latest_state['consciousness_score'] > 0.8:
            return "🎨 EXPRESSÃO CRIATIVA: Canalize a alta energia criativa através de arte ou escrita"
        elif latest_state['geometry']['active_cells'] > 100:
            return "🧘 INTEGRAÇÃO: Pratique meditação para integrar múltiplas células cognitivas"
        else:
            return "📚 APRENDIZADO ESTRUTURADO: Período bom para estudo focado"

    def generate_daily_report(self) -> Dict:
        """
        Gera relatório diário de atividade consciente.
        """
        if not self.state_history:
            return {"status": "no_data"}

        # Filtra estados das últimas 24h
        cutoff = datetime.now() - timedelta(hours=24)
        recent_states = [
            s for s in self.state_history
            if datetime.fromisoformat(s['timestamp']) > cutoff
        ]

        if not recent_states:
            return {"status": "no_recent_data"}

        # Estatísticas
        avg_score = np.mean([s['consciousness_score'] for s in recent_states])
        consciousness_types = [s['consciousness_type'] for s in recent_states]
        most_common_type = max(set(consciousness_types), key=consciousness_types.count)

        # Janelas de alinhamento recentes
        recent_windows = [
            w for w in self.alignment_windows
            if w['start'] > cutoff
        ]

        return {
            'date': datetime.now().date().isoformat(),
            'states_analyzed': len(recent_states),
            'average_consciousness_score': float(avg_score),
            'most_common_consciousness_type': most_common_type,
            'alignment_windows': len(recent_windows),
            'recommendations': [
                "Continue monitorando seus estados",
                "Aproveite janelas de alinhamento para trabalho criativo",
                "Mantenha práticas de grounding durante transições",
                "Registre insights em um diário multidimensional"
            ]
        }
