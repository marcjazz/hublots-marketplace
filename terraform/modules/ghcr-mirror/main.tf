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
        password_secret_version = var.ghcr_pat_secret_version_name
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

  lifecycle {
    ignore_changes = [remote_repository_config[0].upstream_credentials]
  }
}

resource "google_artifact_registry_repository_iam_member" "ghcr_io_mirror_reader" {
  for_each   = var.service_accounts
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
  member     = "serviceAccount:service-${var.project_number}@serverless-robot-prod.iam.gserviceaccount.com"
}
