# 🚀 DevOps Journey

A small Node.js web app that tracks your DevOps learning roadmap. It has a dark dashboard, a progress ring, milestones and quotes.

**This project exists so you can practice writing CI/CD pipelines.** The app is already done and working. Your job is to write the `.github/workflows/*.yml` files.

---

## 📂 Project structure

```
devops-journey/
├── src/
│   ├── app.js          # Express app: routes and API
│   ├── server.js       # Starts the server
│   └── data.js         # Your roadmap. Edit this to update the page!
├── public/             # The web page (HTML, CSS, JS)
├── tests/
│   └── app.test.js     # 7 automated tests
├── Dockerfile          # Builds a container image
├── eslint.config.js    # Code-style rules
└── package.json        # Scripts and dependencies
```

## 🧰 Commands your pipeline will use

| Command | What it does | Pipeline stage |
|---|---|---|
| `npm ci` | Installs dependencies exactly as locked | Setup |
| `npm run lint` | Checks code style with ESLint | Lint |
| `npm test` | Runs the 7 tests | Test |
| `npm start` | Starts the app on port 3000 | Run / smoke test |
| `docker build -t devops-journey .` | Builds the Docker image | Build |
| `docker run -p 3000:3000 devops-journey` | Runs the container | Deploy (local) |
| `curl http://localhost:3000/health` | Checks the app is alive | Smoke test |

## 🌍 Environment variables the app reads

The app shows these on the page and in `/api/info`. Set them in your workflow with `env:`.

| Variable | Default | Shown as |
|---|---|---|
| `APP_ENV` | `local` | green badge at the top |
| `APP_VERSION` | `1.0.0` | version in the footer |
| `GIT_SHA` | `unknown` | commit in the footer (try `${{ github.sha }}`) |
| `OWNER_NAME` | `Prajwal` | name under the title |
| `PORT` | `3000` | port the server listens on |

## 🔗 API endpoints

- `GET /health`: `{ "status": "ok" }`
- `GET /api/info`: name, version, environment, commit
- `GET /api/milestones`: roadmap and progress %
- `GET /api/quote`: a random DevOps quote

---

# 🎯 Pipeline missions

Do them in order. Each mission is a new workflow file in `.github/workflows/`.
**Type every file by hand. Don't copy-paste.**

### Mission 1: Hello pipeline 🟢
`mission1.yml`: manual trigger, one job that checks out the code and runs `ls -la`.

### Mission 2: Install and test 🟢
`mission2.yml`: on push to `main`:
1. Check out the code
2. Set up Node.js 22 (look up `actions/setup-node@v4` and its `node-version` input)
3. Run `npm ci`
4. Run `npm test`

### Mission 3: Lint and test as separate jobs 🟡
`mission3.yml`: two jobs, `lint` and `test`, running **in parallel**.
Remember: each job is a fresh machine, so each needs its own checkout, setup-node and `npm ci`.

### Mission 4: Break it on purpose 🟡
Change a test so it fails (for example, expect `'ok'` to equal `'okay'`), then push.
Watch the pipeline go red ❌. Read the log and find the failing line. Fix it and watch it go green ✅.

### Mission 5: Full CI chain 🟡
`mission5.yml`: jobs `lint` → `test` → `build`, using `needs:`.
The `build` job runs `docker build -t devops-journey .`

### Mission 6: Smoke test 🟠
Add a job `smoke-test` (after `build`) that:
1. Builds the image
2. Runs it in the background: `docker run -d -p 3000:3000 devops-journey`
3. Waits a few seconds: `sleep 5`
4. Checks it's alive: `curl --fail http://localhost:3000/health`

If the app doesn't respond, `--fail` makes the step fail. That's a real-world smoke test!

### Mission 7: Environment variables 🟠
Set `APP_ENV: staging`, `APP_VERSION: 1.1.0` and `GIT_SHA: ${{ github.sha }}` at the workflow level.
In the smoke test, pass them into the container (`docker run -e APP_ENV=$APP_ENV ...`) and
`curl` `/api/info` to print them.

### Mission 8: Pull request checks 🔴
Make lint and test run on **pull requests** to `main` too (`on: pull_request`).
Create a branch, change `src/data.js`, open a PR, and watch the checks appear on it.

### Mission 9: Matrix testing 🔴
Run the tests on Node **20, 22 and 24** at the same time using `strategy: matrix:`.

### Mission 10: Deploy 🔴
Push your Docker image to **GitHub Container Registry** (`ghcr.io`) using
`docker/login-action` and `docker/build-push-action`.
Bonus: deploy the static page to **GitHub Pages**.

---

## 💻 Run it on your own computer (optional)

```bash
npm install
npm start
# open http://localhost:3000
```

Stuck on a mission? Ask for a hint and say which mission number you're on. 💪
