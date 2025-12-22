output "backend_url" {
  description = "The URL of the backend Cloud Run service."
  value       = module.compute.backend_uri
}

output "admin_panel_url" {
  description = "The URL of the admin panel Cloud Run service."
  value       = "https://admin.${var.domain}"
}

output "storefront_url" {
  description = "The URL of the storefront Cloud Run service."
  value       = "https://front.${var.domain}"
}

output "vendor_panel_url" {
  description = "The URL of the vendor panel Cloud Run service."
  value       = "https://vendor.${var.domain}"
}

output "dns_nameservers" {
  description = "The nameservers for the Cloud DNS managed zone. These must be configured with your domain registrar."
  value       = module.networking.nameservers
}

output "domain_mapping_store_cname_target" {
  description = "CNAME target for storefront domain mapping. Configure this with your domain registrar if auto-provisioning fails."
  value       = module.networking.store_cname_target
}
