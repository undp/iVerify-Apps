#!/bin/bash
# Configura memória compartilhada para o Arkhe(n) OS

SHM_PATH="/dev/shm/arkhe_field"
SHM_SIZE=$((100 * 100 * 100 * 4))

echo "🧠 Configurando memória compartilhada Arkhe(n)..."
mkdir -p /dev/shm
dd if=/dev/zero of=$SHM_PATH bs=1 count=0 seek=$SHM_SIZE 2>/dev/null
chmod 666 $SHM_PATH
echo "✅ Memória compartilhada configurada."
