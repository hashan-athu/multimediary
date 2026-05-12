#!/usr/bin/env bash
set -euo pipefail

# Run once on a fresh Oracle Linux VM before using the GitHub Actions deploy.
# Example:
#   ssh opc@YOUR_VM_IP 'bash -s' < deploy/oracle-vm-bootstrap.sh

APP_DIR="${APP_DIR:-/opt/multimediary}"
DEPLOY_USER="${DEPLOY_USER:-${SUDO_USER:-$(id -un)}}"

if ! command -v sudo >/dev/null 2>&1; then
  echo "sudo is required for bootstrap." >&2
  exit 1
fi

sudo dnf install -y dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo systemctl enable --now docker
sudo usermod -aG docker "${DEPLOY_USER}"
sudo install -d -m 755 -o "${DEPLOY_USER}" -g "${DEPLOY_USER}" "${APP_DIR}"

echo "Bootstrap complete."
echo "Log out and back in so ${DEPLOY_USER} can use Docker without sudo."
echo "Then create ${APP_DIR}/.env.production from deploy/.env.production.example."
