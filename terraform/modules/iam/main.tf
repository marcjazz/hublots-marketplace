resource "google_service_account" "cloudrun" {
  for_each     = toset(["backend", "storefront", "nginx-proxy"])
  project      = var.project_id
  account_id   = "cloudrun-${each.key}-sa"
  display_name = "Cloud Run Service Account for ${each.key}"
}
