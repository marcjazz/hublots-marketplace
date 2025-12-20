terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

data "google_project" "project" {}

# Enable required APIs
resource "google_project_service" "services" {
  for_each = toset([
    "run.googleapis.com",
    "dns.googleapis.com",
    "iam.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
  ])
  project            = var.project_id
  service            = each.key
  disable_on_destroy = false
}


resource "google_secret_manager_secret" "ghcr_pat_secret" {
  secret_id = "ghcr-pat-secret"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "ghcr_pat_secret_version" {
  secret      = google_secret_manager_secret.ghcr_pat_secret.id
  secret_data = var.ghcr_pat # This variable needs to be defined
}

resource "google_secret_manager_secret_iam_member" "ghcr_pat_secret_access" {
  secret_id = google_secret_manager_secret.ghcr_pat_secret.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:service-${data.google_project.project.number}@gcp-sa-artifactregistry.iam.gserviceaccount.com"
}

resource "google_artifact_registry_repository" "ghcr_io_mirror" {
  location      = var.region
  repository_id = "ghcr-io-mirror"
  description   = "Mirror for ghcr.io images"
  format        = "DOCKER"
  mode          = "REMOTE_REPOSITORY"
  remote_repository_config {
    docker_repository {
      custom_repository {
        uri = "https://ghcr.io"
      }
    }
    upstream_credentials {
      username_password_credentials {
        username                = var.github_owner
        password_secret_version = google_secret_manager_secret_version.ghcr_pat_secret_version.name
      }
    }
  }
  labels = {
    env = var.environment
  }
}

# Service Accounts
resource "google_service_account" "cloudrun_service_accounts" {
  for_each     = toset(["admin-panel", "backend", "storefront", "vendor-panel"])
  project      = var.project_id
  account_id   = "cloudrun-${each.key}-sa"
  display_name = "Cloud Run Service Account for ${each.key}"
}

resource "google_artifact_registry_repository_iam_member" "ghcr_io_mirror_reader" {
  for_each   = google_service_account.cloudrun_service_accounts
  repository = google_artifact_registry_repository.ghcr_io_mirror.name
  location   = var.region
  project    = var.project_id
  role       = "roles/artifactregistry.reader"
  member     = "serviceAccount:${each.value.email}"
}

# Backend Service (with Redis sidecar)
resource "google_cloud_run_v2_service" "backend" {
  project      = var.project_id
  location     = var.region
  name         = "hublots-backend"
  ingress      = "INGRESS_TRAFFIC_ALL"
  launch_stage = "BETA"

  template {
    service_account = google_service_account.cloudrun_service_accounts["backend"].email

    containers {
      name  = "backend"
      image = "${var.region}-docker.pkg.dev/${var.project_id}/ghcr-io-mirror/${var.github_owner}/${var.github_repository}/backend:${var.container_image_tag}"
      ports {
        container_port = 8080
      }
      resources {
        cpu_idle = true
        limits = {
          cpu    = "1000m"
          memory = "512Mi"
        }
      }
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
        value = "https://store-admin.${var.domain},https://store.${var.domain},https://store-vendor.${var.domain}"
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
        name  = "ALGOLIA_API_KEY"
        value = var.algolia_api_key
      }
      env {
        name  = "ALGOLIA_APP_ID"
        value = var.algolia_app_id
      }
      env {
        name  = "STRIPE_SECRET_API_KEY"
        value = var.stripe_secret_api_key
      }
      env {
        name  = "STRIPE_CONNECTED_ACCOUNTS_WEBHOOK_SECRET"
        value = var.stripe_connected_accounts_webhook_secret
      }
      env {
        name  = "RESEND_API_KEY"
        value = var.resend_api_key
      }
      env {
        name  = "RESEND_FROM_EMAIL"
        value = var.resend_from_email
      }
    }

    # Redis Sidecar
    containers {
      name  = "redis"
      image = "redis:7-alpine"
      resources {
        limits = {
          cpu    = "500m"
          memory = "256Mi"
        }
      }
      startup_probe {
        timeout_seconds   = 240
        period_seconds    = 10
        failure_threshold = 3
        tcp_socket {
          port = 6379
        }
      }
    }
  }

  depends_on = [
    google_project_service.services,
    google_artifact_registry_repository.ghcr_io_mirror,
    google_artifact_registry_repository_iam_member.ghcr_io_mirror_reader,
  ]
}

