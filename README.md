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