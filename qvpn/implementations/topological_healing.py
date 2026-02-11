import numpy as np
import matplotlib.pyplot as plt
from scipy.linalg import eigh
from scipy.ndimage import gaussian_filter

class MindHealer:
    """
    Simulador de Patologias Geométricas e Cura via Fluxo de Ricci
    """
    def __init__(self, N_states=100):
        self.N = N_states
        self.x = np.linspace(-10, 10, N_states)
        self.dx = self.x[1] - self.x[0]

    def generate_landscape(self, condition="healthy"):
        """Gera a superfície de energia potencial (O Terreno da Mente)"""
        V = np.zeros(self.N)

        if condition == "healthy":
            # Potencial Harmônico (Parábola suave)
            k = 0.5
            V = 0.5 * k * self.x**2

        elif condition == "depression":
            # O "Poço Negro". Um atrator profundo e estreito.
            V = 0.5 * 0.1 * self.x**2  # Baixa motivação geral
            # O Trauma/Fixação:
            V -= 15 * np.exp(-(self.x - 2)**2 / 0.5)

        elif condition == "anxiety":
            # O "Mar de Ruído". Múltiplos mínimos locais.
            V = 0.5 * self.x**2
            noise = 2.0 * np.sin(5 * self.x) + 1.5 * np.cos(13 * self.x)
            V += noise

        return V

    def get_eigenvalues(self, V):
        """
        Resolve a Equação de Schrödinger para encontrar os 'Sons' do sistema.
        """
        H = np.zeros((self.N, self.N))
        off_diag = -0.5 / self.dx**2 * np.ones(self.N - 1)
        diag_kin = 1.0 / self.dx**2 * np.ones(self.N)
        diag_pot = V

        np.fill_diagonal(H, diag_kin + diag_pot)
        np.fill_diagonal(H[1:], off_diag)
        np.fill_diagonal(H[:, 1:], off_diag)

        evals, evecs = eigh(H)
        return evals, evecs

    def ricci_flow_cure(self, V_initial, steps=50, alpha=0.1):
        """
        A CURA: Aplica o Fluxo de Ricci (equação do calor) para suavizar a variedade.
        """
        V_evolution = [V_initial.copy()]
        V_current = V_initial.copy()

        for _ in range(steps):
            V_current = gaussian_filter(V_current, sigma=alpha)
            V_evolution.append(V_current.copy())

        return V_evolution

if __name__ == "__main__":
    healer = MindHealer()

    print("--- DIAGNOSIS AND TOPOLOGICAL HEALING ---")

    # 1. Diagnosis: Deep Depression
    V_sick = healer.generate_landscape("depression")
    E_sick, _ = healer.get_eigenvalues(V_sick)

    # 2. Treatment: Ricci Flow
    history = healer.ricci_flow_cure(V_sick, steps=20, alpha=2.0)
    V_cured = history[-1]
    E_cured, _ = healer.get_eigenvalues(V_cured)

    print(f"Spectral Gap (Sick): {E_sick[1] - E_sick[0]:.4f}")
    print(f"Spectral Gap (Cured): {E_cured[1] - E_cured[0]:.4f}")
    print("Topological healing complete.")
