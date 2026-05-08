# resume-tailor

Tailor the user's resume to a job description. Paste a job description or job URL and this skill will surgically edit the resume to mirror the role's language, reorder bullets for relevance, and compile a new PDF named after the company.

## Setup (first time only)

1. Copy your resume into `~/.applykit/resume.tex` (LaTeX) or `~/.applykit/resume.md` (Markdown).
2. That's it — the skill reads from that file automatically.

## Trigger phrases

- "tailor my resume to this JD"
- "apply for this job" + paste or URL
- "optimize my resume for [Company]"

## What it does

1. Reads your base resume from `~/.applykit/resume.tex` (or `.md`)
2. Analyzes the job description for: required skills, preferred skills, keywords, tone
3. Edits bullet points to mirror the JD's language — without fabricating experience
4. Reorders bullets within each role to lead with the most relevant ones
5. Compiles to PDF with `pdflatex` (LaTeX) or saves as formatted PDF (Markdown)
6. Saves the output as `~/Documents/JobApps/[YourName]_Resume_[Company].pdf`

## Rules

- Never fabricate experience, skills, or credentials
- Only reword and reorder existing content
- Keep all dates, titles, and company names exactly as-is
- Filename format: `[YourName]_Resume_[CompanyName].pdf` — no spaces
- If pdflatex is not installed, tell the user: `brew install --cask basictex`

## Example

User: "Tailor my resume for this role: [pastes JD]"