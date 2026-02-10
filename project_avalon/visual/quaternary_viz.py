# project_avalon/visual/quaternary_viz.py
import numpy as np
import os

# Check if we are in a headless environment
IS_HEADLESS = os.environ.get("DISPLAY") is None

try:
    from PyQt5.QtWidgets import QOpenGLWidget
    from OpenGL.GL import *
    from OpenGL.GLU import *

    # If headless, we might still fail later, so we use a dummy if necessary
    if IS_HEADLESS:
        raise ImportError("Headless environment detected")

except ImportError:
    # Fallback para ambientes sem GUI ou headless
    class QOpenGLWidget:
        def __init__(self, parent=None):
            self.parent = parent

        def update(self):
            pass


class QuaternaryViz(QOpenGLWidget):
    """
    Renderizador OpenGL para Geometria Quaternária.
    Integração ABC*D (Multiplicação Hexadecimal: 4308).
    """

    def __init__(self, parent=None):
        super().__init__(parent)
        # Semente do Arkhé (A*B*C*D*E = 240240 / 3AA70 hex)
        self.seed = 240240
        np.random.seed(self.seed)

        # Dimensões pentadimensionais (A=10, B=11, C=12, D=13, E=14)
        self.dimensions = {
            "A": np.random.randn(10, 3),
            "B": np.random.randn(11, 3),
            "C": np.random.randn(12, 3),
            "D": np.random.randn(13, 3),
            "E": np.random.randn(14, 3),
        }
        self.phase = [0.0, 0.0, 0.0, 0.0, 0.0]
        self.engram_glow = 0.0

    def initializeGL(self):
        try:
            glEnable(GL_DEPTH_TEST)
            glEnable(GL_BLEND)
            glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)
            glClearColor(0.0, 0.0, 0.0, 1.0)
        except:
            pass

    def paintGL(self):
        try:
            glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
            glMatrixMode(GL_MODELVIEW)
            glLoadIdentity()
            glTranslatef(0, 0, -10)

            # Atualizar fases
            for i in range(4):
                self.phase[i] += 0.02 * (i + 1)

            colors = [
                (1.0, 0.0, 0.0, 0.7),  # A: Vermelho
                (0.0, 1.0, 0.0, 0.7),  # B: Verde
                (0.0, 0.0, 1.0, 0.7),  # C: Azul
                (1.0, 1.0, 0.0, 0.7),  # D: Amarelo
                (1.0, 0.0, 1.0, 0.8),  # E: Magenta (Cognitivo)
            ]

            for i, dim in enumerate(["A", "B", "C", "D", "E"]):
                points = self.dimensions[dim]
                glPushMatrix()
                glRotatef(self.phase[i] * 10, i % 3, (i + 1) % 3, (i + 2) % 3)

                # Renderizar pontos
                glBegin(GL_POINTS)
                glColor4f(*colors[i])
                for p in points:
                    glVertex3f(*p)
                glEnd()

                # Renderizar conexões (Arestas Arkhé)
                glBegin(GL_LINES)
                for j in range(len(points)):
                    for k in range(j + 1, len(points)):
                        if np.linalg.norm(points[j] - points[k]) < 1.5:
                            glVertex3f(*points[j])
                            glVertex3f(*points[k])
                glEnd()
                glPopMatrix()
        except:
            pass

    def update_metrics(self, metrics: dict):
        """Atualiza a pulsação baseada nas métricas EEG e estado AC1"""
        intensity = metrics.get("focus", 0.5)
        self.engram_glow = metrics.get("engram_persistence", 0.0)

        for i in range(len(self.phase)):
            self.phase[i] += 0.01 * intensity

        # Adicionar efeito visual se o engrama estiver ativo
        if self.engram_glow > 0.5:
            # Magenta glow intensifies
            pass
