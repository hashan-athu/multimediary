#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# setup-oracle-vm.sh
# One-time bootstrap script for the Oracle VM that will host the Rails backend.
#
# Run as the oracle default user (opc) with sudo privileges:
#   chmod +x setup-oracle-vm.sh && ./setup-oracle-vm.sh
#
# Tested on: Oracle Linux 8/9 (the default Oracle Cloud free-tier image)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

APP_DIR="/opt/multimediary"
DOCKER_COMPOSE_VERSION="v2.27.0"

echo "════════════════════════════════════════════════════════"
echo " Multimediary — Oracle VM Setup"
echo "════════════════════════════════════════════════════════"

# ── 1. System update ──────────────────────────────────────────────────────────
echo ""
echo "▶ [1/6] Updating system packages..."
sudo dnf update -y --quiet

# ── 2. Install Docker ─────────────────────────────────────────────────────────
echo ""
echo "▶ [2/6] Installing Docker..."
sudo dnf config-manager --add-repo https://download.docker.com/linux/rhel/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo systemctl enable --now docker

# Add current user to docker group (avoids sudo for docker commands)
sudo usermod -aG docker "${USER}"
echo "   ✓ Docker installed. NOTE: log out and back in for group changes to take effect."

# ── 3. Open firewall ports ────────────────────────────────────────────────────
echo ""
echo "▶ [3/6] Configuring firewall (ports 22, 80, 443)..."
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
echo "   ✓ Firewall rules applied."
echo ""
echo "   ⚠  IMPORTANT: Also open these ports in the Oracle Cloud Security List:"
echo "      Go to: OCI Console → Networking → VCN → Security List → Add Ingress Rules"
echo "      Ingress rules needed:"
echo "        • TCP  80  (HTTP)"
echo "        • TCP  443 (HTTPS)"
echo "        • TCP  22  (SSH — should already exist)"

# ── 4. Create app directory ───────────────────────────────────────────────────
echo ""
echo "▶ [4/6] Creating app directory at ${APP_DIR}..."
sudo mkdir -p "${APP_DIR}"
sudo chown "${USER}:${USER}" "${APP_DIR}"

# ── 5. Create .env.production from example ───────────────────────────────────
echo ""
echo "▶ [5/6] Creating .env.production template..."
cat > "${APP_DIR}/.env.production.example" << 'EOF'
# See deploy/.env.production.example in the repo for the full reference.
RAILS_MASTER_KEY=
POSTGRES_USER=multimediary
POSTGRES_PASSWORD=change_me_to_a_strong_password
POSTGRES_DB=multimediary_production
POSTGRES_CACHE_DB=multimediary_cache
POSTGRES_QUEUE_DB=multimediary_queue
POSTGRES_CABLE_DB=multimediary_cable
TMDB_API_KEY=
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-admin.vercel.app
EOF

if [ ! -f "${APP_DIR}/.env.production" ]; then
  cp "${APP_DIR}/.env.production.example" "${APP_DIR}/.env.production"
  echo "   ✓ Created ${APP_DIR}/.env.production — EDIT THIS FILE before starting containers!"
else
  echo "   ✓ ${APP_DIR}/.env.production already exists, skipping."
fi

# ── 6. GHCR authentication helper ────────────────────────────────────────────
echo ""
echo "▶ [6/6] Creating GHCR login helper script..."
cat > "${APP_DIR}/ghcr-login.sh" << 'SCRIPT'
#!/usr/bin/env bash
# Usage: ./ghcr-login.sh <github-username> <personal-access-token>
# PAT needs: read:packages scope
set -e
echo "$2" | docker login ghcr.io -u "$1" --password-stdin
echo "✓ Logged in to ghcr.io"
SCRIPT
chmod +x "${APP_DIR}/ghcr-login.sh"

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo "════════════════════════════════════════════════════════"
echo " ✅  Setup complete! Next steps:"
echo "════════════════════════════════════════════════════════"
echo ""
echo "  1. Log out and back in (or run: newgrp docker) to apply docker group"
echo ""
echo "  2. Edit your environment file:"
echo "     nano ${APP_DIR}/.env.production"
echo ""
echo "  3. Add GitHub Secrets to your repo:"
echo "     ORACLE_VM_HOST    → this VM's public IP"
echo "     ORACLE_VM_USER    → ${USER}"
echo "     ORACLE_VM_SSH_KEY → your private SSH key (PEM)"
echo "     RAILS_MASTER_KEY  → contents of backend/config/master.key"
echo ""
echo "  4. Make sure the GHCR package visibility is set to 'public'"
echo "     (or grant your repo 'read' access to the package in GitHub settings)"
echo ""
echo "  5. Push to the 'dev' branch — GitHub Actions will handle the rest!"
echo ""
