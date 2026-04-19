# Athlete DevOps System

A fully automated CI/CD pipeline for a Node.js CRUD REST API, built for the SIT223/SIT753 High Distinction Task.

## Project Description
A RESTful API backend for managing athletes (CRUD operations), integrated with a complete DevOps pipeline using Jenkins, Docker, SonarQube, and npm audit security scanning.

## Tech Stack
- **Runtime**: Node.js 18 + Express
- **Testing**: Jest + Supertest
- **Containerisation**: Docker + Docker Compose
- **CI/CD**: Jenkins (Declarative Pipeline)
- **Code Quality**: SonarQube
- **Security**: npm audit
- **Monitoring**: `/health` and `/metrics` endpoints

## Pipeline Stages (All 7 Required for Top HD)
| # | Stage | Tool/Method |
|---|-------|-------------|
| 1 | Checkout | Git / GitHub |
| 2 | Build | npm ci + artefact tagging |
| 3 | Test | Jest + Coverage Report |
| 4 | Code Quality | SonarQube + Quality Gate |
| 5 | Security Scan | npm audit |
| 6 | Docker Build | Docker image with version tag |
| 7 | Deploy (Test) | Docker container on port 3001 |
| 8 | Release (Prod) | Docker container on port 3000 |
| 9 | Monitoring | /health + /metrics endpoint checks |

## Running Locally
```bash
npm install
npm start          # starts on port 3000
npm test           # run Jest tests
npm run test:ci    # run with coverage report
```

## API Endpoints
- `GET  /athletes` – get all athletes
- `POST /athletes` – add an athlete `{ name, sport }`
- `PUT  /athletes/:name` – update athlete
- `DELETE /athletes/:name` – delete athlete
- `GET  /health` – health check (monitoring)
- `GET  /metrics` – metrics (monitoring)

## Docker
```bash
docker build -t athlete-devops:v1.0 .
docker run -d -p 3000:3000 athlete-devops:v1.0
# or
docker-compose up -d
```