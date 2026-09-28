# EmpManagement

Angular Employee Management app with a local Mock API (`json-server`) and NgRx state management.

## Quick start

Install dependencies, then run the mock API and Angular app together:

```bash
npm install
npm start
```

- App: http://localhost:4200/
- Mock API: http://localhost:3000/api/v1

### Run separately

```bash
npm run api        # json-server on port 3000
npm run start:web  # Angular on port 4200
```

### Reset mock data

Deletes/edits persist in `mock/db.json`. Restore the seed data with:

```bash
npm run api:reset
```

## Mock API endpoints

| Method | URL |
|--------|-----|
| GET | `/api/v1/employee` |
| GET | `/api/v1/employee/:id` |
| POST | `/api/v1/employee` |
| PUT | `/api/v1/employee/:id` |
| DELETE | `/api/v1/employee/:id` |
| GET | `/api/v1/country` |

Data files live in `mock/db.json` (runtime) and `mock/db.seed.json` (reset source).

New employees get the next serial ID (`7`, `8`, …) from `mock/server.js` (not random ids).

## Building

```bash
ng build
```

## Running unit tests

```bash
ng test
```