# Admin Panel Service
resource "google_cloud_run_v2_service" "admin_panel" {
  project  = var.project_id
  location = var.region
  name     = "hublots-admin-panel"
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.cloudrun_service_accounts["admin-panel"].email
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/ghcr-io-mirror/${var.github_owner}/${var.github_repository}/admin-panel:${var.container_image_tag}"
      ports {
        container_port = 3000
      }
      resources {
        cpu_idle = true
        limits = {
          cpu    = "1000m"
          memory = "256Mi"
        }
      }
      env {
        name  = "VITE_MEDUSA_BACKEND_URL"
        value = google_cloud_run_v2_service.backend.uri
      }
    }
  }
  depends_on = [
    google_project_service.services,
    google_artifact_registry_repository.ghcr_io_mirror,
    google_artifact_registry_repository_iam_member.ghcr_io_mirror_reader,
  ]
}

# Storefront Service
resource "google_cloud_run_v2_service" "storefront" {
  project  = var.project_id
  location = var.region
  name     = "hublots-storefront"
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.cloudrun_service_accounts["storefront"].email
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/ghcr-io-mirror/${var.github_owner}/${var.github_repository}/storefront:${var.container_image_tag}"
      ports {
        container_port = 3000
      }
      resources {
        cpu_idle = true
        limits = {
          cpu    = "1000m"
          memory = "512Mi"
        }
      }
      env {
        name  = "NEXT_PUBLIC_MEDUSA_BACKEND_URL"
        value = google_cloud_run_v2_service.backend.uri
      }
    }
  }
  depends_on = [
    google_project_service.services,
    google_artifact_registry_repository.ghcr_io_mirror,
    google_artifact_registry_repository_iam_member.ghcr_io_mirror_reader,
  ]
}

# Vendor Panel Service
resource "google_cloud_run_v2_service" "vendor_panel" {
  project  = var.project_id
  location = var.region
  name     = "hublots-vendor-panel"
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.cloudrun_service_accounts["vendor-panel"].email
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/ghcr-io-mirror/${var.github_owner}/${var.github_repository}/backend:${var.container_image_tag}"
      ports {
        container_port = 3000
      }
      resources {
        cpu_idle = true
        limits = {
          cpu    = "1000m"
          memory = "256Mi"
        }
      }
      env {
        name  = "VITE_MEDUSA_BACKEND_URL"
        value = google_cloud_run_v2_service.backend.uri
      }
    }
  }
  depends_on = [
    google_project_service.services,
    google_artifact_registry_repository.ghcr_io_mirror,
    google_artifact_registry_repository_iam_member.ghcr_io_mirror_reader,
  ]
}

# Make services public
resource "google_cloud_run_service_iam_member" "public_access" {
  for_each = {
    backend      = google_cloud_run_v2_service.backend.name
    admin_panel  = google_cloud_run_v2_service.admin_panel.name
    storefront   = google_cloud_run_v2_service.storefront.name
    vendor_panel = google_cloud_run_v2_service.vendor_panel.name
  }
  location = var.region
  project  = var.project_id
  service  = each.value
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Domain Mappings
resource "google_cloud_run_domain_mapping" "store" {
  location = var.region
  name     = "store.${var.domain}"
  metadata {
    namespace = var.project_id
  }
  spec {
    route_name = google_cloud_run_v2_service.storefront.name
  }
}

resource "google_cloud_run_domain_mapping" "store_admin" {
  location = var.region
  name     = "store-admin.${var.domain}"
  metadata {
    namespace = var.project_id
  }
  spec {
    route_name = google_cloud_run_v2_service.admin_panel.name
  }
}

resource "google_cloud_run_domain_mapping" "store_vendor" {
  location = var.region
  name     = "store-vendor.${var.domain}"
  metadata {
    namespace = var.project_id
  }
  spec {
    route_name = google_cloud_run_v2_service.vendor_panel.name
  }
}

# Cloud DNS Zone
resource "google_dns_managed_zone" "default" {
  name        = "hublots-zone"
  dns_name    = "${var.domain}."
  description = "DNS zone for ${var.domain}"
}

# DNS Records for Mappings
# Note: This assumes the domain mappings return resource records. 
# Sometimes they don't immediately, or require manual verification first.
# But we can try to provision them.
resource "google_dns_record_set" "store" {
  name         = "store.${var.domain}."
  type         = "CNAME"
  ttl          = 300
  managed_zone = google_dns_managed_zone.default.name
  rrdatas      = ["ghs.googlehosted.com."]
}

resource "google_dns_record_set" "store_admin" {
  name         = "store-admin.${var.domain}."
  type         = "CNAME"
  ttl          = 300
  managed_zone = google_dns_managed_zone.default.name
  rrdatas      = ["ghs.googlehosted.com."]
}

resource "google_dns_record_set" "store_vendor" {
  name         = "store-vendor.${var.domain}."
  type         = "CNAME"
  ttl          = 300
  managed_zone = google_dns_managed_zone.default.name
  rrdatas      = ["ghs.googlehosted.com."]
}
