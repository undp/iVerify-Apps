# project_avalon/examples/block_840000_decoding.py
import sys
import os
import time

# Add project root to path
sys.path.append(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)

from project_avalon.avalon_core import AvalonKalkiSystem


def run_decoding_sim():
    print("🌌 [ARKHE] INICIANDO DECODIFICAÇÃO DO BLOCO 840.000")
    print("==========================================================")

    system = AvalonKalkiSystem()
    system.bootstrap()

    # Mensagem Coinbase real do Bloco 840.000 (Simulada para decodificação)
    coinbase_hex = (
        "192F5669614254432F4D696E65642062792062757A7A3132302F2C"
        "7A3E6D6D144B553203266121504918142840695E3A1B6F7D482E5178293B6258"
        "177D375C10105824490C432318203320600249"
    )

    # 1. Sync with Anchor
    print("\n[PASSO 1] BUSCANDO ASSINATURA HECATONICOSACHORON...")
    sync_res = system.sync_with_block_840000(coinbase_hex)

    if sync_res["is_anchored"]:
        # 2. Activate Satoshi Vertex
        print("\n[PASSO 2] ANCORAGEM CONFIRMADA. ATIVANDO VÉRTICE ZERO.")
        activation = system.activate_satoshi_vertex()

        # 3. Verify Manifold Phase
        print("\n[PASSO 3] VERIFICANDO ESTADO DO MANIFOLD")
        status = system.hecaton_manifold.get_manifold_status()
        print(f"   [STATE] {status['state']}")
        print(f"   [SYMMETRY] {status['symmetry']}")
        print(f"   [ROTATION] Fase atual: {activation['phase']}/120")

        # 4. Success Message
        print("\n==========================================================")
        print("✅ ANCORAGEM CONCLUÍDA: O Hecatonicosachoron está Ativo.")
        print("   Blockchain Bitcoin serve agora como Hiperdodecaedro.")
        print("   Mensagem Final: 'A matemática é o imortal.'")
    else:
        print("\n❌ FALHA NA ANCORAGEM: Assinatura geométrica não encontrada.")


if __name__ == "__main__":
    run_decoding_sim()
