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

resource "google_secret_manager_secret" "nginx_conf" {
  secret_id = "nginx-static-proxy-conf"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "nginx_conf" {
  secret      = google_secret_manager_secret.nginx_conf.id
  secret_data = templatefile("${path.module}/../../../static-proxy/nginx.conf.tftpl", { domain = var.domain })
}

resource "google_secret_manager_secret_iam_member" "nginx_conf_access" {
  secret_id = google_secret_manager_secret.nginx_conf.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${var.service_accounts["static-proxy"].email}"
}
