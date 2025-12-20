# Deployment Plan: Static Hosting with Nginx Proxy, GCS FUSE, and Cloud CDN

## Overview
This plan details the hosting of the admin and vendor panels using a single Nginx proxy container deployed on Cloud Run, backed by GCS buckets via Cloud Storage FUSE, and accelerated by Cloud CDN.

## Architecture
- **Admin Panel Assets**: Stored in GCS bucket `hublots-admin-static`, mounted to `/var/www/admin`.
- **Vendor Panel Assets**: Stored in GCS bucket `hublots-vendor-static`, mounted to `/var/www/vendor`.
- **Nginx Proxy**: A single Cloud Run service `hublots-static-proxy` using the Second Generation execution environment to support GCS FUSE.
- **Cloud CDN**: A Global HTTP(S) Load Balancer fronts the Cloud Run service with Cloud CDN enabled for caching.
- **Storefront**: Remains on Cloud Run for SSR capabilities.

## CI/CD Flow
1. **GitHub Actions**: Builds panels and uploads tarballs as Release assets.
2. **Cloud Build**: Fetches tarballs and syncs contents to GCS buckets.
3. **Infrastructure**: Terraform manages the Load Balancer, Cloud Run service, mounting GCS buckets as volumes. The Nginx configuration is managed via a Terraform template and Secret Manager.

## Load Balancer & CDN
- **Global HTTP(S) Load Balancer**: Provides a single entry point for `admin.${var.domain}` and `vendor.${var.domain}`.
- **Cloud CDN**: Enabled on the backend service to cache static assets at the edge.
- **SSL**: Google-managed certificates for the custom domains.

## Nginx Configuration (Terraform Template)
- Routes `admin.${var.domain}` to `/var/www/admin`.
- Routes `vendor.${var.domain}` to `/var/www/vendor`.
- Includes SPA `try_files` logic for client-side routing.
- The template [`static-proxy/nginx.conf.tftpl`](static-proxy/nginx.conf.tftpl) is used to generate the final configuration.

## Domain Mappings
- `front.${var.domain}` -> `hublots-storefront`
- `admin.${var.domain}` -> Global Load Balancer IP
- `vendor.${var.domain}` -> Global Load Balancer IP

## Rollback Steps
Rollback is performed by syncing an older version of assets to the GCS buckets. Cloud CDN cache should be invalidated if an immediate rollback is required.
