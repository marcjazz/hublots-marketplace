# Cloud DNS Zone
resource "google_dns_managed_zone" "default" {
  name        = "hublots-zone"
  dns_name    = "${var.domain}."
  description = "DNS zone for ${var.domain}"
}

# DNS Records
resource "google_dns_record_set" "store" {
  name         = "front.${var.domain}."
  type         = "CNAME"
  ttl          = 300
  managed_zone = google_dns_managed_zone.default.name
  rrdatas      = ["ghs.googlehosted.com."]
}

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
