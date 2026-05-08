// Service worker — no persistent logic needed yet.
// Future: could listen for download events to auto-log when a resume PDF is saved.
chrome.runtime.onInstalled.addListener(() => {
  console.log('ApplyKit installed.');
});
