const path = require('node:path');
const express = require('express');
const { milestones, progress, randomQuote } = require('./data');
const pkg = require('../package.json');

const app = express();
const startedAt = Date.now();

app.use(express.static(path.join(__dirname, '..', 'public')));

// Health check: pipelines and Docker use this to see if the app is alive.
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
  });
});

// App info: values come from environment variables set by your pipeline.
app.get('/api/info', (req, res) => {
  res.json({
    name: pkg.name,
    version: process.env.APP_VERSION || pkg.version,
    environment: process.env.APP_ENV || 'local',
    owner: process.env.OWNER_NAME || 'Prajwal',
    commit: (process.env.GIT_SHA || 'unknown').slice(0, 7),
  });
});

app.get('/api/milestones', (req, res) => {
  res.json({ progress: progress(), milestones });
});

app.get('/api/quote', (req, res) => {
  res.json({ quote: randomQuote() });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
