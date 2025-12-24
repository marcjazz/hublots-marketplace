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

locals {
  secrets = {
    "jwt-secret"            = var.jwt_secret
    "cookie-secret"         = var.cookie_secret
    "resend-api-key"        = var.resend_api_key
    "revalidate-secret"     = var.revalidate_secret
    "stripe-secret-api-key" = var.stripe_secret_api_key
    "neon-db-url"           = var.neon_db_url
  }
}

resource "google_secret_manager_secret" "app_secrets" {
  for_each  = local.secrets
  secret_id = each.key
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "app_secrets" {
  for_each    = local.secrets
  secret      = google_secret_manager_secret.app_secrets[each.key].id
  secret_data = each.value
}

resource "google_secret_manager_secret_iam_member" "backend_secrets_access" {
  for_each  = google_secret_manager_secret.app_secrets
  secret_id = each.value.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${var.service_accounts["backend"].email}"
}

resource "google_secret_manager_secret_iam_member" "storefront_secrets_access" {
  secret_id = google_secret_manager_secret.app_secrets["revalidate-secret"].id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${var.service_accounts["storefront"].email}"
}

