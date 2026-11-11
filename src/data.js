// The learning roadmap shown on the page.
// Change `done: true/false` as you progress, push, and let your pipeline deploy it!
const milestones = [
  { id: 1, title: 'Linux basics', icon: '🐧', done: true },
  { id: 2, title: 'Git & GitHub', icon: '🌿', done: true },
  { id: 3, title: 'GitHub Actions', icon: '⚙️', done: false },
  { id: 4, title: 'Docker', icon: '🐳', done: false },
  { id: 5, title: 'Kubernetes', icon: '☸️', done: false },
  { id: 6, title: 'Terraform', icon: '🏗️', done: false },
  { id: 7, title: 'Monitoring', icon: '📈', done: false },
  { id: 8, title: 'Cloud (AWS)', icon: '☁️', done: false },
];

const quotes = [
  'Automate the boring stuff, then automate the automation.',
  'Every red pipeline is a lesson. Every green one is a celebration.',
  'Ship small, ship often.',
  'If it hurts, do it more often.',
  'You build it, you run it.',
  'Infrastructure is code. Treat it like code.',
];

function progress(list = milestones) {
  if (list.length === 0) return 0;
  const done = list.filter((m) => m.done).length;
  return Math.round((done / list.length) * 100);
}

function randomQuote(random = Math.random) {
  return quotes[Math.floor(random() * quotes.length)];
}

module.exports = { milestones, quotes, progress, randomQuote };
