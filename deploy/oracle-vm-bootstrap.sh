#!/usr/bin/env bash
# One-time setup for a fresh Ubuntu 24.04 VM on Oracle Cloud.
# Run from your workstation:
#   ssh ubuntu@YOUR_VM_IP 'bash -s' < deploy/oracle-vm-bootstrap.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/multimediary}"
DEPLOY_USER="${DEPLOY_USER:-${SUDO_USER:-$(id -un)}}"
SWAP_SIZE="${SWAP_SIZE:-2G}"

echo "==> Installing Docker..."
sudo apt-get update -qq
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update -qq
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
sudo usermod -aG docker "${DEPLOY_USER}"

echo "==> Creating ${SWAP_SIZE} swap file..."
if [ ! -f /swapfile ]; then
  sudo fallocate -l "${SWAP_SIZE}" /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
  # Only swap under real memory pressure
  echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
  sudo sysctl -p
  echo "Swap enabled: $(free -h | grep Swap)"
else
  echo "Swap already exists, skipping."
fi

echo "==> Opening firewall ports 80 and 443..."
if command -v ufw >/dev/null 2>&1; then
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw allow 443/udp
  # Reload only if ufw is already active — don't force-enable it
  if sudo ufw status | grep -q "Status: active"; then
    sudo ufw reload
  fi
  echo "ufw: ports 80 and 443 added."
else
  echo "ufw not found — open ports 80/443 via Oracle Cloud Security Lists."
fi

echo "==> Creating application directory ${APP_DIR}..."
sudo install -d -m 755 -o "${DEPLOY_USER}" -g "${DEPLOY_USER}" "${APP_DIR}"

echo ""
echo "Bootstrap complete."
echo ""
echo "IMPORTANT — Oracle Cloud Security List:"
echo "  Add ingress rules for ports 80 (TCP) and 443 (TCP + UDP) in the"
echo "  Oracle Cloud Console → Networking → Virtual Cloud Networks → Security Lists."
echo ""
echo "Next steps:"
echo "  1. Log out and back in so '${DEPLOY_USER}' can use Docker without sudo."
echo "  2. Set GitHub Environment secrets (see deploy/README.md)."
echo "  3. Push to the deploy branch or trigger the workflow manually."
