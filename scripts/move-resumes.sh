#!/bin/bash
# move-resumes.sh — watches WATCH_DIR for files matching PATTERN and moves them to DEST_DIR

WATCH_DIR="{{WATCH_DIR}}"
DEST_DIR="{{DEST_DIR}}"
PATTERN="{{PATTERN}}"
LOG="$HOME/Library/Logs/applykit-move.log"

mkdir -p "$DEST_DIR"
mkdir -p "$(dirname "$LOG")"

echo "$(date '+%Y-%m-%d %H:%M:%S') ApplyKit watcher started. Watching $WATCH_DIR for $PATTERN" >> "$LOG"

while true; do
    find "$WATCH_DIR" -maxdepth 1 -type f -name "$PATTERN" -print0 2>>"$LOG" | \
    while IFS= read -r -d '' file; do
        filename=$(basename "$file")
        if [[ ! -f "${file}.crdownload" && ! -f "${file}.download" && ! -f "${file}.part" ]]; then
            mv "$file" "$DEST_DIR/$filename" 2>>"$LOG"
            echo "$(date '+%Y-%m-%d %H:%M:%S') Moved: $filename → $DEST_DIR" >> "$LOG"
        fi
    done
    sleep 5
done
