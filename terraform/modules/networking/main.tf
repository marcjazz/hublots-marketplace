# Cloud Run Domain Mapping for Storefront
resource "google_cloud_run_domain_mapping" "store" {
  location = var.region
  name     = "front.${var.domain}"

  metadata {
    namespace = var.project_id
  }

  spec {
    route_name = var.storefront_name
  }
}

resource "google_cloud_run_domain_mapping" "admin" {
  location = var.region
  name     = "admin.${var.domain}"

  metadata {
    namespace = var.project_id
  }

  spec {
    route_name = var.nginx_proxy_name
  }
}

resource "google_cloud_run_domain_mapping" "vendor" {
  location = var.region
  name     = "vendor.${var.domain}"

  metadata {
    namespace = var.project_id
  }

  spec {
    route_name = var.nginx_proxy_name
  }
}

# Service IAM for Public Access
resource "google_cloud_run_service_iam_member" "public" {
  for_each = toset([var.nginx_proxy_name, var.storefront_name])
  location = var.region
  project  = var.project_id
  service  = each.key
  role     = "roles/run.invoker"
  member   = "allUsers"
}
