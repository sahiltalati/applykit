# ApplyKit 🚀

**Your end-to-end job application operating system.**

ApplyKit combines three tools into one workflow:

1. **Resume Tailor** — a Claude Code skill that tailors your resume to any job description in seconds
2. **Auto-Move** — a macOS background script that automatically files tailored resumes into your `JobApps` folder the moment they're downloaded
3. **Application Tracker** — a Chrome extension that logs every job application to Google Sheets in one click, auto-detecting the company, role, and URL

---

## The Workflow

```
1. Find a job → paste the JD into Claude Code
2. Claude tailors your resume → PDF downloads to ~/Downloads
3. Auto-Move instantly moves it to ~/Documents/JobApps
4. Submit the application
5. Click the ApplyKit extension → hit "Log Application"
6. Google Sheets is updated automatically
```

---

## Installation

### Prerequisites
- macOS (Ventura or later)
- [Claude Code](https://claude.ai/code) installed
- Google Chrome

---

### Step 1 — Auto-Move Script (macOS)

```bash
git clone https://github.com/sahiltalati/applykit.git
cd applykit
bash install.sh
```

The installer will ask you:
- Where to watch for new resumes (default: `~/Downloads`)
- Where to move them (default: `~/Documents/JobApps`)
- What filename pattern to match (default: `*_Resume_*.pdf`)

**One manual step — grant bash Full Disk Access:**

> System Settings → Privacy & Security → Full Disk Access → click `+` → navigate to `/bin/bash` → add it → toggle ON

This is required on macOS Ventura+ for background scripts to read the Downloads folder.

---

### Step 2 — Resume Tailor Skill (Claude Code)

1. Copy your resume to `~/.applykit/resume.tex` (LaTeX) or `~/.applykit/resume.md`:

```bash
mkdir -p ~/.applykit
cp /path/to/your/resume.tex ~/.applykit/resume.tex
```

2. Copy the skill into Claude Code's skills directory:

```bash
mkdir -p ~/.claude/skills
cp skill/resume-tailor.md ~/.claude/skills/resume-tailor.md
```

3. In Claude Code, trigger it by saying:

> "Tailor my resume for this role: [paste job description]"

The tailored PDF will be saved to `~/Documents/JobApps/YourName_Resume_CompanyName.pdf`.

> If you don't have `pdflatex`: `brew install --cask basictex`

---

### Step 3 — Chrome Extension (Application Tracker)

**Load the extension:**

1. Open Chrome → go to `chrome://extensions`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked** → select the `extension/` folder from this repo

**Set up Google Sheets:**

1. Create a new Google Sheet
2. Open **Extensions → Apps Script**
3. Paste the contents of `sheets/apps-script.js` (replace all existing code)
4. Click **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, authorize, and copy the URL

**Connect the extension:**

1. Click the ApplyKit icon in Chrome toolbar
2. Click **⚙️ Settings**
3. Paste the Apps Script URL → **Save**

---

## Usage

### Tailoring a resume

In Claude Code:
```
Tailor my resume for this role: [paste full job description]
```

Claude will edit your resume, compile the PDF, and save it to `~/Documents/JobApps/`.
The Auto-Move script will have already handled the filing if it lands in Downloads first.

### Logging an application

1. After submitting an application, click the **ApplyKit** toolbar icon
2. Company, Role, and URL are auto-filled from the page
3. Hit **Log Application** — done ✓

Your Google Sheet gets a new row:

| Date Applied | Company | Role | Status | Job URL | Notes | Logged At |
|---|---|---|---|---|---|---|
| 2025-05-08 | Stripe | Software Engineer | Applied | https://... | | 2025-05-08 10:32 |

---

## Uninstall

```bash
bash uninstall.sh
```

Removes the LaunchAgent and move script. Your `JobApps` folder and log file are preserved.

---

## Platform Support

| Feature | macOS | Windows | Linux |
|---|---|---|---|
| Auto-Move script | ✅ | 🔜 | 🔜 |
| Resume Tailor skill | ✅ | ✅ | ✅ |
| Chrome Extension | ✅ | ✅ | ✅ |

Windows/Linux contributions welcome — the watcher logic just needs a `systemd` service or Task Scheduler equivalent.

---

## Supported Job Sites (Auto-Detection)

The extension auto-detects job details on:

- LinkedIn
- Greenhouse
- Lever
- Workday
- Indeed
- Jobvite
- iCIMS
- Any site with standard `"Role at Company"` page titles

---

## Logs

- Auto-Move log: `~/Library/Logs/applykit-move.log`
- LaunchAgent stdout: `/tmp/applykit-move.out`
- LaunchAgent stderr: `/tmp/applykit-move.err`

---

## Contributing

PRs welcome. High-value additions:
- Windows support (Task Scheduler watcher)
- Linux support (systemd service)
- More ATS site detectors in `extension/content.js`
- Airtable / Notion / Excel integration in `sheets/`

---

## License

MIT
