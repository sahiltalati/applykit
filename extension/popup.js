const $ = id => document.getElementById(id);

async function getWebhookUrl() {
  return new Promise(resolve => {
    chrome.storage.local.get(['webhookUrl'], r => resolve(r.webhookUrl || ''));
  });
}

async function init() {
  // Set today's date
  $('date').value = new Date().toISOString().split('T')[0];

  // Load saved webhook URL
  const webhookUrl = await getWebhookUrl();
  $('webhook-url').value = webhookUrl;
  if (!webhookUrl) {
    $('no-webhook-warning').style.display = 'block';
    $('settings-panel').classList.add('open');
  }

  // Try to get job details from the active tab
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    $('url').value = tab.url || '';

    const details = await chrome.tabs.sendMessage(tab.id, { type: 'GET_JOB_DETAILS' });
    if (details) {
      if (details.company) $('company').value = details.company;
      if (details.role) $('role').value = details.role;
      if (details.location) $('location').value = details.location;
      if (details.url) $('url').value = details.url;
    }
  } catch (e) {
    // Content script not available on this page — that's fine
  }
}

$('settings-toggle').addEventListener('click', () => {
  $('settings-panel').classList.toggle('open');
});

$('save-settings').addEventListener('click', () => {
  const url = $('webhook-url').value.trim();
  chrome.storage.local.set({ webhookUrl: url });
  $('no-webhook-warning').style.display = url ? 'none' : 'block';
  showResult('Settings saved.', 'success');
});

$('log-btn').addEventListener('click', async () => {
  const webhookUrl = await getWebhookUrl();
  if (!webhookUrl) {
    showResult('Add your webhook URL in Settings first.', 'error');
    $('settings-panel').classList.add('open');
    return;
  }

  const payload = {
    company: $('company').value.trim(),
    role: $('role').value.trim(),
    location: $('location').value.trim(),
    date: $('date').value,
    status: $('status').value,
    url: $('url').value.trim(),
    notes: $('notes').value.trim(),
  };

  if (!payload.company || !payload.role) {
    showResult('Company and Role are required.', 'error');
    return;
  }

  $('log-btn').disabled = true;
  $('log-btn').textContent = 'Logging…';

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      showResult(`✓ Logged "${payload.role}" at ${payload.company}`, 'success');
      $('log-btn').textContent = '✓ Logged!';
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    showResult(`Error: ${err.message}. Check your webhook URL.`, 'error');
    $('log-btn').disabled = false;
    $('log-btn').textContent = 'Log Application';
  }
});

function showResult(msg, type) {
  const el = $('result');
  el.textContent = msg;
  el.className = `result ${type}`;
}

init();
