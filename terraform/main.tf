# Enable required APIs
resource "google_project_service" "services" {
  for_each = toset([
    "run.googleapis.com",
    "dns.googleapis.com",
    "iam.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "compute.googleapis.com",
  ])
  project            = var.project_id
  service            = each.key
  disable_on_destroy = false
}

data "google_project" "project" {
  project_id = var.project_id
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
        password_secret_version = module.secrets.ghcr_pat_secret_version_name
      }
    }
  }
  cleanup_policies {
    id     = "cleanup-policy-1"
    action = "DELETE"
    condition {
      older_than = "86400s" # 1 day
      tag_state  = "UNTAGGED"
    }
  }

  depends_on = [google_project_service.services, module.secrets]
}

resource "google_artifact_registry_repository_iam_member" "ghcr_io_mirror_reader" {
  for_each   = module.iam.service_accounts
  repository = google_artifact_registry_repository.ghcr_io_mirror.name
  location   = var.region
  project    = var.project_id
  role       = "roles/artifactregistry.reader"
  member     = "serviceAccount:${each.value.email}"
}

resource "google_artifact_registry_repository_iam_member" "cloud_run_agent" {
  repository = google_artifact_registry_repository.ghcr_io_mirror.name
  location   = var.region
  project    = var.project_id
  role       = "roles/artifactregistry.reader"
  member     = "serviceAccount:service-${data.google_project.project.number}@serverless-robot-prod.iam.gserviceaccount.com"
}
