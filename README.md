# ApplyKit 🗂️

**A Chrome extension that logs job applications to Google Sheets in one click.**

When you're on any job page — LinkedIn, Greenhouse, Lever, Workday, Indeed, and more — click the ApplyKit icon and it auto-fills the company, role, location, and URL. Hit **Log Application** and it goes straight into your Google Sheet.

No more spreadsheet copy-pasting. No more forgetting what you applied to.

---

## What gets logged

| Date Applied | Company | Role | Location | Status | Job URL | Notes | Logged At |
|---|---|---|---|---|---|---|---|
| 2026-05-11 | Stripe | Software Engineer Intern | Toronto, ON | Applied | https://... | | 2026-05-11 10:32 AM |

---

## Installation — 3 steps

### Step 1 — Load the extension in Chrome

1. Download or clone this repo:
   ```bash
   git clone https://github.com/sahiltalati/applykit.git
   ```
2. Open Chrome and go to `chrome://extensions`
3. Toggle **Developer mode** ON (top right)
4. Click **Load unpacked**
5. Select the `extension/` folder from the cloned repo

The ApplyKit briefcase icon will appear in your Chrome toolbar.

---

### Step 2 — Set up your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Import the template:
   - File → Import → Upload → select `sheets/template.csv` from the repo
   - Import location: **Replace spreadsheet** → Import data
   
   Your sheet will have all the right columns pre-configured.

3. Open **Extensions → Apps Script** from the Google Sheet menu
4. Delete the default code and paste everything from `sheets/apps-script.js`
5. Click **Save** (Cmd+S)
6. Click **Deploy → New deployment**
   - Click the gear icon ⚙️ → select **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy → Authorize access**
   - If you see "Google hasn't verified this app" → click **Advanced → Go to ApplyKit (unsafe) → Allow**
8. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/.../exec`)

---

### Step 3 — Connect the extension to your Sheet

1. Click the ApplyKit icon in your Chrome toolbar
2. Click **⚙️ Settings** at the bottom
3. Paste the Web app URL → click **Save**

Done. You're set up.

---

## How to use it

1. Find a job on LinkedIn (or any job site)
2. Click through to the company's career page
3. Fill out the application
4. Right before hitting Submit → click the **ApplyKit icon**
5. Company, role, location, and URL auto-fill from the page
6. Add any notes, confirm the status → click **Log Application**
7. Submit your application

The row appears in your Google Sheet instantly.

---

## Supported job sites

Auto-detects job details on:

- **LinkedIn**
- **Greenhouse** (boards.greenhouse.io)
- **Lever** (jobs.lever.co)
- **Workday** (myworkdayjobs.com)
- **Indeed**
- **Jobvite**
- **iCIMS**
- Any site with a standard page title like "Role at Company" or "Role | Company"

If a field doesn't auto-fill on a site you use, [open an issue](https://github.com/sahiltalati/applykit/issues) and I'll add support for it.

---

## Updating the Apps Script

If you redeploy the Apps Script (e.g. after adding new columns), make sure to:
- Select **New version** when deploying
- The Web app URL stays the same — no need to update the extension settings

---

## Contributing

PRs welcome. Most useful additions:
- More job site detectors in `extension/content.js`
- Additional column support
- Other spreadsheet backends (Notion, Airtable, Excel)

---

## License

MIT — free to use, fork, and build on.
