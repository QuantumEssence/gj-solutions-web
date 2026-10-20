# G&J Solutions Web System (CSE 314T Prototype)

Virtual assistant services platform tailored for independent Australian physiotherapists.

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite, React Router 7, Lucide Icons
- **Backend**: Node.js 24, Express, SQLite (`node:sqlite`)
- **Linter**: Oxlint

## Running the Application

### Option A: Run Both Frontend & Backend Concurrently (Recommended)
```bash
npm run dev:all
```
This runs the Express API server on `http://localhost:5000` and the Vite client on `http://localhost:5173` simultaneously.

### Option B: Run Services Separately
1. Start the Backend API:
```bash
npm run server
```
2. In a separate terminal, start the Frontend:
```bash
npm run dev
```

## API Endpoints

- `GET /api/health` — API status and timestamp
- `POST /api/inquiries` — Store new questionnaire submission (strict MOA data privacy enforcement against patient health records)
- `GET /api/inquiries` — Fetch all inquiries for the Admin Dashboard
- `PATCH /api/inquiries/:id/status` — Update review status (`Pending Review`, `Meeting Scheduled`, `Replied via Email`)
- `POST /api/analytics/track` — Log page view visit
- `GET /api/analytics/summary` — Aggregate metrics (unique visitors, total submissions, SPMC affiliation ratio, top requested service)

## Quality Checks
- Build: `npm run build`
- Lint: `npm run lint`
