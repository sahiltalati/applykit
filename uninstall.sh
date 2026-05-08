#!/bin/bash
# ApplyKit uninstaller

set -e

PLIST="$HOME/Library/LaunchAgents/com.applykit.move-resumes.plist"

echo "Uninstalling ApplyKit..."

launchctl unload "$PLIST" 2>/dev/null && echo "  ✓ LaunchAgent unloaded" || echo "  - LaunchAgent was not loaded"
rm -f "$PLIST"        && echo "  ✓ Removed plist"
rm -f "$HOME/applykit-move.sh" && echo "  ✓ Removed move script"

echo ""
echo "ApplyKit uninstalled. Your JobApps folder and log file were left intact."
echo "To remove Full Disk Access for bash: System Settings → Privacy & Security → Full Disk Access"
