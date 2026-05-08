// Extracts job details from the current page and sends them to the popup.

const extractors = {
  // LinkedIn job page
  linkedin: {
    match: () => location.hostname.includes('linkedin.com'),
    extract: () => ({
      company: document.querySelector('.job-details-jobs-unified-top-card__company-name a, .jobs-unified-top-card__company-name a')?.innerText?.trim(),
      role: document.querySelector('.job-details-jobs-unified-top-card__job-title h1, .jobs-unified-top-card__job-title')?.innerText?.trim(),
      location: document.querySelector('.job-details-jobs-unified-top-card__bullet, .jobs-unified-top-card__workplace-type')?.innerText?.trim(),
    }),
  },
  // Greenhouse ATS
  greenhouse: {
    match: () => location.hostname.includes('greenhouse.io') || location.hostname.includes('boards.greenhouse.io'),
    extract: () => ({
      company: document.querySelector('#header .company-name, .company-name')?.innerText?.trim()
        || document.title.split(' at ')[1]?.split(' - ')[0]?.trim(),
      role: document.querySelector('#header h1, .app-title')?.innerText?.trim()
        || document.title.split(' at ')[0]?.trim(),
      location: document.querySelector('.location')?.innerText?.trim(),
    }),
  },
  // Lever ATS
  lever: {
    match: () => location.hostname.includes('jobs.lever.co'),
    extract: () => ({
      company: location.pathname.split('/')[1],
      role: document.querySelector('.posting-headline h2')?.innerText?.trim(),
      location: document.querySelector('.posting-categories .location')?.innerText?.trim(),
    }),
  },
  // Workday
  workday: {
    match: () => location.hostname.includes('myworkdayjobs.com') || location.hostname.includes('workday.com'),
    extract: () => ({
      company: document.querySelector('[data-automation-id="jobPostingHeader"] .css-1q2dra3')?.innerText?.trim()
        || document.title.split('|')[1]?.trim(),
      role: document.querySelector('[data-automation-id="jobPostingHeader"] h2')?.innerText?.trim()
        || document.title.split('|')[0]?.trim(),
      location: document.querySelector('[data-automation-id="locations"]')?.innerText?.trim(),
    }),
  },
  // Indeed
  indeed: {
    match: () => location.hostname.includes('indeed.com'),
    extract: () => ({
      company: document.querySelector('[data-company-name], .css-87uc0g')?.innerText?.trim(),
      role: document.querySelector('.jobsearch-JobInfoHeader-title, h1.icl-u-xs-mb--xs')?.innerText?.trim(),
      location: document.querySelector('[data-testid="job-location"], .css-6z8o9s')?.innerText?.trim(),
    }),
  },
  // Jobvite
  jobvite: {
    match: () => location.hostname.includes('jobvite.com'),
    extract: () => ({
      company: document.querySelector('.jv-header .company')?.innerText?.trim()
        || document.title.split(' - ')[1]?.trim(),
      role: document.querySelector('.jv-header h1')?.innerText?.trim()
        || document.title.split(' - ')[0]?.trim(),
      location: document.querySelector('.jv-job-detail-meta span')?.innerText?.trim(),
    }),
  },
  // iCIMS
  icims: {
    match: () => location.hostname.includes('icims.com'),
    extract: () => ({
      company: document.querySelector('.iCIMS_MainColumn .iCIMS_Header h2')?.innerText?.trim(),
      role: document.querySelector('#iCIMS_JobTitle, .iCIMS_JobTitle h1')?.innerText?.trim(),
      location: document.querySelector('.iCIMS_InfoMsg .iCIMS_Offices')?.innerText?.trim(),
    }),
  },
  // Generic fallback — parse page title
  generic: {
    match: () => true,
    extract: () => {
      const title = document.title;
      // Common patterns: "Role at Company", "Role - Company", "Role | Company"
      const atMatch = title.match(/^(.+?)\s+at\s+(.+?)(\s*[|\-]|$)/i);
      const dashMatch = title.match(/^(.+?)\s*[-|]\s*(.+?)(\s*[-|]|$)/);
      if (atMatch) return { role: atMatch[1].trim(), company: atMatch[2].trim() };
      if (dashMatch) return { role: dashMatch[1].trim(), company: dashMatch[2].trim() };
      return { role: title.trim(), company: '' };
    },
  },
};

function getJobDetails() {
  for (const [name, extractor] of Object.entries(extractors)) {
    if (extractor.match()) {
      const details = extractor.extract();
      if (details.company || details.role) {
        return { ...details, source: name, url: location.href };
      }
    }
  }
  return { company: '', role: '', source: 'unknown', url: location.href };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'GET_JOB_DETAILS') {
    sendResponse(getJobDetails());
  }
});
