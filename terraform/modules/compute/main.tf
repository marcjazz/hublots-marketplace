locals {
  gar_base_url = "${var.region}-docker.pkg.dev/${var.project_id}/hublots-gar/${var.gar_repository}"
}

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
      image = "${local.gar_base_url}-backend:${var.container_image_tag}"
      ports { container_port = 9000 }
      env {
        name = "DATABASE_URL"
        value_source {
          secret_key_ref {
            secret  = var.secret_ids["neon-db-url"]
            version = "latest"
          }
        }
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
        name = "JWT_SECRET"
        value_source {
          secret_key_ref {
            secret  = var.secret_ids["jwt-secret"]
            version = "latest"
          }
        }
      }
      env {
        name = "COOKIE_SECRET"
        value_source {
          secret_key_ref {
            secret  = var.secret_ids["cookie-secret"]
            version = "latest"
          }
        }
      }
      env {
        name = "RESEND_API_KEY"
        value_source {
          secret_key_ref {
            secret  = var.secret_ids["resend-api-key"]
            version = "latest"
          }
        }
      }
      env {
        name  = "RESEND_FROM_EMAIL"
        value = var.resend_from_email
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
      image = "${local.gar_base_url}-storefront:${var.container_image_tag}"
      ports { container_port = 3000 }
      env {
        name  = "MEDUSA_BACKEND_URL"
        value = "https://api.${var.domain}"
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
        name = "REVALIDATE_SECRET"
        value_source {
          secret_key_ref {
            secret  = var.secret_ids["revalidate-secret"]
            version = "latest"
          }
        }
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
