# Labour App Deployment Guide

This guide explains how to deploy the Labour App to a VPS using Docker.

## Prerequisites

- A VPS (Virtual Private Server) with Ubuntu/Debian.
- Docker and Docker Compose installed on the VPS.
- Git installed on the VPS.

## Deployment Steps

1.  **Clone the Repository**
    ```bash
    git clone <YOUR_REPO_URL>
    cd labour
    ```

2.  **Configure Environment Variables**
    Create a `.env.local` file in the root directory. You can copy the example:
    ```bash
    cp .env.example .env.local
    ```
    Then edit it with your actual values:
    ```bash
    nano .env.local
    ```
    Required variables:
    - `EMAIL_USER`: Your email for sending notifications (if used).
    - `EMAIL_PASS`: Your email password/app password.
    - `NEXT_PUBLIC_APP_URL`: The URL of your app (e.g., `http://your-vps-ip:3000`).

3.  **Run with Docker Compose**
    Build and start the container:
    ```bash
    docker-compose -f docker-compose.prod.yml up -d --build
    ```

4.  **Verify Deployment**
    Access your app at `http://your-vps-ip:3000`.

## Troubleshooting Permissions

If you encounter errors about saving data or uploads, you may need to fix folder permissions on your VPS:

```bash
# Set ownership to the non-root user (ID 1001) used by the container
chown -R 1001:1001 data uploads
chmod -R 755 data uploads
```

## Persistence

- **Data**: All application data is stored in the `data/` directory and is persisted across restarts.
- **Uploads**: All uploaded files (images, documents) are stored in the `uploads/` directory and are persisted.

## Updates

To update the application after pushing changes to GitHub:

1.  Pull the latest changes:
    ```bash
    git pull origin main
    ```
2.  Rebuild and restart the container:
    ```bash
    docker-compose -f docker-compose.prod.yml up -d --build
    ```
