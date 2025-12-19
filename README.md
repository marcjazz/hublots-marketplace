# Hublots Marketplace

This repository contains the monorepo for the Hublots Marketplace applications.

## Applications

- [Admin Panel](./admin-panel/README.md)
- [Backend](./backend/README.md)
- [Storefront](./storefront/README.md)
- [Vendor Panel](./vendor-panel/README.md)

## Docker Images

Docker images for each application are built and pushed to GitHub Container Registry (`ghcr.io`) on every tag push (e.g., `admin-panel-v1.0.0`).

### Build and Push Instructions

To manually build and push a Docker image for an application, navigate to the respective application directory and run the following commands:

#### Admin Panel

```bash
docker build -t ghcr.io/<YOUR_GITHUB_USERNAME>/hublots-marketplace/admin-panel:<TAG> -f admin-panel/Dockerfile .
docker push ghcr.io/<YOUR_GITHUB_USERNAME>/hublots-marketplace/admin-panel:<TAG>
```

#### Backend

```bash
docker build -t ghcr.io/<YOUR_GITHUB_USERNAME>/hublots-marketplace/backend:<TAG> -f backend/Dockerfile .
docker push ghcr.io/<YOUR_GITHUB_USERNAME>/hublots-marketplace/backend:<TAG>
```

#### Storefront

```bash
docker build -t ghcr.io/<YOUR_GITHUB_USERNAME>/hublots-marketplace/storefront:<TAG> -f storefront/Dockerfile .
docker push ghcr.io/<YOUR_GITHUB_USERNAME>/hublots-marketplace/storefront:<TAG>
```

#### Vendor Panel

```bash
docker build -t ghcr.io/<YOUR_GITHUB_USERNAME>/hublots-marketplace/vendor-panel:<TAG> -f vendor-panel/Dockerfile .
docker push ghcr.io/<YOUR_GITHUB_USERNAME>/hublots-marketplace/vendor-panel:<TAG>
```

Replace `<YOUR_GITHUB_USERNAME>` with your GitHub username and `<TAG>` with the desired image tag (e.g., `v1.0.0`).
