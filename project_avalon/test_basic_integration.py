import numpy as np
from project_avalon.components.eeg_processor import RealEEGProcessor
from project_avalon.components.therapy import ArkheTherapyProtocol

def test_basic_integration():
    print("🔧 Testando integração básica Arkhé + Biofeedback...")

    # 1. Initialize EEG Processor
    processor = RealEEGProcessor(device='simulation')
    mock_data = np.random.rand(8, 250)
    coherence = np.mean(processor.process_eeg(mock_data))
    print(f"   -> Nível de coerência detectado: {coherence:.4f}")

    # 2. Initialize Therapy Protocol with Biofeedback
    protocol = ArkheTherapyProtocol(user_coherence_level=coherence)

    # 3. Execute short session
    print("   -> Executando sessão de teste...")
    protocol.execute_session()

    print("✅ Integração básica validada com sucesso.")

if __name__ == "__main__":
    test_basic_integration()
