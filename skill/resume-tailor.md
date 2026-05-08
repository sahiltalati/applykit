# resume-tailor

Tailor the user's resume to a job description. Surgically edit bullet text and ordering to mirror the job description's language, reorder bullets for relevance, compile a PDF named after the company, and save it to ~/Documents/JobApps/.

Trigger on: "tailor my resume", "apply for this job", "optimize my resume for [Company]", or any pasted/linked job description.

---

## Setup (first time only)

Place your base resume at `~/.applykit/resume.tex` (LaTeX) or `~/.applykit/resume.md` (Markdown).

```bash
mkdir -p ~/.applykit
cp /path/to/your/resume.tex ~/.applykit/resume.tex
```

If pdflatex is not installed:
```bash
brew install --cask basictex
bash ~/path/to/applykit/scripts/setup-latex.sh
```

---

## Inputs / Outputs

**Input:** A job description — pasted text, a URL, or an attached file.
**Output:** A tailored PDF saved to `~/Documents/JobApps/YourName_Resume_CompanyName.pdf`

---

## Tailoring Philosophy: Moderate

**DO:**
- Rephrase bullet text to mirror JD vocabulary (only where experience genuinely matches)
- Reorder bullets within each role — most JD-relevant first
- Reorder projects/sections to surface the most relevant items
- Bold keywords that match the JD
- Reorder Technical Skills lines to lead with JD-mentioned technologies

**DO NOT:**
- Invent experience, technologies, metrics, or outcomes
- Change company names, job titles, dates, or numeric metrics
- Drop entire sections
- Add buzzwords that don't map to real experience in the resume

---

## Process

### Step 1 — Read the base resume
Read `~/.applykit/resume.tex` (or `~/.applykit/resume.md`). Write the content to `/tmp/applykit-build/working-resume.tex` as your starting point.

### Step 2 — Parse the job description
If a URL is provided, fetch it first. Extract:
- Company name (sanitize for filename: remove spaces/punctuation, e.g. "Goldman Sachs" → "GoldmanSachs")
- Role title
- Hard requirements — must-have technologies, languages, frameworks
- Nice-to-haves
- Repeated themes and exact vocabulary (ATS matches strings)

If the company name is unclear, ask the user once before proceeding.

### Step 3 — Map JD keywords to resume content
For each significant JD keyword, find the bullet(s) in the resume that demonstrate genuine experience with it. Build a map of keyword → bullet → action (rephrase, bold, reorder, skip if no real match).

### Step 4 — Apply edits
Edit `/tmp/applykit-build/working-resume.tex`:
1. Rephrase `\resumeItem` content to use JD vocabulary where genuine
2. Reorder `\resumeItem` lines within each role — most JD-relevant first
3. Adjust `\textbf{}` emphasis to bold JD-relevant keywords
4. Reorder Technical Skills items so JD stack appears first
5. Re-read end-to-end: verify nothing fabricated, all metrics unchanged, all braces balanced

### Step 5 — Compile
```bash
mkdir -p /tmp/applykit-build
cd /tmp/applykit-build
pdflatex -interaction=nonstopmode -halt-on-error working-resume.tex
```

If compilation fails, read the `.log` file. Common fixes:
- Unescaped special characters (`&` → `\&`, `%` → `\%`, `$` → `\$`)
- Unbalanced braces
- Missing package → install with `sudo /Library/TeX/texbin/tlmgr install <package>`

If output exceeds one page, tighten the longest bullets. Do not change fonts or margins.

### Step 6 — Save
```bash
mkdir -p ~/Documents/JobApps
cp /tmp/applykit-build/working-resume.pdf ~/Documents/JobApps/YourName_Resume_CompanyName.pdf
```

Replace `YourName` with the name from the resume header. Replace `CompanyName` with the sanitized company name.

### Step 7 — Report
Summarize:
- Top 3–5 keywords/themes emphasized
- What was reordered
- Any JD requirements not addressable from the base resume (so the user can address them in a cover letter)

---

## Rules
- Never fabricate. If a JD demands Rust and there's no Rust experience, note it — don't add it.
- Never change dates, titles, company names, or numeric metrics.
- Always compile and verify before declaring done.
- Filename format: `YourName_Resume_CompanyName.pdf` — no spaces, no punctuation.
