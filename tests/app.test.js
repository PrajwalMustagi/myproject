const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');
const { progress, quotes, randomQuote } = require('../src/data');

let server;
let baseUrl;

before(() => {
  server = app.listen(0);
  baseUrl = `http://localhost:${server.address().port}`;
});

after(() => server.close());

test('GET /health returns ok', async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, 'ok');
});

test('GET /api/info reads environment variables', async () => {
  process.env.APP_ENV = 'testing';
  const res = await fetch(`${baseUrl}/api/info`);
  const body = await res.json();
  assert.equal(body.environment, 'testing');
  assert.equal(body.name, 'devops-journey');
  delete process.env.APP_ENV;
});

test('GET /api/milestones returns a list and a progress number', async () => {
  const res = await fetch(`${baseUrl}/api/milestones`);
  const body = await res.json();
  assert.ok(Array.isArray(body.milestones));
  assert.ok(body.progress >= 0 && body.progress <= 100);
});

test('GET / serves the web page', async () => {
  const res = await fetch(`${baseUrl}/`);
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.match(html, /DevOps/);
});

test('unknown routes return 404', async () => {
  const res = await fetch(`${baseUrl}/does-not-exist`);
  assert.equal(res.status, 404);
});

test('progress() calculates percentage correctly', () => {
  assert.equal(progress([]), 0);
  assert.equal(progress([{ done: true }, { done: false }]), 50);
  assert.equal(progress([{ done: true }, { done: true }]), 100);
});

test('randomQuote() always returns a known quote', () => {
  assert.equal(randomQuote(() => 0), quotes[0]);
  assert.ok(quotes.includes(randomQuote()));
});
