# resume-tailor

Tailor the user's resume to a job description. Surgically edit bullet text and ordering to mirror the job description's language, reorder bullets for relevance, compile a PDF named after the company, and save it to ~/Documents/JobApps/.

Trigger on: "tailor my resume", "apply for this job", "optimize my resume for [Company]", or any pasted/linked job description.

---

## Setup (first time only)

Place your base resume at `~/.applykit/resume.tex`:

```bash
mkdir -p ~/.applykit
cp /path/to/your/resume.tex ~/.applykit/resume.tex
```

If pdflatex is not installed:
```bash
# macOS
brew install --cask basictex
# Linux
sudo apt install texlive-latex-extra
```

> pdflatex may not be on your PATH after install — the skill detects it automatically.

---

## Tailoring Rules

**DO:** Rephrase bullets to mirror JD vocabulary (only where experience genuinely matches), reorder bullets within roles (most relevant first), bold JD-matched keywords, reorder Technical Skills to lead with JD stack.

**DO NOT:** Invent experience, metrics, or technologies. Change dates, titles, company names, or numeric metrics. Drop any section.

---

## Process — 3 tool calls total, no exceptions

The base resume is already in your context (read from ~/.applykit/resume.tex or embedded in this skill). Do NOT write the base to disk and then edit it — that wastes 4-6 tool calls. Think through all changes mentally, then write the final version in one shot.

### Step 1 — Think (no tool call)

Parse the JD in your head. Extract company name, hard requirements, nice-to-haves, key vocabulary. Map each JD keyword to the bullet(s) in the base resume that genuinely match. Decide: rephrase, bold, reorder, or skip.

If the JD is a URL, fetch it first (only allowed extra tool call).

CompanyName: remove spaces and punctuation, use well-known name (e.g. "Goldman Sachs" -> "GoldmanSachs").

### Step 2 — Write final .tex in one shot (1 Write call)

Write the complete tailored LaTeX to /tmp/working-resume.tex in a single Write call. Apply all changes as you write:
- Rephrase \resumeItem text to mirror JD vocabulary where genuine
- Reorder \resumeItem lines within each role — most JD-relevant first
- Add/remove \textbf{} on JD-matched keywords
- Reorder Technical Skills so JD stack appears first
- Never touch the preamble, section headings, or custom command definitions
- Escape special chars: & -> \&, % -> \%, $ -> \$, _ -> \_

### Step 3 — Compile and save (1 Bash call)

```bash
PDFLATEX=$(which pdflatex 2>/dev/null || find /usr /opt /Library /home -name pdflatex 2>/dev/null | head -1) && mkdir -p "$HOME/Documents/JobApps" && cd /tmp && $PDFLATEX -interaction=nonstopmode -halt-on-error working-resume.tex && cp /tmp/working-resume.pdf "$HOME/Documents/JobApps/YourName_Resume_CompanyName.pdf"
```

Replace YourName and CompanyName before running.

If compilation fails, read /tmp/working-resume.log, fix /tmp/working-resume.tex, rerun. Common causes: unescaped & % $ _, unbalanced braces.

If output exceeds one page, tighten the longest bullets. Do not change fonts or margins.

### Done — report to user

- Top 3-5 keywords emphasized
- What was reordered
- Any JD requirements missing from the resume (gaps for cover letter)
