# Managed SSL Certificate
resource "google_compute_managed_ssl_certificate" "default" {
  name = "hublots-lb-cert"
  managed {
    domains = ["admin.${var.domain}", "vendor.${var.domain}"]
  }
}

# Serverless NEG for Static Proxy
resource "google_compute_region_network_endpoint_group" "static_proxy_neg" {
  name                  = "hublots-static-proxy-neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.region
  cloud_run {
    service = var.static_proxy_name
  }
}

# Backend Service with Cloud CDN enabled
resource "google_compute_backend_service" "static_proxy" {
  name        = "hublots-static-proxy-backend"
  protocol    = "HTTP"
  port_name   = "http"
  timeout_sec = 30
  enable_cdn  = true

  backend {
    group = google_compute_region_network_endpoint_group.static_proxy_neg.id
  }

  cdn_policy {
    cache_mode                   = "CACHE_ALL_STATIC"
    default_ttl                  = 3600
    client_ttl                   = 3600
    max_ttl                      = 86400
    negative_caching             = true
    serve_while_stale            = 86400
    signed_url_cache_max_age_sec = 3600
  }
}

# URL Map
resource "google_compute_url_map" "default" {
  name            = "hublots-lb-url-map"
  default_service = google_compute_backend_service.static_proxy.id
}

# HTTPS Target Proxy
resource "google_compute_target_https_proxy" "default" {
  name             = "hublots-lb-https-proxy"
  url_map          = google_compute_url_map.default.id
  ssl_certificates = [google_compute_managed_ssl_certificate.default.id]
}

# Global Forwarding Rule
resource "google_compute_global_forwarding_rule" "default" {
  name       = "hublots-lb-forwarding-rule"
  target     = google_compute_target_https_proxy.default.id
  port_range = "443"
}

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

resource "google_dns_record_set" "store_admin" {
  name         = "admin.${var.domain}."
  type         = "A"
  ttl          = 300
  managed_zone = google_dns_managed_zone.default.name
  rrdatas      = [google_compute_global_forwarding_rule.default.ip_address]
}

resource "google_dns_record_set" "store_vendor" {
  name         = "vendor.${var.domain}."
  type         = "A"
  ttl          = 300
  managed_zone = google_dns_managed_zone.default.name
  rrdatas      = [google_compute_global_forwarding_rule.default.ip_address]
}

# Cloud Run Domain Mapping for Storefront
resource "google_cloud_run_domain_mapping" "store" {
  location = var.region
  name     = "front.${var.domain}"
  metadata { namespace = var.project_id }
  spec { route_name = var.storefront_name }
}

# Service IAM for Public Access
resource "google_cloud_run_service_iam_member" "public" {
  for_each = toset([var.static_proxy_name, var.storefront_name])
  location = var.region
  project  = var.project_id
  service  = each.key
  role     = "roles/run.invoker"
  member   = "allUsers"
}
