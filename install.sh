#!/bin/bash
# ApplyKit installer — sets up the resume auto-move LaunchAgent on macOS

set -e

BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${BOLD}╔══════════════════════════════════════╗${NC}"
echo -e "${BOLD}║         ApplyKit Installer           ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════╝${NC}"
echo ""

USERNAME=$(whoami)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Prompt for watch directory
echo -e "${BOLD}Where should ApplyKit watch for new resumes?${NC}"
read -p "  Watch directory [default: ~/Downloads]: " WATCH_DIR
WATCH_DIR="${WATCH_DIR:-$HOME/Downloads}"
WATCH_DIR="${WATCH_DIR/#\~/$HOME}"

# Prompt for destination directory
echo ""
echo -e "${BOLD}Where should tailored resumes be moved to?${NC}"
read -p "  Destination directory [default: ~/Documents/JobApps]: " DEST_DIR
DEST_DIR="${DEST_DIR:-$HOME/Documents/JobApps}"
DEST_DIR="${DEST_DIR/#\~/$HOME}"

# Prompt for file pattern
echo ""
echo -e "${BOLD}What filename pattern should be moved? (supports * wildcards)${NC}"
read -p "  Pattern [default: *_Resume_*.pdf]: " PATTERN
PATTERN="${PATTERN:-*_Resume_*.pdf}"

echo ""
echo -e "${BOLD}Summary:${NC}"
echo "  Watch:       $WATCH_DIR"
echo "  Destination: $DEST_DIR"
echo "  Pattern:     $PATTERN"
echo "  Username:    $USERNAME"
echo ""
read -p "Looks good? (y/n): " CONFIRM
if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
    echo "Aborted."
    exit 0
fi

echo ""
echo -e "  ${GREEN}✓${NC} Creating destination folder..."
mkdir -p "$DEST_DIR"

echo -e "  ${GREEN}✓${NC} Installing move script to ~/"
sed -e "s|{{WATCH_DIR}}|$WATCH_DIR|g" \
    -e "s|{{DEST_DIR}}|$DEST_DIR|g" \
    -e "s|{{PATTERN}}|$PATTERN|g" \
    "$SCRIPT_DIR/scripts/move-resumes.sh" > "$HOME/applykit-move.sh"
chmod +x "$HOME/applykit-move.sh"

echo -e "  ${GREEN}✓${NC} Installing LaunchAgent..."
PLIST_DEST="$HOME/Library/LaunchAgents/com.applykit.move-resumes.plist"
mkdir -p "$HOME/Library/LaunchAgents"
sed -e "s|{{USERNAME}}|$USERNAME|g" \
    "$SCRIPT_DIR/scripts/com.applykit.move-resumes.plist" > "$PLIST_DEST"

# Unload if already loaded
launchctl unload "$PLIST_DEST" 2>/dev/null || true

echo -e "  ${GREEN}✓${NC} Loading LaunchAgent..."
launchctl load "$PLIST_DEST"

sleep 1
if launchctl list | grep -q "com.applykit.move-resumes"; then
    echo -e "  ${GREEN}✓${NC} LaunchAgent running."
else
    echo -e "  ${RED}✗${NC} LaunchAgent failed to start. Check /tmp/applykit-move.err"
    exit 1
fi

echo ""
echo -e "${BOLD}${GREEN}ApplyKit is installed!${NC}"
echo ""
echo -e "${YELLOW}⚠️  One manual step required (macOS privacy):${NC}"
echo "   1. Open System Settings → Privacy & Security → Full Disk Access"
echo "   2. Click + and add /bin/bash"
echo "   3. Make sure the toggle is ON"
echo ""
echo "   Without this, the watcher can't read your Downloads folder."
echo ""
echo -e "${BOLD}Log file:${NC} ~/Library/Logs/applykit-move.log"
echo -e "${BOLD}Uninstall:${NC} bash $SCRIPT_DIR/uninstall.sh"
echo ""
