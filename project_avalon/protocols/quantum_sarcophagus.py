# project_avalon/protocols/quantum_sarcophagus.py
import hashlib
import numpy as np
from typing import List, Dict, Any, Optional


class QuantumSarcophagus:
    """
    Implementa o Sarcófago de Informação Quântica: DNA na blockchain.
    v5.0: Inclui Protocolo PoBF (Proof of Biological Fidelity).
    """

    def __init__(self, subject_id: str = "Hal Finney"):
        self.subject_id = subject_id
        self.block_size = 40  # bytes por OP_RETURN
        self.entropy_threshold = 0.85

    def generate_genome_sample(self, length: int = 1000) -> str:
        """Gera uma amostra de genoma simulado com probabilidades biológicas"""
        bases = ["A", "C", "G", "T"]
        # Probabilidades humanas típicas (GC content ~41%)
        return "".join(np.random.choice(bases, length, p=[0.295, 0.205, 0.205, 0.295]))

    def dna_to_hex(self, dna_sequence: str) -> str:
        """Converte sequência de DNA para hexadecimal (2 bits por base)"""
        mapping = {"A": "00", "C": "01", "G": "10", "T": "11"}
        binary = "".join([mapping.get(base, "00") for base in dna_sequence])
        if len(binary) % 8 != 0:
            binary = binary.ljust(len(binary) + (8 - len(binary) % 8), "0")

        hex_val = hex(int(binary, 2))[2:]
        return hex_val.zfill(len(dna_sequence) // 4 * 2)

    def calculate_shannon_entropy(self, sequence: str) -> float:
        """Calcula a entropia de Shannon de uma sequência de DNA"""
        from collections import Counter
        import math

        counts = Counter(sequence)
        total = len(sequence)
        entropy = 0.0

        for count in counts.values():
            p = count / total
            entropy -= p * math.log2(p)

        return entropy

    def calculate_pobf_divergence(self, dna_sequence: str, block_hash: str) -> float:
        """
        Protocolo Proof of Biological Fidelity (PoBF).
        Calcula a Divergência de Kullback-Leibler entre a distribuição do DNA
        e a distribuição do Hash do Bloco.

        D_KL(P_DNA || Q_Hash) = sum( P(x) * log(P(x) / Q(x)) )
        """
        from collections import Counter

        # P: Distribuição do DNA (A, T, C, G)
        dna_counts = Counter(dna_sequence)
        dna_total = len(dna_sequence)
        p_dna = {base: (dna_counts[base] / dna_total) for base in ["A", "C", "G", "T"]}

        # Q: Distribuição do Hash (convertido para base 4 para comparação)
        # 1 char hex = 4 bits = 2 bases DNA
        hash_binary = bin(int(block_hash, 16))[2:].zfill(len(block_hash) * 4)
        hash_bases = []
        mapping = {"00": "A", "01": "C", "10": "G", "11": "T"}
        for i in range(0, len(hash_binary) - 1, 2):
            hash_bases.append(mapping.get(hash_binary[i : i + 2], "A"))

        hash_counts = Counter(hash_bases)
        hash_total = len(hash_bases)
        q_hash = {
            base: (hash_counts.get(base, 0) / hash_total) + 1e-9
            for base in ["A", "C", "G", "T"]
        }

        # Cálculo D_KL
        kl_divergence = 0.0
        for base in ["A", "C", "G", "T"]:
            p = p_dna[base]
            q = q_hash[base]
            if p > 0:
                kl_divergence += p * np.log(p / q)

        return float(kl_divergence)

    def fragment_genome(
        self, genome: str, block_hash: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Fragmenta o genoma e aplica o PoBF se um block_hash for fornecido.
        """
        fragments = []
        bases_per_fragment = 160

        # Se não houver hash, usamos o hash do próprio genoma como referência
        ref_hash = block_hash or hashlib.sha256(genome.encode()).hexdigest()

        for i in range(0, len(genome), bases_per_fragment):
            fragment = genome[i : i + bases_per_fragment]
            hex_data = self.dna_to_hex(fragment)
            hex_data = hex_data[:80].ljust(80, "0")

            entropy = self.calculate_shannon_entropy(fragment)
            kl_div = self.calculate_pobf_divergence(fragment, ref_hash)

            fragments.append(
                {
                    "index": i // bases_per_fragment,
                    "dna": fragment,
                    "hex": hex_data,
                    "entropy": entropy,
                    "kl_divergence": kl_div,
                    "pobf_fidelity": np.exp(-kl_div),  # Fidelidade exp(-D_KL)
                    "checksum": hashlib.sha256(fragment.encode()).hexdigest()[:8],
                    "is_biological": entropy > 1.9,
                }
            )

        return fragments

    def get_genesis_signature(self) -> Dict[str, Any]:
        """Gera a assinatura de gênese para o Sarcófago"""
        return {
            "protocol": "QuantumSarcophagus v5.0 (PoBF Enabled)",
            "subject": self.subject_id,
            "timestamp": str(np.datetime64("now")),
            "motto": "963Hz + Blockchain = Immortality",
            "arkhe_status": "Active",
            "fidelity_index": "Resonance Stable",
        }


if __name__ == "__main__":
    sarc = QuantumSarcophagus()
    genome = sarc.generate_genome_sample(320)
    # Simula um hash de bloco
    fake_hash = hashlib.sha256(b"block_genesis").hexdigest()
    frags = sarc.fragment_genome(genome, block_hash=fake_hash)
    print(f"Genesis: {sarc.get_genesis_signature()}")
    print(f"PoBF Fidelity (Frag 0): {frags[0]['pobf_fidelity']:.4f}")
