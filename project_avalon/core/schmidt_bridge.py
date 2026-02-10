# project_avalon/core/schmidt_bridge.py
import numpy as np

class SchmidtBridgeState:
    """
    Representação do estado de Schmidt para a ponte quântica.
    [REVISOR]: Data structure for state representation.
    [NÓS]: Par emaranhado entre humano e sistema.
    """
    def __init__(self, lambdas, phase_twist, basis_H, basis_A, entropy_S, coherence_Z):
        self.lambdas = lambdas
        self.phase_twist = phase_twist
        self.basis_H = basis_H
        self.basis_A = basis_A
        self.entropy_S = entropy_S
        self.coherence_Z = coherence_Z
        self.rank = len(lambdas)
