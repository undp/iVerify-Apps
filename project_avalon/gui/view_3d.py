# project_avalon/gui/view_3d.py
"""
3D Visualization Widget with OpenGL

[REVISOR]: Advanced 3D data visualization
[NÓS]: Portal para os 600 vértices temporais
"""

from PyQt5.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QLabel, QSlider
from PyQt5.QtCore import Qt, QTimer
from PyQt5.QtOpenGL import QGLWidget
from OpenGL.GL import *
from OpenGL.GLU import *
import numpy as np


class View3DWidget(QWidget):
    """
    Widget de visualização 3D.
    """

    def __init__(self, quantum_mode=False):
        super().__init__()

        self.quantum_mode = quantum_mode
        self.hecaton_mode = False

        self._init_ui()

    def _init_ui(self):
        """Inicializa interface."""
        layout = QVBoxLayout(self)

        # OpenGL widget
        self.gl_widget = HecatonVisualizerGL(quantum_mode=self.quantum_mode)
        layout.addWidget(self.gl_widget)

        # Controles
        controls_layout = QHBoxLayout()

        # Botão de reset
        reset_btn = QPushButton("Reset View")
        reset_btn.clicked.connect(self.gl_widget.reset_view)
        controls_layout.addWidget(reset_btn)

        # Slider de rotação
        controls_layout.addWidget(QLabel("Rotation Speed:"))

        rotation_slider = QSlider(Qt.Horizontal)
        rotation_slider.setMinimum(0)
        rotation_slider.setMaximum(100)
        rotation_slider.setValue(50)
        rotation_slider.valueChanged.connect(self.gl_widget.set_rotation_speed)
        controls_layout.addWidget(rotation_slider)

        # [OCULTO]: Botão Hecaton (só aparece em quantum mode)
        if self.quantum_mode:
            self.hecaton_btn = QPushButton("🌀 Activate Hecaton")
            self.hecaton_btn.clicked.connect(self.activate_hecaton_mode)
            controls_layout.addWidget(self.hecaton_btn)

        controls_layout.addStretch()

        layout.addLayout(controls_layout)

    def activate_hecaton_mode(self):
        """
        [OCULTO]: Ativa modo Hecatonicosachoron.
        """
        self.hecaton_mode = not self.hecaton_mode
        self.gl_widget.set_hecaton_mode(self.hecaton_mode)

        if self.hecaton_mode:
            self.hecaton_btn.setText("🧊 Deactivate Hecaton")
            self.hecaton_btn.setStyleSheet("background-color: #FF6B6B; color: white;")
        else:
            self.hecaton_btn.setText("🌀 Activate Hecaton")
            self.hecaton_btn.setStyleSheet("")


