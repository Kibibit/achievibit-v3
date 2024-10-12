# .devcontainer/Dockerfile
FROM node:20-slim

# Install pnpm globally
RUN npm install -g pnpm

# Set the pnpm store path inside the container
ENV PNPM_HOME=/pnpm-store
ENV PNPM_STORE_PATH=/pnpm-store
RUN mkdir -p /pnpm-store

# Install additional dependencies
# 1. git: required for pnpm to install packages from git repositories
# 2. curl: required for pnpm to install packages from URLs
# 3. build-essential: required for building native addons
# 4. python3: required for building native addons
# 5. zsh and oh-my-zsh: required for the terminal to work properly
# 6. locales: required for character encoding support
# 7. procps: provides ps command
RUN apt-get update && apt-get install -y \
    git \
    curl \
    build-essential \
    python3 \
    zsh \
    locales \
    procps \
    && rm -rf /var/lib/apt/lists/*

# Generate and configure locale
RUN echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && \
    locale-gen en_US.UTF-8

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Install oh-my-zsh
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

# Set up zsh as default shell
ENV SHELL /bin/zsh
SHELL ["/bin/zsh", "-c"]

# download agnosterzak theme from https://raw.githubusercontent.com/zakaziko99/agnosterzak-ohmyzsh-theme/master/agnosterzak.zsh-theme
# into $ZSH_CUSTOM/themes/
RUN mkdir -p /root/.oh-my-zsh/themes/ && \
    curl -o /root/.oh-my-zsh/themes/agnosterzak.zsh-theme https://raw.githubusercontent.com/zakaziko99/agnosterzak-ohmyzsh-theme/master/agnosterzak.zsh-theme

# set the theme to agnosterzak
RUN sed -i 's/ZSH_THEME="robbyrussell"/ZSH_THEME="agnosterzak"/' ~/.zshrc

# Set the working directory
WORKDIR /workspace

# Copy package files to prevent re-downloading dependencies if they haven't changed
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Expose the application's port
EXPOSE 3003

# Default command
CMD ["sleep", "infinity"]
