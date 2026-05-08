#!/bin/bash
# setup-latex.sh — installs pdflatex + all packages needed by ApplyKit
# Run once after installing BasicTeX: brew install --cask basictex

set -e
BOLD='\033[1m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

TLMGR="/Library/TeX/texbin/tlmgr"

if ! command -v "$TLMGR" &>/dev/null; then
  echo -e "${RED}pdflatex not found.${NC} Install BasicTeX first:"
  echo "  /opt/homebrew/bin/brew install --cask basictex"
  echo "Then re-run this script."
  exit 1
fi

echo -e "${BOLD}Updating tlmgr...${NC}"
sudo "$TLMGR" update --self

echo -e "${BOLD}Installing LaTeX packages...${NC}"
sudo "$TLMGR" install \
  preprint tools titlesec marvosym enumitem fancyhdr \
  babel-english charter cormorantgaramond collection-latexextra \
  collection-fontsrecommended

echo -e "${GREEN}✓ LaTeX setup complete. pdflatex is ready.${NC}"
