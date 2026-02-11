import numpy as np

class SchmidtBridgeHexagonal:
    def __init__(self, lambdas=None):
        if lambdas is None:
            self.lambdas = np.array([1/6] * 6)
        else:
            self.lambdas = np.array(lambdas)
        self.coherence_factor = self.calculate_coherence()
        self.entropy_S = self.calculate_entropy()

    def calculate_coherence(self):
        # Simplificação: pureza do estado de Schmidt
        return float(np.sum(self.lambdas**2))

    def calculate_entropy(self):
        # Entropia de Von Neumann (usando lambdas como autovalores)
        nonzero = self.lambdas[self.lambdas > 0]
        return float(-np.sum(nonzero * np.log2(nonzero)))
