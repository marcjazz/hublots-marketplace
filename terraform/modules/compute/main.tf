# Backend Service
resource "google_cloud_run_v2_service" "backend" {
  project      = var.project_id
  location     = var.region
  name         = "hublots-backend"
  ingress      = "INGRESS_TRAFFIC_ALL"
  launch_stage = "BETA"

  template {
    service_account = var.service_accounts["backend"].email

    containers {
      name  = "backend"
      image = "${var.region}-docker.pkg.dev/${var.project_id}/ghcr-io-mirror/${var.github_owner}/${var.github_repository}-backend:${var.container_image_tag}"
      ports { container_port = 9000 }
      env {
        name  = "DATABASE_URL"
        value = var.neon_db_url
      }
      env {
        name  = "REDIS_URL"
        value = "redis://localhost:6379"
      }
      env {
        name  = "CORS_ORIGINS"
        value = "https://admin.${var.domain},https://vendor.${var.domain},https://front.${var.domain}"
      }
      env {
        name  = "JWT_SECRET"
        value = var.jwt_secret
      }
      env {
        name  = "COOKIE_SECRET"
        value = var.cookie_secret
      }
      env {
        name  = "RESEND_API_KEY"
        value = var.resend_api_key
      }
      env {
        name  = "RESEND_FROM_EMAIL"
        value = var.resend_from_email
      }
      env {
        name  = "STRIPE_SECRET_API_KEY"
        value = var.stripe_secret_api_key
      }
    }
    containers {
      name  = "redis"
      image = "redis:7-alpine"
    }
  }
}

# Storefront Service
resource "google_cloud_run_v2_service" "storefront" {
  project  = var.project_id
  location = var.region
  name     = "hublots-storefront"
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = var.service_accounts["storefront"].email
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/ghcr-io-mirror/${var.github_owner}/${var.github_repository}-storefront:${var.container_image_tag}"
      ports { container_port = 3000 }
      env {
        name  = "MEDUSA_BACKEND_URL"
        value = google_cloud_run_v2_service.backend.uri
      }
      env {
        name  = "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY"
        value = var.medusa_publishable_key
      }
      env {
        name  = "NEXT_PUBLIC_BASE_URL"
        value = "https://front.${var.domain}"
      }
      env {
        name  = "NEXT_PUBLIC_DEFAULT_REGION"
        value = var.default_region
      }
      env {
        name  = "REVALIDATE_SECRET"
        value = var.revalidate_secret
      }
      env {
        name  = "NEXT_PUBLIC_SITE_NAME"
        value = var.site_name
      }
      env {
        name  = "NEXT_PUBLIC_SITE_DESCRIPTION"
        value = var.site_description
      }
    }
  }
}

# Nginx Static Proxy Service
resource "google_cloud_run_v2_service" "nginx_proxy" {
  project  = var.project_id
  location = var.region
  name     = "hublots-nginx-proxy"
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account       = var.service_accounts["nginx-proxy"].email
    execution_environment = "EXECUTION_ENVIRONMENT_GEN2"

    containers {
      image = "nginx:alpine"
      ports { container_port = 80 }
      volume_mounts {
        name       = "admin-assets"
        mount_path = "/var/www/admin"
      }
      volume_mounts {
        name       = "vendor-assets"
        mount_path = "/var/www/vendor"
      }
      volume_mounts {
        name       = "nginx-conf"
        mount_path = "/etc/nginx/conf.d"
      }
    }

    volumes {
      name = "admin-assets"
      gcs {
        bucket    = var.admin_bucket_name
        read_only = true
      }
    }
    volumes {
      name = "vendor-assets"
      gcs {
        bucket    = var.vendor_bucket_name
        read_only = true
      }
    }
    volumes {
      name = "nginx-conf"
      gcs {
        bucket    = var.config_bucket_name
        read_only = true
      }
    }
  }
}

