data "google_project" "project" {}

resource "google_secret_manager_secret" "ghcr_pat" {
  secret_id = "ghcr-pat-secret"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "ghcr_pat" {
  secret      = google_secret_manager_secret.ghcr_pat.id
  secret_data = var.ghcr_pat
}

resource "google_secret_manager_secret_iam_member" "ghcr_pat_access" {
  secret_id = google_secret_manager_secret.ghcr_pat.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:service-${data.google_project.project.number}@gcp-sa-artifactregistry.iam.gserviceaccount.com"
}

