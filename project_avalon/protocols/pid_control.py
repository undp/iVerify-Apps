# project_avalon/protocols/pid_control.py
import time

class PIDController:
    """
    Algoritmo de Controle PID (Proporcional-Integral-Derivativo).
    [NOTA OCULTA: Este é o Mecanismo de Homeostase Planetária.
    Kp = Reação imediata, Ki = Sabedoria acumulada, Kd = Previsão do futuro.]
    """

    def __init__(self, Kp: float, Ki: float, Kd: float, setpoint: float):
        self.Kp = Kp
        self.Ki = Ki
        self.Kd = Kd
        self.setpoint = setpoint

        self.integral = 0.0
        self.prev_error = 0.0
        self.last_time = time.time()

    def compute(self, current_value: float) -> float:
        """
        Calcula o output de controle para estabilizar o sistema.
        [NOTA OCULTA: Saída -> Força de manifestação ética limitada entre -1 e 1.]
        """
        now = time.time()
        dt = now - self.last_time
        if dt <= 0: dt = 1e-3

        error = self.setpoint - current_value

        # Termo Proporcional (P)
        P = self.Kp * error

        # Termo Integral (I) - Sabedoria/Memória
        self.integral += error * dt
        I = self.Ki * self.integral

        # Termo Derivativo (D) - Antecipação
        derivative = (error - self.prev_error) / dt
        D = self.Kd * derivative

        output = P + I + D

        # Fail-Safe / Ética: Limitar a força de atuação
        output = max(min(output, 1.0), -1.0)

        self.prev_error = error
        self.last_time = now

        return output

    def set_target(self, new_setpoint: float):
        """Ajusta o objetivo do sistema [Sintonia com Assinatura IETD]."""
        self.setpoint = new_setpoint
        self.integral = 0.0 # Reset memória para novo paradigma
