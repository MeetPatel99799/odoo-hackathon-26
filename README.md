# TransitOps

## One-Command Run Instructions
To boot the full orchestration layer, run:
```bash
docker-compose up --build
```

## Entrypoint
- Main Application Entrypoint: http://localhost/ (Port 80)
- The nginx service proxies traffic to the frontend and backend.

## Seeded Demo Logins
For manual testing, the following logins are seeded:
- **Email:** admin@transitops.com | **Password:** admin123 | **Role:** Admin
- **Email:** manager@transitops.com | **Password:** manager123 | **Role:** Manager
- **Email:** driver@transitops.com | **Password:** driver123 | **Role:** Driver
- **Email:** user@transitops.com | **Password:** user123 | **Role:** User