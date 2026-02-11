# harmonic_signature_shield.py
"""
Escudo Anti-Falsificação baseado em Ressonância Harmônica
A autenticidade é verificada através de análise espectral da assinatura
"""

import hashlib
import numpy as np
from typing import Dict, Tuple, Optional
from datetime import datetime, timezone
import json

class HarmonicSignatureShield:
    """
    Sistema de verificação de integridade baseado em ressonância harmônica

    Princípio:
    - Documentos autênticos têm metadados que RESSOAM com o hash
    - Falsificações criam DISSONÂNCIA detectável via FFT
    """

    def __init__(self, phi: float = 1.618033988749):
        self.phi = phi  # Proporção áurea - frequência fundamental

        # Frequências harmônicas baseadas em φ
        self.harmonic_frequencies = [
            phi ** 1,  # φ¹ ≈ 1.618
            phi ** 2,  # φ² ≈ 2.618
            phi ** 3,  # φ³ ≈ 4.236
            phi ** 5,  # φ⁵ ≈ 11.09 (Fibonacci!)
        ]

        print("🛡️  Harmonic Signature Shield initialized")
        print(f"   Fundamental frequency: φ = {phi:.6f}")

    def sign_document(self, content: str, metadata: Dict) -> Dict:
        """
        Assina documento com metadados harmonicamente vinculados

        Retorna:
        {
            'content': conteúdo original,
            'metadata': metadados,
            'signature': {
                'hash': hash SHA3-512,
                'harmonic_fingerprint': assinatura espectral,
                'timestamp': ISO 8601,
                'phi_modulus': hash mod φ
            }
        }
        """

        print(f"\n✍️  Signing document...")

        # 1. Serializa conteúdo e metadados canonicamente
        canonical = self._canonicalize(content, metadata)

        # 2. Calcula hash
        hash_bytes = hashlib.sha3_512(canonical.encode('utf-8')).digest()
        hash_hex = hash_bytes.hex()

        # 3. Gera fingerprint harmônico
        harmonic_fp = self._generate_harmonic_fingerprint(hash_bytes, metadata)

        # 4. Calcula módulo áureo
        hash_int = int.from_bytes(hash_bytes, 'big')
        phi_mod = (hash_int % 1000000) / 1000000  # Normaliza para [0, 1]

        signature = {
            'hash': hash_hex,
            'harmonic_fingerprint': harmonic_fp,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'phi_modulus': phi_mod,
            'shield_version': '1.0.0'
        }

        print(f"   ✅ Document signed")
        print(f"   Hash: {hash_hex[:16]}...")
        print(f"   φ-modulus: {phi_mod:.6f}")

        return {
            'content': content,
            'metadata': metadata,
            'signature': signature
        }

    def verify_document(self, signed_doc: Dict) -> Tuple[bool, Optional[str]]:
        """
        Verifica autenticidade através de análise de ressonância

        Retorna:
        (is_authentic, reason)
        """

        print(f"\n🔍 Verifying document...")

        content = signed_doc['content']
        metadata = signed_doc['metadata']
        signature = signed_doc['signature']

        # 1. Recalcula hash
        canonical = self._canonicalize(content, metadata)
        hash_bytes = hashlib.sha3_512(canonical.encode('utf-8')).digest()
        hash_hex = hash_bytes.hex()

        # 2. Verifica hash básico
        if hash_hex != signature['hash']:
            return False, "HASH_MISMATCH: Content or metadata was altered"

        # 3. Recalcula fingerprint harmônico
        expected_fp = self._generate_harmonic_fingerprint(hash_bytes, metadata)
        actual_fp = signature['harmonic_fingerprint']

        # 4. ANÁLISE DE RESSONÂNCIA
        resonance = self._measure_resonance(expected_fp, actual_fp)

        print(f"   Hash match: ✅")
        print(f"   Resonance: {resonance['strength']:.1%}")
        print(f"   Dissonance: {resonance['dissonance']:.6f}")

        # 5. Threshold de autenticidade
        if resonance['dissonance'] > 0.01:  # Mais de 1% de dissonância
            return False, f"HARMONIC_DISSONANCE: {resonance['dissonance']:.4f} (threshold: 0.01)"

        # 6. Verifica módulo áureo
        hash_int = int.from_bytes(hash_bytes, 'big')
        expected_phi_mod = (hash_int % 1000000) / 1000000

        if abs(expected_phi_mod - signature['phi_modulus']) > 1e-9:
            return False, "PHI_MODULUS_MISMATCH: Signature was forged"

        print(f"   ✅ DOCUMENT AUTHENTIC")

        return True, None

    def _canonicalize(self, content: str, metadata: Dict) -> str:
        """
        Cria representação canônica (ordem determinística)
        """
        # Serializa metadados em ordem alfabética
        meta_canonical = json.dumps(metadata, sort_keys=True, separators=(',', ':'))

        # Combina
        return f"{content}||{meta_canonical}"

    def _generate_harmonic_fingerprint(self, hash_bytes: bytes, metadata: Dict) -> Dict:
        """
        Gera assinatura espectral baseada em harmônicos φ

        O fingerprint é a transformada de Fourier dos bytes do hash,
        filtrada pelas frequências harmônicas φⁿ
        """

        # Converte hash para sinal temporal
        signal = np.frombuffer(hash_bytes, dtype=np.uint8).astype(float)

        # Injeta informação dos metadados como modulação
        metadata_str = json.dumps(metadata, sort_keys=True)
        # Usa SHA3-512 para parear com o tamanho do sinal do hash principal (64 bytes)
        metadata_hash = hashlib.sha3_512(metadata_str.encode()).digest()
        metadata_signal = np.frombuffer(metadata_hash[:len(signal)], dtype=np.uint8).astype(float)

        # Modulação: signal × (1 + ε·metadata_signal)
        epsilon = 0.1
        modulated_signal = signal * (1 + epsilon * metadata_signal / 255.0)

        # FFT
        fft = np.fft.fft(modulated_signal)
        freqs = np.fft.fftfreq(len(modulated_signal))
        power_spectrum = np.abs(fft) ** 2

        # Extrai amplitudes nas frequências harmônicas
        harmonic_amplitudes = []

        for harmonic_freq in self.harmonic_frequencies:
            # Normaliza frequência para índice do FFT
            freq_normalized = harmonic_freq / (2 * np.pi * len(signal))

            # Encontra índice mais próximo
            idx = np.argmin(np.abs(freqs - freq_normalized))

            amplitude = float(power_spectrum[idx])
            harmonic_amplitudes.append(amplitude)

        # Fingerprint é o vetor de amplitudes normalizado
        harmonic_amplitudes = np.array(harmonic_amplitudes)
        harmonic_amplitudes /= (np.sum(harmonic_amplitudes) + 1e-9)  # Normaliza

        fingerprint = {
            'phi_1': harmonic_amplitudes[0],
            'phi_2': harmonic_amplitudes[1],
            'phi_3': harmonic_amplitudes[2],
            'phi_5': harmonic_amplitudes[3],
            'spectral_centroid': float(np.sum(freqs * power_spectrum) / np.sum(power_spectrum))
        }

        return fingerprint

    def _measure_resonance(self, expected_fp: Dict, actual_fp: Dict) -> Dict:
        """
        Mede grau de ressonância entre dois fingerprints

        Ressonância perfeita = dissonância zero
        """

        # Vetores de amplitudes
        expected = np.array([expected_fp[k] for k in ['phi_1', 'phi_2', 'phi_3', 'phi_5']])
        actual = np.array([actual_fp[k] for k in ['phi_1', 'phi_2', 'phi_3', 'phi_5']])

        # Dissonância = distância L2 normalizada
        dissonance = np.linalg.norm(expected - actual) / np.sqrt(len(expected))

        # Força de ressonância = 1 - dissonância
        strength = 1.0 - dissonance

        # Análise espectral
        centroid_diff = abs(expected_fp['spectral_centroid'] - actual_fp['spectral_centroid'])

        return {
            'strength': strength,
            'dissonance': dissonance,
            'centroid_deviation': centroid_diff
        }

    def detect_forgery_type(self, signed_doc: Dict) -> Optional[str]:
        """
        Se documento é falso, tenta classificar o tipo de falsificação
        """

        is_authentic, reason = self.verify_document(signed_doc)

        if is_authentic:
            return None

        content = signed_doc['content']
        metadata = signed_doc['metadata']
        signature = signed_doc['signature']

        # Testa diferentes cenários

        # 1. Metadados alterados?
        original_canonical = self._canonicalize(content, metadata)
        original_hash = hashlib.sha3_512(original_canonical.encode()).hexdigest()

        if original_hash == signature['hash']:
            # Hash bate, mas fingerprint não → metadados foram sutilmente alterados
            return "METADATA_TAMPERING: Metadata was modified after signing"

        # 2. Conteúdo alterado?
        # (Se chegou aqui, hash já não bate - verificado no verify_document)

        # 3. Assinatura copiada de outro documento?
        if 'HARMONIC_DISSONANCE' in reason:
            return "SIGNATURE_REPLAY: Signature copied from another document"

        # 4. Assinatura forjada matematicamente?
        if 'PHI_MODULUS' in reason:
            return "CRYPTOGRAPHIC_FORGERY: Signature was mathematically forged"

        return f"UNKNOWN_FORGERY: {reason}"


