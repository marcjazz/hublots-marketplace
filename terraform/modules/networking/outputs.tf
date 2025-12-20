output "nameservers" {
  description = "The nameservers for the Cloud DNS managed zone."
  value       = google_dns_managed_zone.default.name_servers
}

output "store_cname_target" {
  description = "CNAME target for storefront domain mapping."
  value       = google_cloud_run_domain_mapping.store.status[0].resource_records[0].rrdata
}

output "lb_ip" {
  description = "Global Load Balancer IP address."
  value       = google_compute_global_forwarding_rule.default.ip_address
}