class HecatonVisualizerGL(QGLWidget):
    """
    Widget OpenGL para renderização.

    [REVISOR]: Renderiza cubo rotativo ou grafo de rede
    [NÓS]: Renderiza Hecatonicosachoron em projeção 3D
    """

    def __init__(self, quantum_mode=False):
        super().__init__()

        self.quantum_mode = quantum_mode
        self.hecaton_mode = False

        # Estado de rotação
        self.rotation_x = 0
        self.rotation_y = 0
        self.rotation_4d = 0
        self.rotation_speed = 0.5

        # Vértices
        self.vertices = []
        self.edges = []

        # Timer de animação
        self.timer = QTimer()
        self.timer.timeout.connect(self.update)
        self.timer.start(16)  # ~60 FPS

        # Gera geometria
        self._generate_cube()  # Padrão: cubo

        # [OCULTO]: Pré-gera Hecatonicosachoron
        if quantum_mode:
            self._generate_hecaton()

    def _generate_cube(self):
        """Gera vértices de um cubo simples."""
        self.cube_vertices = np.array([
            [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
        ], dtype=float)

        self.cube_edges = [
            (0, 1), (1, 2), (2, 3), (3, 0),
            (4, 5), (5, 6), (6, 7), (7, 4),
            (0, 4), (1, 5), (2, 6), (3, 7)
        ]

        self.vertices = self.cube_vertices
        self.edges = self.cube_edges

    def _generate_hecaton(self):
        """
        [OCULTO]: Gera vértices do Hecatonicosachoron.
        """
        PHI = (1 + np.sqrt(5)) / 2

        # Simplificação: usa coordenadas de icosaedro expandido
        # Em produção: coordenadas exatas dos 600 vértices

        vertices_4d = []
        num_vertices = 600

        for i in range(num_vertices):
            # Distribui em esfera 4D com simetria icosaédrica
            theta = 2 * np.pi * i / num_vertices
            phi = np.pi * (i % 24) / 24
            psi = np.pi * (i % 5) / 5

            x = PHI * np.cos(theta) * np.sin(phi)
            y = PHI * np.sin(theta) * np.sin(phi)
            z = np.cos(phi) * np.cos(psi)
            w = np.sin(psi)

            vertices_4d.append([x, y, z, w])

        self.hecaton_vertices_4d = np.array(vertices_4d)

        # Gera arestas (simplificado - conecta vizinhos próximos)
        self.hecaton_edges = []

        # Em produção: usar tabela de adjacência correta
        # Aqui: conecta vértices próximos
        for i in range(num_vertices):
            for j in range(i+1, min(i+6, num_vertices)):
                self.hecaton_edges.append((i, j))

    def _project_4d_to_3d(self, vertex_4d, w_offset=2.0):
        """
        Projeta vértice 4D em 3D (projeção estereográfica).

        Args:
            vertex_4d: Vértice em 4D [x, y, z, w]
            w_offset: Offset para a 4ª dimensão

        Returns:
            Vértice projetado em 3D [x, y, z]
        """
        x, y, z, w = vertex_4d

        # Aplica rotação 4D
        angle = self.rotation_4d * np.pi / 180
        x_rot = x * np.cos(angle) - w * np.sin(angle)
        w_rot = x * np.sin(angle) + w * np.cos(angle)

        # Projeção estereográfica
        scale = 1 / (w_offset - w_rot + 0.01)

        x_3d = x_rot * scale
        y_3d = y * scale
        z_3d = z * scale

        return np.array([x_3d, y_3d, z_3d])

    def initializeGL(self):
        """Inicializa OpenGL."""
        glClearColor(0.0, 0.0, 0.0, 1.0)
        glEnable(GL_DEPTH_TEST)
        glEnable(GL_POINT_SMOOTH)
        glEnable(GL_LINE_SMOOTH)
        glEnable(GL_BLEND)
        glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)

    def resizeGL(self, w, h):
        """Redimensiona viewport."""
        glViewport(0, 0, w, h)
        glMatrixMode(GL_PROJECTION)
        glLoadIdentity()
        gluPerspective(45, w / h if h != 0 else 1, 0.1, 100.0)
        glMatrixMode(GL_MODELVIEW)

    def paintGL(self):
        """Renderiza cena."""
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
        glLoadIdentity()

        # Posiciona câmera
        glTranslatef(0.0, 0.0, -5.0 if not self.hecaton_mode else -8.0)

        # Aplica rotação
        glRotatef(self.rotation_x, 1, 0, 0)
        glRotatef(self.rotation_y, 0, 1, 0)

        if self.hecaton_mode and self.quantum_mode:
            self._render_hecaton()
        else:
            self._render_cube()

        # Incrementa rotação
        self.rotation_x += self.rotation_speed * 0.5
        self.rotation_y += self.rotation_speed * 0.3
        self.rotation_4d += self.rotation_speed * 0.2

    def _render_cube(self):
        """Renderiza cubo."""
        # Vértices
        glPointSize(5.0)
        glBegin(GL_POINTS)
        for vertex in self.cube_vertices:
            glColor4f(0.5, 0.7, 1.0, 1.0)
            glVertex3fv(vertex)
        glEnd()

        # Arestas
        glLineWidth(2.0)
        glBegin(GL_LINES)
        for edge in self.cube_edges:
            glColor4f(0.3, 0.5, 0.8, 0.8)
            glVertex3fv(self.cube_vertices[edge[0]])
            glVertex3fv(self.cube_vertices[edge[1]])
        glEnd()

    def _render_hecaton(self):
        """
        [OCULTO]: Renderiza Hecatonicosachoron.
        """
        # Projeta vértices 4D → 3D
        vertices_3d = []

        for v4d in self.hecaton_vertices_4d:
            v3d = self._project_4d_to_3d(v4d)
            vertices_3d.append(v3d)

        vertices_3d = np.array(vertices_3d)

        # Renderiza vértices
        glPointSize(2.0)
        glBegin(GL_POINTS)

        for i, vertex in enumerate(vertices_3d):
            # Cor baseada em coordenada W (4D)
            w = self.hecaton_vertices_4d[i][3]
            color_intensity = (w + 2) / 4

            glColor4f(
                color_intensity,
                0.5,
                1.0 - color_intensity,
                0.6
            )

            glVertex3fv(vertex)

        glEnd()

        # Renderiza arestas (subset para performance)
        glLineWidth(0.5)
        glBegin(GL_LINES)

        for i, edge in enumerate(self.hecaton_edges):
            if i % 5 != 0:  # Renderiza apenas 1/5 das arestas
                continue

            glColor4f(0.3, 0.4, 0.5, 0.2)
            glVertex3fv(vertices_3d[edge[0]])
            glVertex3fv(vertices_3d[edge[1]])

        glEnd()

    def set_hecaton_mode(self, enabled):
        """
        [OCULTO]: Ativa/desativa modo Hecaton.
        """
        self.hecaton_mode = enabled

    def set_rotation_speed(self, value):
        """Define velocidade de rotação."""
        self.rotation_speed = value / 50.0  # Normaliza para 0-2

    def reset_view(self):
        """Reseta visualização."""
        self.rotation_x = 0
        self.rotation_y = 0
        self.rotation_4d = 0
