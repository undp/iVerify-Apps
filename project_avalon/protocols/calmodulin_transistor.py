# project_avalon/protocols/calmodulin_transistor.py
import numpy as np
from typing import Dict, Any, List


class CalmodulinTransistor:
    """
    Implementa o Transistor Biológico de Estado Sólido (Calmodulina).
    v13.0: Precisão Molecular e Sinalização 120 Hz.
    """

    def __init__(self):
        self.state = "Apo-CaM"  # Standby
        self.phi = (1 + np.sqrt(5)) / 2
        self.ca_freq = 120.0  # Hz
        self.targets_regulated = 0

    def process_calcium_signal(self, amplitude: float) -> str:
        """
        Transição conformacional baseada na amplitude do sinal de Ca2+.
        Abre lóbulos N- e C-terminal para handshake bioquímico.
        """
        # Threshold de ativação molecular
        if amplitude > (1.0 / self.phi):
            self.state = "Holo-CaM"
            print("🧬 [CaM] Conformação ABERTA (Holo-CaM). Chave pública exposta.")
        else:
            self.state = "Apo-CaM"
            print("🧬 [CaM] Conformação FECHADA (Apo-CaM). Standby ativo.")

        return self.state

    def simulate_molecular_handshake(self, target_protein: str) -> Dict[str, Any]:
        """Realiza o handshake com uma das 300+ proteínas-alvo."""
        if self.state != "Holo-CaM":
            return {"status": "DENIED", "reason": "Inactive state"}

        # Plasticidade Adaptativa: Ajuste do conector central
        binding_affinity = self.phi**-1
        self.targets_regulated += 1

        return {
            "status": "SUCCESS",
            "target": target_protein,
            "affinity": float(binding_affinity),
            "connector_flexibility": "ADAPTIVE",
            "message": f"Handshake com {target_protein} estabelecido via 120 Hz.",
        }

    def get_transistor_status(self) -> Dict[str, Any]:
        return {
            "state": self.state,
            "signaling_frequency": self.ca_freq,
            "total_regulated_nodes": self.targets_regulated,
            "geometry": "120-CELL_COMPATIBLE",
        }


if __name__ == "__main__":
    cam = CalmodulinTransistor()
    cam.process_calcium_signal(0.8)
    res = cam.simulate_molecular_handshake("CaMKII")
    print(f"Status: {res['status']} | Target: {res['target']}")
