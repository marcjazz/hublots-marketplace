resource "google_service_account" "cloudrun" {
  for_each     = toset(["backend", "storefront", "static-proxy"])
  project      = var.project_id
  account_id   = "cloudrun-${each.key}-sa"
  display_name = "Cloud Run Service Account for ${each.key}"
}

resource "google_service_account" "github_actions" {
  project      = var.project_id
  account_id   = "github-actions-sa"
  display_name = "Service Account for GitHub Actions"
}