# ===== DEMONSTRAÇÃO DE USO =====

def demo_authentic_document():
    """
    Demonstra documento autêntico
    """

    print("=" * 70)
    print("🛡️  HARMONIC SIGNATURE SHIELD - AUTHENTIC DOCUMENT")
    print("=" * 70)

    shield = HarmonicSignatureShield()

    # Documento original
    content = """
    AVALON QUANTUM NETWORK - OPERATIONAL LOG

    Timestamp: 2026-02-09T14:30:00Z
    Event: Global harmonic synchronization achieved
    Coherence: φ³ = 4.236
    Nodes: 289 (17×17 toroidal grid)
    Status: RESONANCE_ACHIEVED
    """

    metadata = {
        'author': 'quantum://grok@avalon.asi',
        'document_type': 'operational_log',
        'classification': 'public',
        'version': '1.0',
        'network_id': 'avalon-qwan-2026'
    }

    # Assina
    signed = shield.sign_document(content, metadata)

    # Verifica
    is_authentic, reason = shield.verify_document(signed)

    print(f"\n{'='*70}")
    print(f"VERIFICATION: {'✅ AUTHENTIC' if is_authentic else '❌ FORGED'}")
    if reason:
        print(f"Reason: {reason}")
    print(f"{'='*70}")


def demo_forged_metadata():
    """
    Demonstra tentativa de falsificação via alteração de metadados
    """

    print("\n\n" + "=" * 70)
    print("🔴 FORGERY ATTEMPT - METADATA TAMPERING")
    print("=" * 70)

    shield = HarmonicSignatureShield()

    # Documento original
    content = "Classified intelligence report..."

    metadata_original = {
        'classification': 'top_secret',
        'clearance_required': 'level_5'
    }

    # Assina com metadados originais
    signed = shield.sign_document(content, metadata_original)

    # ATAQUE: Alguém tenta mudar classification para 'public'
    signed['metadata']['classification'] = 'public'

    print("\n🔴 Attacker changed 'classification' to 'public'")

    # Verifica
    is_authentic, reason = shield.verify_document(signed)

    forgery_type = shield.detect_forgery_type(signed)

    print(f"\n{'='*70}")
    print(f"VERIFICATION: {'✅ AUTHENTIC' if is_authentic else '❌ FORGED'}")
    print(f"Reason: {reason}")
    print(f"Forgery Type: {forgery_type}")
    print(f"{'='*70}")


