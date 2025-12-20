output "backend_url" {
  description = "The URL of the backend Cloud Run service."
  value       = google_cloud_run_v2_service.backend.uri
}

output "admin_panel_url" {
  description = "The URL of the admin panel Cloud Run service."
  value       = google_cloud_run_v2_service.admin_panel.uri
}

output "storefront_url" {
  description = "The URL of the storefront Cloud Run service."
  value       = google_cloud_run_v2_service.storefront.uri
}

output "vendor_panel_url" {
  description = "The URL of the vendor panel Cloud Run service."
  value       = google_cloud_run_v2_service.vendor_panel.uri
}

output "dns_nameservers" {
  description = "The nameservers for the Cloud DNS managed zone. These must be configured with your domain registrar."
  value       = google_dns_managed_zone.default.name_servers
}

output "domain_mapping_store_cname_target" {
  description = "CNAME target for store.kdmarc.xyz. Configure this with your domain registrar if auto-provisioning fails."
  value       = google_cloud_run_domain_mapping.store.status[0].resource_records[0].rrdata
}

output "domain_mapping_admin_cname_target" {
  description = "CNAME target for store-admin.kdmarc.xyz. Configure this with your domain registrar if auto-provisioning fails."
  value       = google_cloud_run_domain_mapping.store_admin.status[0].resource_records[0].rrdata
}

output "domain_mapping_vendor_cname_target" {
  description = "CNAME target for store-vendor.kdmarc.xyz. Configure this with your domain registrar if auto-provisioning fails."
  value       = google_cloud_run_domain_mapping.store_vendor.status[0].resource_records[0].rrdata
}
