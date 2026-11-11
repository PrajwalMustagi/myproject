async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

async function loadInfo() {
  const info = await getJSON('/api/info');
  document.getElementById('version').textContent = `v${info.version}`;
  document.getElementById('commit').textContent = info.commit;
  document.getElementById('owner').textContent = info.owner;
  document.getElementById('env-badge').textContent = `● ${info.environment}`;
}

async function loadMilestones() {
  const { progress, milestones } = await getJSON('/api/milestones');
  document.getElementById('percent').textContent = progress;
  const circumference = 2 * Math.PI * 52;
  document.getElementById('ring-fg').style.strokeDashoffset =
    circumference - (progress / 100) * circumference;

  const list = document.getElementById('milestones');
  list.innerHTML = '';
  milestones.forEach((m) => {
    const li = document.createElement('li');
    if (m.done) li.classList.add('done');
    li.innerHTML = `<span class="icon">${m.icon}</span><span>${m.title}</span>
      <span class="status">${m.done ? '✓ done' : 'next'}</span>`;
    list.appendChild(li);
  });
}

async function loadQuote() {
  const { quote } = await getJSON('/api/quote');
  document.getElementById('quote').textContent = `“${quote}”`;
}

async function checkHealth() {
  const el = document.getElementById('health');
  try {
    const { status } = await getJSON('/health');
    el.textContent = status === 'ok' ? '✅ ok' : '⚠️ ' + status;
  } catch {
    el.textContent = '❌ down';
  }
}

document.getElementById('new-quote').addEventListener('click', loadQuote);

loadInfo();
loadMilestones();
loadQuote();
checkHealth();
setInterval(checkHealth, 10000);
