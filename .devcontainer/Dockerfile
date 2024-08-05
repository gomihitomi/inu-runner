FROM node:22.5.1-bookworm-slim

ARG USERNAME=node

RUN apt-get update \
    && apt-get install -y sudo git lsof curl procps \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

USER $USERNAME

WORKDIR /workspace
