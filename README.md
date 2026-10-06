# AI-Powered Playwright - Course Starter Project

Everything for the three modules is already written. Students do not type code:
they run a command, see the result, then open the file to understand it.

All AI calls use the OpenAI API (GPT-4o). You need an OpenAI API key.

## Setup (5 minutes)

```bash
npm install
npx playwright install chromium
cp .env.example .env        # Windows: copy .env.example .env
# open .env and paste your OpenAI key in OPENAI_API_KEY
npm run demo:all            # runs the whole course flow once
```

A small demo store (login, register, signup, products) starts automatically on
http://localhost:3000, so no internet or external app is needed.

## Syllabus -> command -> file to open

| Syllabus topic | Run | Open and explain |
|---|---|---|
| 0. Shared OpenAI helper (GPT-4o) | - | `utils/llm.ts` |
| 1.1 AI-generated test data | `npm run gen:users` then `npx playwright test register` | `data/ai-data.ts`, `test-data/users.json`, `tests/register.spec.ts` |
| 1.2 Edge cases for boundary testing | `npm run gen:edge` then `npx playwright test age` | `scripts/gen-edge-cases.ts`, `tests/age-boundary.spec.ts` |
| 1.3 Seed DB with AI data | `npm run gen:products`, `npm run db:up`, set `TEST_DB_URL`, `npm test` | `global-setup.ts`, `docker-compose.yml` |
| 2.1 Locator failure + LLM auto-fix | `npx playwright test login-heal` | `utils/self-heal.ts`, `tests/login-heal.spec.ts` |
| 2.2 GitHub PR for healed files | `npm run heal:apply` then `git diff` (CI does the PR) | `scripts/apply-heals.ts`, `.github/workflows/e2e.yml` |
| 2.3 Live demo | `npm run demo:reset` -> `npm test` -> `npm run heal:apply` | HTML report: `npx playwright show-report` |
| Module 3, all steps at once | `npm run module3` (prints which files to open) | see the list it prints |
| 3.1 Failure log analysis + root cause | `npm run test:fail-demo` | `reporters/ai-rca-reporter.ts`, `ai-analysis.md` |
| 3.2 AI analysis in CI output | push to GitHub | `.github/workflows/e2e.yml` (job summary + PR comment) |
| 3.3 Gherkin from requirements doc | `npm run gherkin` | `docs/requirements/login.md` -> `features/login.feature` |
| 3.4 Summarise run via LLM | `npm test` then `npm run summary` | `scripts/summarise-run.ts`, `run-summary.md` |

## OpenAI key

Local: put it in `.env` as `OPENAI_API_KEY` (never commit `.env`).
GitHub: add `OPENAI_API_KEY` as a repo secret. Also enable
Settings > Actions > "Allow GitHub Actions to create and approve pull requests".

Cost: generators and the Gherkin/summary scripts make one call each. The heal
and failure-analysis steps call the API only when a locator breaks or a test fails.

Note: the AI output changes a little each time. If a generated `expected` value
or selector is wrong, that is the teaching moment - review before committing.

## Demo credentials (built-in app)

`standard_user` / `secret_sauce` - logs in. `locked_out_user` - locked error.

## The one rule for every module

The LLM suggests, code validates, a human approves.
Generated data is checked with zod and committed; heals are verified and go
through a PR (never auto-merged); run numbers are calculated by code, not the LLM.
