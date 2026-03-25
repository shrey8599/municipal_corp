# Docker Configuration

This directory contains the Docker configuration for running the Municipal Corp application.

## Files
- `Dockerfile` - Multi-stage build configuration with Java 21
- `docker-compose.yml` - Docker Compose orchestration
- `.dockerignore` - Files excluded from Docker build context

## How to Run

From the project root directory:

```bash
# Build and start the application
docker-compose -f dash_config/docker-compose.yml up --build

# Or run in detached mode (background)
docker-compose -f dash_config/docker-compose.yml up -d --build

# View logs
docker-compose -f dash_config/docker-compose.yml logs -f

# Stop the application
docker-compose -f dash_config/docker-compose.yml down
```

## Application Access
- URL: http://localhost:9999
- Port: 9999

## Useful Commands

```bash
# Rebuild without cache
docker-compose -f dash_config/docker-compose.yml build --no-cache

# View running containers
docker-compose -f dash_config/docker-compose.yml ps

# Stop and remove everything
docker-compose -f dash_config/docker-compose.yml down -v
```
