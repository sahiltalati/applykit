# ApplyKit 🚀

**The open-source job application OS.**

Stop doing these three things manually:
- Rewriting your resume for every role
- Digging through Downloads for the right PDF
- Trying to remember which companies you applied to

ApplyKit automates all of it.

---

## How it works

```
1. Find a job posting
2. Tell Claude Code: "Tailor my resume for this role: [paste JD or URL]"
3. Claude edits your resume to match the JD → compiles a PDF
4. The PDF auto-moves from ~/Downloads to ~/Documents/JobApps instantly
5. You submit the application
6. Click the ApplyKit Chrome extension → one click logs it to Google Sheets
```

---

## The Three Components

| Component | What it does | Platform |
|---|---|---|
| **Resume Tailor** | Claude Code skill — tailors your resume to any JD | Mac / Windows / Linux |
| **Auto-Move** | macOS background script — files resume PDFs automatically | Mac only |
| **App Tracker** | Chrome extension — logs applications to Google Sheets | Any OS + Chrome |

---

## Installation

### Prerequisites
- [Claude Code](https://claude.ai/code) (free)
- macOS Ventura or later (for Auto-Move)
- Google Chrome (for App Tracker)

---

### 1. Clone the repo

```bash
git clone https://github.com/sahiltalati/applykit.git
cd applykit
```

---

### 2. Auto-Move Script (macOS)

Run the interactive installer:

```bash
bash install.sh
```

It will ask for:
- **Watch directory** — where to look for new resumes (default: `~/Downloads`)
- **Destination** — where to move them (default: `~/Documents/JobApps`)
- **Filename pattern** — which files to move (default: `*_Resume_*.pdf`)

**One manual step — grant bash Full Disk Access:**

> System Settings → Privacy & Security → Full Disk Access → `+` → navigate to `/bin/bash` → Add → toggle ON

This is required on macOS Ventura+ for background scripts to read the Downloads folder. You only do this once.

---

### 3. Resume Tailor Skill (Claude Code)

**Place your resume:**

```bash
mkdir -p ~/.applykit
cp /path/to/your/resume.tex ~/.applykit/resume.tex
```

Supports `.tex` (LaTeX) or `.md` (Markdown).

**Install pdflatex** (required for LaTeX resumes):

```bash
/opt/homebrew/bin/brew install --cask basictex
sudo bash scripts/setup-latex.sh
```

**Install the skill:**

```bash
mkdir -p ~/.claude/skills
cp skill/resume-tailor.md ~/.claude/skills/resume-tailor.md
```

**Use it in Claude Code:**

```
Tailor my resume for this role: [paste job description or URL]
```

The tailored PDF is saved to `~/Documents/JobApps/YourName_Resume_CompanyName.pdf` automatically.

---

### 4. Chrome Extension (App Tracker)

**Load the extension:**

1. Open Chrome → `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked** → select the `extension/` folder

**Set up Google Sheets:**

1. Create a new Google Sheet
2. Open **Extensions → Apps Script**
3. Delete the default code, paste the contents of `sheets/apps-script.js`
4. Click **Save**, then **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy → Authorize access → Allow**
6. Copy the Web app URL

**Connect the extension:**

1. Click the ApplyKit briefcase icon in Chrome toolbar
2. Click **⚙️ Settings**
3. Paste the Web app URL → **Save**

---

## Usage

### Tailoring a resume

In Claude Code:

```
Tailor my resume for this role: https://jobs.example.com/software-engineer
```

Or paste the full job description directly. Claude will:
- Mirror the JD's keywords and vocabulary
- Reorder bullets to lead with the most relevant experience
- Compile and save the PDF to `~/Documents/JobApps/`

The Auto-Move script will handle filing if the PDF lands in Downloads first.

### Logging an application

After submitting an application:
1. Click the **ApplyKit** icon in the Chrome toolbar
2. Company, Role, Location, and URL are auto-filled from the page
3. Click **Log Application**

Your Google Sheet gets a new row:

| Date Applied | Company | Role | Location | Status | Job URL | Notes | Logged At |
|---|---|---|---|---|---|---|---|
| 2026-05-08 | Intact FC | Software Developer I | Toronto, ON | Applied | https://... | | 2026-05-08 10:32 |

### Supported job sites (auto-detection)

LinkedIn · Greenhouse · Lever · Workday · Indeed · Jobvite · iCIMS · any site with standard page titles

---

## Uninstall

```bash
bash uninstall.sh
```

Removes the LaunchAgent and move script. Your `JobApps` folder and Google Sheet are preserved.

---

## Platform Support

| Feature | macOS | Windows | Linux |
|---|---|---|---|
| Auto-Move | ✅ | 🔜 | 🔜 |
| Resume Tailor | ✅ | ✅ | ✅ |
| Chrome Extension | ✅ | ✅ | ✅ |

Windows/Linux contributions welcome — the watcher just needs a Task Scheduler or systemd equivalent.

---

## Logs

```
~/Library/Logs/applykit-move.log   — every file move with timestamp
/tmp/applykit-move.out             — LaunchAgent stdout
/tmp/applykit-move.err             — LaunchAgent stderr
```

---

## Troubleshooting

**Resume not moving from Downloads?**
- Check `~/Library/Logs/applykit-move.log` for errors
- Make sure `/bin/bash` has Full Disk Access (System Settings → Privacy & Security)
- Run `launchctl list | grep applykit` — should show a PID

**pdflatex not found?**
```bash
/opt/homebrew/bin/brew install --cask basictex
sudo bash scripts/setup-latex.sh
```

**Extension not logging to Sheets?**
- Check the webhook URL in Settings — it should end in `/exec`
- Make sure Apps Script is deployed as "Anyone" can access
- Open Chrome DevTools → Console while clicking Log Application to see errors

---

## Contributing

PRs welcome. High-value additions:
- Windows Auto-Move (Task Scheduler)
- Linux Auto-Move (systemd service)
- More ATS detectors in `extension/content.js`
- Notion / Airtable / Excel backend in `sheets/`

---

## License

MIT — use it, fork it, build on it.

---

Built with [Claude Code](https://claude.ai/code)
