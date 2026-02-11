# arkhen-os/Dockerfile
# Imagem base: Arch Linux com systemd em container
FROM archlinux:base-devel

# Configuração básica do sistema
RUN echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && \
    locale-gen && \
    echo "LANG=en_US.UTF-8" > /etc/locale.conf

# Instalação MÍNIMA de pacotes (kernel do host é usado)
RUN pacman -Syu --noconfirm --needed \
    base \
    systemd \
    systemd-sysvcompat \
    python \
    python-numpy \
    python-pip \
    python-psutil \
    git \
    sudo \
    nano \
    htop \
    iproute2 \
    net-tools \
    && pacman -Scc --noconfirm

# Instala servidor MCP Python
RUN pip install --no-cache-dir mcp==0.3.0

# Configura usuário não-root 'arkhe'
RUN useradd -m -G wheel -s /bin/bash arkhe && \
    echo "arkhe:arkhe" | chpasswd && \
    echo "%wheel ALL=(ALL) NOPASSWD: /usr/bin/systemctl, /usr/bin/ip, /usr/bin/mount" >> /etc/sudoers

# Cria estrutura de diretórios
RUN mkdir -p /opt/arkhe/{bin,lib,shared,logs} && \
    mkdir -p /etc/arkhe/ && \
    mkdir -p /run/mcp-server/ && \
    chown -R arkhe:arkhe /opt/arkhe /run/mcp-server

# Copia configurações do sistema
COPY config/arkhe-daemon.service /etc/systemd/system/
COPY config/mcp-server.service /etc/systemd/system/
COPY config/sysctl-arkhe.conf /etc/sysctl.d/
COPY scripts/setup-shared-memory.sh /opt/arkhe/bin/

# Scripts de inicialização
COPY scripts/install-dependencies.sh /opt/arkhe/bin/
RUN chmod +x /opt/arkhe/bin/*.sh

# Habilita serviços
RUN systemctl enable arkhe-daemon

# Configura systemd para container
RUN systemctl set-default multi-user.target && \
    systemctl mask systemd-udev-trigger.service systemd-udevd.service

# Expõe socket MCP
EXPOSE 8080/tcp
VOLUME ["/opt/arkhe/shared", "/run/mcp-server"]

# Variáveis de ambiente
ENV PYTHONUNBUFFERED=1
ENV PYGLET_HEADLESS=1
ENV MCP_SOCKET_PATH=/run/mcp-server/mcp.sock
ENV ARKHE_FIELD_SHM=/dev/shm/arkhe_field

# PID 1
STOPSIGNAL SIGRTMIN+3
CMD ["/usr/lib/systemd/systemd", "--log-level=info", "--log-target=journal"]
