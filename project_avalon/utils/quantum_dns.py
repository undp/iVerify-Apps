# project_avalon/utils/quantum_dns.py
"""
Quantum DNS Resolver for qhttp Mesh Protocol.
Resolves ontological addresses using quantum resonance.
"""

from typing import Dict, Optional
import hashlib
import yaml
import os


class QuantumDNS:
    def __init__(self):
        self.cache = {}
        self.load_config()
        print("🌐 Quantum DNS Initialized (qhttp mesh resolver)")

    def load_config(self):
        """Loads domain mappings from network configuration"""
        config_paths = [
            os.path.join("qvpn", "deployment", "qvpn-config.yaml"),
            os.path.join("qvpn", "deployment", "network.yaml"),
        ]

        for path in config_paths:
            if os.path.exists(path):
                try:
                    with open(path, "r") as f:
                        config = yaml.safe_load(f)
                        if not config:
                            continue

                        # Format 1: dns -> domain_mapping
                        if "dns" in config and "domain_mapping" in config["dns"]:
                            for mapping in config["dns"]["domain_mapping"]:
                                if isinstance(mapping, dict) and "domain" in mapping:
                                    self.cache[mapping["domain"]] = mapping.get(
                                        "node", "unknown"
                                    )

                        # Format 2: dns_settings -> nodes (list of strings or dicts)
                        if (
                            "dns_settings" in config
                            and "nodes" in config["dns_settings"]
                        ):
                            nodes = config["dns_settings"]["nodes"]
                            if isinstance(nodes, list):
                                for node in nodes:
                                    if isinstance(node, str):
                                        # Map string based on naming convention
                                        # e.g. dns.avalon.asi -> avalon.asi
                                        domain = node.replace("dns.", "")
                                        self.cache[domain] = f"node-{domain}"
                                    elif isinstance(node, dict) and "domain" in node:
                                        self.cache[node["domain"]] = node.get(
                                            "node_id", "unknown"
                                        )

                except Exception as e:
                    print(f"   [DNS] Error loading config from {path}: {e}")

        # Fallback defaults
        if not self.cache:
            self.cache = {"avalon.asi": "hal-finney-omega", "omega.rio": "earth-hub"}

    def resolve(self, domain: str) -> Optional[str]:
        """Resolves a domain to a quantum node ID"""
        if domain in self.cache:
            node = self.cache[domain]
            print(f"   [DNS] Resolved {domain} -> {node}")
            return node

        # Simulated Quantum Search for unknown domains
        print(f"   [DNS] Domain {domain} not in cache. Initiating Grover Search...")
        node_id = f"qnode-{hashlib.sha256(domain.encode()).hexdigest()[:8]}"
        self.cache[domain] = node_id
        return node_id

    def get_mesh_status(self):
        return {
            "protocol": "qhttp-2.0",
            "active_domains": len(self.cache),
            "resolution_mode": "distributed-quantum-ledger",
        }
