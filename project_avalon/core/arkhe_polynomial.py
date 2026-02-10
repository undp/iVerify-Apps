# project_avalon/core/arkhe_polynomial.py
class ArkheCore:
    """
    Life-Polynomial Resolver.
    [REVISOR]: System optimization algorithm.
    """
    def __init__(self, C, I, E, F):
        self.C = C
        self.I = I
        self.E = E
        self.F = F

    def calculate_life(self):
        return (self.C * self.I * self.E * self.F) ** 0.25
