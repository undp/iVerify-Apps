#!/usr/bin/env python3
# /opt/arkhe/bin/arkhe-daemon.py
"""
ARKHE DAEMON v1.0
Orquestrador principal do sistema Bio-Gênese com memória compartilhada
"""

import sys
import os
import time
import threading
import mmap
import struct
import numpy as np
from pathlib import Path

# Configurações do sistema
SHM_PATH = "/dev/shm/arkhe_field"
SHM_SIZE = 100 * 100 * 100 * 4  # 100x100x100 floats

class SharedField:
    def __init__(self):
        self.shm_path = SHM_PATH
        self.size = SHM_SIZE

    def initialize(self):
        try:
            shm_fd = os.open(self.shm_path, os.O_RDWR)
        except FileNotFoundError:
            shm_fd = os.open(self.shm_path, os.O_CREAT | os.O_RDWR, 0o666)
            os.ftruncate(shm_fd, self.size)

        self.mmap = mmap.mmap(shm_fd, self.size, mmap.MAP_SHARED, mmap.PROT_WRITE | mmap.PROT_READ)
        self.field = np.frombuffer(self.mmap, dtype=np.float32).reshape((100, 100, 100))
        print(f"🌌 Campo morfogenético inicializado em {self.shm_path}")

    def inject_signal(self, x: int, y: int, z: int, strength: float):
        if 0 <= x < 100 and 0 <= y < 100 and 0 <= z < 100:
            self.field[x, y, z] += strength

class ArkheDaemon:
    def __init__(self):
        self.running = False
        self.field = SharedField()
        self.simulation = None
        self.lock = threading.Lock()
        self.mcp_socket = "/run/mcp-server/mcp.sock"

    def start(self):
        print("🚀 Iniciando Arkhe Daemon v1.0")
        self.field.initialize()

        try:
            sys.path.insert(0, "/opt/arkhe/shared/biogenesis")
            from core.particle_system import BioGenesisEngine
            self.simulation = BioGenesisEngine(num_agents=200)
            print(f"✅ Bio-Gênese carregado")
        except ImportError as e:
            print(f"⚠️  Bio-Gênese não encontrado: {e}")
            self.simulation = None

        self.running = True
        self.sim_thread = threading.Thread(target=self._simulation_loop, daemon=True)
        self.sim_thread.start()

        try:
            while self.running:
                time.sleep(1)
        except KeyboardInterrupt:
            self.stop()

    def _simulation_loop(self):
        if not self.simulation: return
        while self.running:
            with self.lock:
                self.simulation.update(dt=0.1)
                # Sync logic if needed, but here we assume the engine uses its own field
                # The user's code had a sync step:
                # np.copyto(self.field.field, self.simulation.field.grid)
                if hasattr(self.simulation, 'field') and hasattr(self.simulation.field, 'grid'):
                     np.copyto(self.field.field, self.simulation.field.grid)
            time.sleep(0.1)

    def stop(self):
        self.running = False
        print("✅ Daemon parado.")

if __name__ == "__main__":
    daemon = ArkheDaemon()
    daemon.start()
