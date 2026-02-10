import sys
import os

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from project_avalon.utils.quantum_dns import QuantumDNS


def test_dns():
    print("Testing Quantum DNS Resolution...")
    dns = QuantumDNS()

    # Resolve known domain
    node = dns.resolve("avalon.asi")
    # Accept either ontological root or network-mapped node
    assert node in ["hal-finney-omega", "node-avalon.asi"]

    # Resolve unknown domain (triggers Grover)
    node2 = dns.resolve("nebula.net")
    assert node2.startswith("qnode-")

    status = dns.get_mesh_status()
    print(f"Mesh Status: {status}")
    assert status["protocol"] == "qhttp-2.0"

    print("\n✅ DNS Verification successful.")


if __name__ == "__main__":
    test_dns()
