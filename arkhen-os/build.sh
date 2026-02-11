#!/bin/bash
# arkhen-os/build.sh
set -e

echo "🧬 CONSTRUINDO ARKHE(N) OS CONTAINER"
echo "========================================"

if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado."
    exit 1
fi

if [ ! -d "shared/biogenesis" ]; then
    echo "⚠️  Diretório shared/biogenesis não encontrado."
    exit 1
fi

echo "🔨 Construindo imagem Docker..."
docker build -t arkhen-os:latest .

if ! docker network ls | grep -q arkhe-net; then
    echo "🌐 Criando rede Docker 'arkhe-net'..."
    docker network create arkhe-net
fi

echo ""
echo "✅ CONSTRUÇÃO CONCLUÍDA!"
