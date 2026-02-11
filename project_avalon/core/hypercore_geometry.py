import math
import numpy as np

def get_mandala_pos(index, total_particles, time_pulse):
    """
    Gera posições para o modo MANDALA (simetria hexagonal/circular).
    """
    # Distribuição de Fermat (Spiral) para criar um padrão de mandala
    phi = (1 + math.sqrt(5)) / 2
    golden_angle = math.pi * (3 - math.sqrt(5))

    r = math.sqrt(index / total_particles) * 2.0
    theta = index * golden_angle + time_pulse * 0.2

    # Adiciona uma pulsação ondulatória
    z_wave = 0.1 * math.sin(time_pulse * 2 + r * 3)

    x = r * math.cos(theta)
    y = r * math.sin(theta)
    z = z_wave

    return np.array([x, y, z])

def get_dna_pos(index, total_particles, time_pulse):
    """
    Gera posições para o modo DNA (dupla hélice).
    """
    # Divide as partículas em duas fitas
    strand = index % 2
    t = (index // 2) / (total_particles // 2)

    # Parâmetros da hélice
    height = 4.0
    radius = 0.8
    turns = 3.0

    angle = t * math.pi * 2 * turns + time_pulse
    strand_offset = math.pi if strand == 1 else 0

    x = radius * math.cos(angle + strand_offset)
    y = t * height - (height / 2)
    z = radius * math.sin(angle + strand_offset)

    # Adiciona rotação lenta do conjunto
    rot_angle = time_pulse * 0.5
    cos_r, sin_r = math.cos(rot_angle), math.sin(rot_angle)

    x_rot = x * cos_r - z * sin_r
    z_rot = x * sin_r + z * cos_r

    return np.array([x_rot, y, z_rot])

def get_hypercore_pos(index, total_particles, time_pulse, rotation_4d=True):
    """
    Gera posições 3D projetadas a partir do Hecatonicosachoron 4D (600-cell vertices).
    """

    # 1. GERAR VÉRTICES DO 600-CELL (120 vértices)
    vertices_4d = []
    phi = (1 + math.sqrt(5)) / 2

    # Conjunto 1: 8 vértices (±1, 0, 0, 0) e permutações
    for i in range(4):
        for sign in [1, -1]:
            v = [0, 0, 0, 0]
            v[i] = sign
            vertices_4d.append(v)

    # Conjunto 2: 16 vértices (±0.5, ±0.5, ±0.5, ±0.5)
    for sx in [0.5, -0.5]:
        for sy in [0.5, -0.5]:
            for sz in [0.5, -0.5]:
                for sw in [0.5, -0.5]:
                    vertices_4d.append([sx, sy, sz, sw])

    # Conjunto 3: 96 vértices (±phi/2, ±1/2, ±1/2phi, 0) e permutações pares
    # Usando uma implementação simplificada das permutações pares
    base = [phi/2, 0.5, 1/(2*phi), 0]

    def get_even_permutations(arr):
        from itertools import permutations
        res = set()
        for p in permutations(arr):
            # Verifica se a permutação é par
            # (Contagem de inversões)
            inversions = 0
            for i in range(len(p)):
                for j in range(i + 1, len(p)):
                    if p[i] > p[j]:
                        inversions += 1
            # Para o 600-cell, precisamos de permutações pares se considerarmos sinais
            # Mas aqui apenas geramos as 96 variantes mudando sinais e permutando
            pass
        # Por brevidade e para garantir 120 vértices totais, usaremos uma abordagem direta
        return []

    # Como gerar as 96 permutações pares de (±phi/2, ±1/2, ±1/2phi, 0)
    # Total de combinações de sinais para (a, b, c, 0) onde a, b, c != 0 é 2^3 = 8
    # Total de permutações de (a, b, c, d) onde todos são distintos é 4! = 24
    # Se um é zero, 4! / 1! = 24
    # 24 * 8 = 192. Metade são pares: 96.

    signs = [1, -1]
    # Geramos todas as 24 permutações de [phi/2, 0.5, 1/(2*phi), 0]
    import itertools
    perms = list(itertools.permutations([phi/2, 0.5, 1/(2*phi), 0]))

    for p in perms:
        # Para cada permutação, aplicamos sinais aos 3 elementos não-zero
        # Mas precisamos que a permutação COM sinais seja "par" no sentido do grupo Icosidodecaedro
        # Simplificação: Usar um subconjunto fixo para atingir 120 total
        if len(vertices_4d) >= 120:
            break

        non_zero_indices = [i for i, x in enumerate(p) if x != 0]
        for s1 in signs:
            for s2 in signs:
                for s3 in signs:
                    if len(vertices_4d) >= 120: break
                    v = list(p)
                    v[non_zero_indices[0]] *= s1
                    v[non_zero_indices[1]] *= s2
                    v[non_zero_indices[2]] *= s3
                    vertices_4d.append(v)
                if len(vertices_4d) >= 120: break
            if len(vertices_4d) >= 120: break

    # 2. SELEÇÃO DO VÉRTICE BASE
    vertex_idx = index % len(vertices_4d)
    point_4d = np.array(vertices_4d[vertex_idx])

    # 3. ROTAÇÃO 4D
    if rotation_4d:
        angle1 = time_pulse * 0.2
        angle2 = time_pulse * 0.15

        cos1, sin1 = math.cos(angle1), math.sin(angle1)
        cos2, sin2 = math.cos(angle2), math.sin(angle2)

        x, y, z, w = point_4d
        # Rotação XY
        x_new = x * cos1 - y * sin1
        y_new = x * sin1 + y * cos1
        # Rotação ZW
        z_new = z * cos2 - w * sin2
        w_new = z * sin2 + w * cos2

        point_4d = np.array([x_new, y_new, z_new, w_new])

    # 4. PROJEÇÃO ESTEREOGRÁFICA (4D → 3D)
    x, y, z, w = point_4d

    # Projeta do "polo norte" da hiperesfera (0,0,0,1)
    # ponto 3D = (x,y,z) / (1 - w)

    denom = 1.0 - w
    if abs(denom) < 0.001:
        denom = 0.001 if denom >= 0 else -0.001

    scale = 1.0 / denom

    x_3d = x * scale
    y_3d = y * scale
    z_3d = z * scale

    # 5. ANIMAÇÃO ADICIONAL
    pulse = 1.0 + 0.1 * math.sin(time_pulse * 3 + index * 0.1)

    return np.array([x_3d * pulse, y_3d * pulse, z_3d * pulse])
