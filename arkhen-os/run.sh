#!/bin/bash
# arkhen-os/run.sh
set -e

echo "🚀 INICIANDO ARKHE(N) OS CONTAINER"
echo "==================================="

docker stop arkhe-os 2>/dev/null || true
docker rm arkhe-os 2>/dev/null || true

docker run -d \
  --name arkhe-os \
  --hostname arkhen \
  --cap-add=SYS_ADMIN \
  --cap-add=IPC_LOCK \
  --cap-add=SYS_PTRACE \
  --security-opt seccomp=unconfined \
  --security-opt apparmor=unconfined \
  --tmpfs /tmp:rw,noexec,nosuid,size=2G \
  --tmpfs /run:rw,noexec,nosuid,size=1G \
  --tmpfs /run/lock:rw,noexec,nosuid,size=256M \
  -v /sys/fs/cgroup:/sys/fs/cgroup:ro \
  -v "$(pwd)/shared/biogenesis:/opt/arkhe/shared/biogenesis" \
  -v "$(pwd)/shared/logs:/opt/arkhe/logs" \
  -v arkhe-shm:/dev/shm \
  -p 8080:8080 \
  --restart unless-stopped \
  arkhen-os:latest

echo "✅ ARKHE(N) OS INICIADO!"