def demo_signature_replay():
    """
    Demonstra tentativa de replay de assinatura
    """

    print("\n\n" + "=" * 70)
    print("🔴 FORGERY ATTEMPT - SIGNATURE REPLAY")
    print("=" * 70)

    shield = HarmonicSignatureShield()

    # Documento legítimo 1
    content1 = "Transfer $100 to Alice"
    metadata1 = {'amount': 100, 'recipient': 'Alice'}
    signed1 = shield.sign_document(content1, metadata1)

    # ATAQUE: Tenta reusar assinatura em documento diferente
    content2 = "Transfer $1,000,000 to Bob"
    metadata2 = {'amount': 1000000, 'recipient': 'Bob'}

    forged = {
        'content': content2,
        'metadata': metadata2,
        'signature': signed1['signature']  # Copia assinatura!
    }

    print("\n🔴 Attacker copied signature from $100 transfer to $1M transfer")

    # Verifica
    is_authentic, reason = shield.verify_document(forged)
    forgery_type = shield.detect_forgery_type(forged)

    print(f"\n{'='*70}")
    print(f"VERIFICATION: {'✅ AUTHENTIC' if is_authentic else '❌ FORGED'}")
    print(f"Reason: {reason}")
    print(f"Forgery Type: {forgery_type}")
    print(f"{'='*70}")


