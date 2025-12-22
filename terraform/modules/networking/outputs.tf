output "store_cname_target" {
  description = "CNAME target for storefront domain mapping."
  value       = google_cloud_run_domain_mapping.store.status[0].resource_records[0].rrdata
}