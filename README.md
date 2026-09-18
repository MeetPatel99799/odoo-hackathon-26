# TransitOps

TransitOps is a smart, full-stack transportation operations platform designed for dispatchers, fleet managers, and safety officers to streamline fleet coordination, monitor live trips, enforce driver compliance, and generate analytics.

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS (Modern glassmorphism theme)
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Orchestration**: Docker, Docker Compose, Nginx Proxy

## Key Features
1. **Trip Dispatcher & Live Board**: Construct new trips with strict payload validation. Monitor active trips through a Live Board. Easily complete trips by logging final odometers and fuel consumed, which automatically restores the vehicle and driver to available status.
2. **Fleet Management**: Track vehicle capacities, registration numbers, types, and current statuses. Ensure unique registration numbers and automatically hide retired/in-shop vehicles from the dispatch pool.
3. **Driver & Compliance Management**: Monitor driver licenses, safety scores, and trip completion percentages. Automatically prevent suspended drivers or those with expired licenses from being assigned to new trips.
4. **Maintenance Tracking**: Log maintenance history for vehicles. Moving a vehicle to "In Shop" hides it from the active dispatcher pool until repaired.
5. **Fuel & Expenses**: Track fuel usage and maintenance costs, aggregating data per vehicle.
6. **Analytics & KPIs**: Analyze Fleet Utilization, Vehicle ROI, Operational Costs, and Fuel Efficiency based on actual completed trips data. Includes responsive charts and CSV export capabilities.
7. **Role-Based Access Control (RBAC)**: Secure multi-role access dynamically customizing the navigation and app capabilities per user.

## Roles & Access Permissions
The application supports four primary roles, each unlocking a tailored UI experience:
- **Fleet Manager**: Full access to Fleet, Drivers, Trips, Fuel & Expenses, and Analytics.
- **Dispatcher**: Read-only access to Fleet and Drivers, but full management access over Trips.
- **Safety Officer**: Full management access to Drivers and compliance, read-only access to Fleet and Trips.
- **Financial Analyst**: Full management access to Fuel & Expenses, read-only access to Fleet, Trips, and Analytics.

## Getting Started

### One-Command Run
You can boot the entire orchestration layer, backend, frontend, and database via Docker Compose:
```bash
docker-compose up --build
```
This will:
1. Initialize the PostgreSQL database with the required schema and initial seeded data.
2. Build and start the Node.js API backend.
3. Build and start the Vite/React frontend.
4. Boot an Nginx reverse-proxy to serve traffic efficiently.

### Entrypoint
- **Application URL**: `http://localhost/` (Port 80)
- Nginx seamlessly proxies frontend assets and `/api/*` backend requests.

### Demo Logins
Upon launching the application, you will be greeted by the login screen. You can enter any valid email and select one of the four roles from the dropdown to experience the customized Role-Based Access Control (RBAC) interface.

## API Structure Overview
The backend provides RESTful endpoints under `/api`:
- `GET /api/trips`, `POST /api/trips`, `PATCH /api/trips/:id/dispatch`, `PATCH /api/trips/:id/complete`
- `GET /api/vehicles`, `GET /api/vehicles/available`
- `GET /api/drivers`, `GET /api/drivers/available`
- `GET /api/maintenance/logs`, `POST /api/maintenance/logs`
- `GET /api/fuel/logs`, `POST /api/fuel/logs`
- `GET /api/analytics/summary`, `GET /api/analytics/monthly-revenue`, `GET /api/analytics/top-costly-vehicles`
- `GET /api/settings`, `PUT /api/settings`

## Development Notes
- The database is heavily structured around strict relationships. For example, completing a trip (`PATCH /api/trips/:id/complete`) performs complex transaction logic: validating the final odometer, calculating trip cost, updating vehicle/driver status back to available, and inserting fuel logs all in one SQL transaction to ensure data integrity.