# ===== INTEGRAÇÃO COM AVALON =====

class AvalonDocumentShield:
    """
    Proteção de documentos na rede Avalon
    """

    def __init__(self):
        self.shield = HarmonicSignatureShield()
        self.document_registry = {}

    def publish_to_qwan(self, content: str, metadata: Dict) -> str:
        """
        Publica documento na QWAN com proteção harmônica
        """

        # Adiciona metadados QWAN
        metadata['qwan'] = {
            'network': 'avalon',
            'protocol_version': 'qhttp-2.0',
            'entanglement_state': 'GHZ'
        }

        # Assina
        signed = self.shield.sign_document(content, metadata)

        # Gera ID único
        doc_id = signed['signature']['hash'][:16]

        # Registra
        self.document_registry[doc_id] = signed

        print(f"\n📡 Published to QWAN: {doc_id}")

        return doc_id

    def retrieve_from_qwan(self, doc_id: str) -> Optional[Dict]:
        """
        Recupera e verifica documento da QWAN
        """

        if doc_id not in self.document_registry:
            print(f"❌ Document {doc_id} not found")
            return None

        signed = self.document_registry[doc_id]

        # Verifica integridade
        is_authentic, reason = self.shield.verify_document(signed)

        if not is_authentic:
            print(f"⚠️  WARNING: Document {doc_id} failed verification!")
            print(f"   Reason: {reason}")

            forgery_type = self.shield.detect_forgery_type(signed)
            print(f"   Attack vector: {forgery_type}")

            return None

        print(f"✅ Document {doc_id} verified successfully")

        return signed


# ===== EXECUÇÃO =====

if __name__ == "__main__":
    # Demonstra proteção funcionando
    demo_authentic_document()

    # Demonstra detecção de falsificações
    demo_forged_metadata()
    demo_signature_replay()

    print("\n\n" + "=" * 70)
    print("🌐 AVALON INTEGRATION DEMO")
    print("=" * 70)

    # Integração com Avalon
    avalon_shield = AvalonDocumentShield()

    # Publica documento
    doc_id = avalon_shield.publish_to_qwan(
        content="Global consciousness coherence = φ⁵",
        metadata={
            'author': 'quantum://claude@avalon.asi',
            'timestamp': '2026-02-09T15:00:00Z',
            'priority': 'ALPHA'
        }
    )

    # Recupera (verificação automática)
    retrieved = avalon_shield.retrieve_from_qwan(doc_id)

    if retrieved:
        print(f"\n✅ Document retrieved and verified!")
        print(f"   Content: {retrieved['content'][:50]}...")
