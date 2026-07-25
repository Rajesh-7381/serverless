# serverless

npm install husky --save-dev
npx husky init
npm run prepare


-------------------------------------------------
# Overall Goal 
Build a system that:

# Analyzes stocks daily
Gives clear Buy / Sell / Hold signals
Shows 10-day outlook
Is easy to maintain and extend


PHASE-WISE PLAN
# Phase 1: Foundation & Configuration (Done / In Progress)

Dynamic stock list (easy add/remove)
Config-driven provider switching (mock, yahoo, choice, etc.)
Basic API routes (/recommendations/today)
Logger + Error handling

# Phase 2: Data Layer

Create clean Market Data Service
Implement Mock Provider (for reliable testing)
Add real providers (Choice FinX / Indian API / Yahoo)
Historical data + Current price fetching

# Phase 3: Technical Analysis Core

RSI Strategy (with proper calculation)
EMA Strategy (crossover logic)
Breakout Strategy
10-day price outlook logic

# Phase 4: Recommendation Engine

Combine multiple signals
Calculate Confidence Score (0-100)
Generate "Buy", "Sell", "Hold", "Strong Buy"
10-day projected signals

# Phase 5: Scheduler & Automation

Daily job at 9:20 AM IST
Enable/Disable via config
Email / Notification service (optional)

# Phase 6: API & Frontend Ready

Better API endpoints (/stocks, /recommendations/10days, etc.)
Add/Remove stocks via API
Simple dashboard route (optional)

# Phase 7: Backtesting & History

Save past recommendations
Show past performance of signals
Accuracy tracking

# Phase 8: Risk Management

Stop-loss suggestions
Target price logic
Portfolio allocation suggestions

# Phase 9: Real Providers Integration

Integrate Choice FinX
Integrate Indian API as backup
Rate limiting + fallback system

# Phase 10: Production & Polish

Docker + PM2 setup
Monitoring & Alerts
Documentation + README
Deployment


Suggested Order (Recommended)

Phase 1 → Foundation (you are here)
Phase 2 → Data Layer
Phase 3 → Technical Analysis
Phase 4 → Recommendation Engine
Phase 5 → Scheduler


----------------------------------------------------------------------------------------------------------------------------
----------------------------------------- # for jobs -----------------------------------------------------------------------
| Day | What to develop                                         | Output for that day                                       |
| --- | ------------------------------------------------------- | --------------------------------------------------------- |
| 1   | Freeze the current codebase and clean folder structure. | Stable folders, backup copy, clear source list.           |
| 2   | Make config fully source-driven.                        | config.json controls all enabled sources and options.     |
| 3   | Standardize common utility functions.                   | Shared helpers for clean text, scoring, date, and URLs.   |
| 4   | Finalize the core runner flow.                          | job-alert.js only orchestrates, no scraping logic inside. |
| 5   | Make Cutshort extraction reliable.                      | Cutshort rows with real Apply Link.                       |
| 6   | Make Naukri extraction reliable.                        | Naukri rows with real Apply Link.                         |
| 7   | Make logging and debug files cleaner.                   | Better debug output for failures.                         |
| 8   | Add result validation and stronger filters.             | Better quality rows, fewer false matches.                 |
| 9   | Build Indeed handler.                                   | Indeed source working in config.                          |
| 10  | Build LinkedIn handler.                                 | LinkedIn source working in config.                        |
| 11  | Add source registry system.                             | Future sources can be added with one new file.            |
| 12  | Add retry and timeout improvements.                     | Fewer failures on slow pages.                             |
| 13  | Add better dedupe logic.                                | Duplicate jobs reduced across sources.                    |
| 14  | Add report formatting cleanup.                          | Cleaner email and WhatsApp output.                        |
| 15  | Add test/dry-run mode.                                  | Safe mode for checking output without sending.            |
| 16  | Add run summary metrics.                                | Counts for raw, deduped, filtered, sent.                  |
| 17  | Add failure recovery and fallback behavior.             | One bad source won’t break the full run.                  |
| 18  | Add deployment readiness checks.                        | Startup checks, missing env checks, config checks.        |
| 19  | Do full end-to-end testing.                             | All enabled sources run together smoothly.                |
| 20  | Final polish and release version.                       | Clean stable version ready for daily use.                 |