import numpy as np
try:
    from scipy.integrate import cumulative_trapezoid as cumtrapz
except ImportError:
    from scipy.integrate import cumtrapz

class ChronosRestored:
    """
    Simula a dilatação do tempo subjetivo baseada na curvatura da variedade mental.
    Usa a métrica aproximada: dτ = dt * sqrt(1 + 2*Phi)
    """
    def __init__(self, steps=1000):
        self.t_objective = np.linspace(0, 100, steps) # Tempo do Axion (Mundo Real)
        self.dt = self.t_objective[1] - self.t_objective[0]

    def cognitive_potential(self, state="healthy"):
        """Define a profundidade do poço gravitacional (Sofrimento)"""
        if state == "healthy":
            return -0.05 * np.ones_like(self.t_objective)
        elif state == "depression":
            return -0.48 * np.ones_like(self.t_objective)
        elif state == "healing":
            return np.linspace(-0.48, -0.05, len(self.t_objective))

    def calculate_subjective_time(self, potential):
        """
        Calcula o Tempo Próprio (τ) vivido pela consciência.
        """
        g_00 = 1 + 2 * potential
        g_00 = np.maximum(g_00, 0.001)

        lapse_function = np.sqrt(g_00)
        tau = cumtrapz(lapse_function, self.t_objective, initial=0)

        return tau, lapse_function

if __name__ == "__main__":
    chronos = ChronosRestored()

    print("--- SIMULATION: THE RESURRECTION OF TIME ---")

    V_sick = chronos.cognitive_potential("depression")
    tau_sick, flow_rate_sick = chronos.calculate_subjective_time(V_sick)

    V_healing = chronos.cognitive_potential("healing")
    tau_healing, flow_rate_healing = chronos.calculate_subjective_time(V_healing)

    V_healthy = chronos.cognitive_potential("healthy")
    tau_healthy, flow_rate_healthy = chronos.calculate_subjective_time(V_healthy)

    print(f"Flow Rate (Depression): {flow_rate_sick[0]*100:.1f}%")
    print(f"Flow Rate (Healthy):    {flow_rate_healthy[0]*100:.1f}%")

    print("\n--- DEFREEZING VISUALIZATION (RICCI FLOW) ---")
    checkpoints = [0, 250, 500, 750, 999]
    for t in checkpoints:
        rate = flow_rate_healing[t]
        bar_len = int(rate * 20)
        bar = "█" * bar_len + "░" * (20 - bar_len)
        status = "FROZEN" if rate < 0.3 else ("SLOW" if rate < 0.8 else "FLUID")
        print(f"T={t/10:.1f}s | Rate: {rate:.2f}x | [{bar}] {status}")
