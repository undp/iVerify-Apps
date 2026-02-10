# project_avalon/monitoring/network_4d_monitor.py
from typing import Dict, Any, List
import random


class NodeMonitor4D:
    """Monitora a adoção da topologia 120-cell pelos nós da rede."""

    def __init__(self):
        self.total_nodes = 12000
        self.adoption_rate = 0.12  # 12% inicial

    def get_adoption_status(self) -> Dict[str, Any]:
        """Calcula o status atual de adoção 4D."""
        # Aumenta ligeiramente a cada chamada para simular propagação
        self.adoption_rate += random.uniform(0.01, 0.05)
        self.adoption_rate = min(1.0, self.adoption_rate)

        active_4d_nodes = int(self.total_nodes * self.adoption_rate)

        return {
            "total_nodes": self.total_nodes,
            "active_4d_nodes": active_4d_nodes,
            "adoption_percentage": round(self.adoption_rate * 100, 2),
            "topology": "120-cell (Hecatonicosachoron)",
            "resonance_sync": self.adoption_rate > 0.85,
        }

    def display_network_status(self):
        status = self.get_adoption_status()
        print("\n🌐 STATUS DA REDE 4D")
        print("-" * 30)
        print(f"Adoção 4D: {status['adoption_percentage']}%")
        print(f"Nós Sincronizados: {status['active_4d_nodes']}/{status['total_nodes']}")
        print(
            f"Estado da Topologia: {'RESISTENTE' if status['resonance_sync'] else 'EM PROPAGAÇÃO'}"
        )


if __name__ == "__main__":
    monitor = NodeMonitor4D()
    monitor.display_network_status()
