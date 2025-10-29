# Demo: Flight Search (December 2025)

This guide lists every route+date combination that will return at least 5 flights from the seeded data.

## 1) Reset and seed the project

```bash
pnpm i
pnpm reset
```

## 2) Start the apps

```bash
pnpm --filter server dev
```

```bash
pnpm --filter web dev
```

Defaults:
- API: `http://localhost:3001`
- Web: `http://localhost:3000`

Ensure `NEXT_PUBLIC_API_URL` in the web app points to the API.

## 3) Successful searches (route + date)

Each of the following searches will return at least 5 flights (different times/airlines):

Dates supported:
- 2025-12-01
- 2025-12-05
- 2025-12-08
- 2025-12-12
- 2025-12-15

Route pairs supported:
- DEL → BOM
- BOM → DEL
- DEL → BLR
- BLR → DEL
- BLR → HYD
- HYD → BLR
- MAA → DEL
- DEL → MAA
- CCU → DEL
- DEL → CCU
- BOM → HYD
- HYD → BOM
- AMD → DEL
- DEL → AMD
- PNQ → DEL

Below is the explicit list of successful search inputs:

2025-12-01:
- DEL → BOM
- BOM → DEL
- DEL → BLR
- BLR → DEL
- BLR → HYD
- HYD → BLR
- MAA → DEL
- DEL → MAA
- CCU → DEL
- DEL → CCU
- BOM → HYD
- HYD → BOM
- AMD → DEL
- DEL → AMD
- PNQ → DEL

2025-12-05:
- DEL → BOM
- BOM → DEL
- DEL → BLR
- BLR → DEL
- BLR → HYD
- HYD → BLR
- MAA → DEL
- DEL → MAA
- CCU → DEL
- DEL → CCU
- BOM → HYD
- HYD → BOM
- AMD → DEL
- DEL → AMD
- PNQ → DEL

2025-12-08:
- DEL → BOM
- BOM → DEL
- DEL → BLR
- BLR → DEL
- BLR → HYD
- HYD → BLR
- MAA → DEL
- DEL → MAA
- CCU → DEL
- DEL → CCU
- BOM → HYD
- HYD → BOM
- AMD → DEL
- DEL → AMD
- PNQ → DEL

2025-12-12:
- DEL → BOM
- BOM → DEL
- DEL → BLR
- BLR → DEL
- BLR → HYD
- HYD → BLR
- MAA → DEL
- DEL → MAA
- CCU → DEL
- DEL → CCU
- BOM → HYD
- HYD → BOM
- AMD → DEL
- DEL → AMD
- PNQ → DEL

2025-12-15:
- DEL → BOM
- BOM → DEL
- DEL → BLR
- BLR → DEL
- BLR → HYD
- HYD → BLR
- MAA → DEL
- DEL → MAA
- CCU → DEL
- DEL → CCU
- BOM → HYD
- HYD → BOM
- AMD → DEL
- DEL → AMD
- PNQ → DEL

Tip: Pick any route from the list above with any of the listed dates to see 5 flight options.


