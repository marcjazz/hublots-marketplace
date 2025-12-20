output "backend_name" { value = google_cloud_run_v2_service.backend.name }
output "storefront_name" { value = google_cloud_run_v2_service.storefront.name }
output "static_proxy_name" { value = google_cloud_run_v2_service.static_proxy.name }

output "backend_uri" { value = google_cloud_run_v2_service.backend.uri }
output "storefront_uri" { value = google_cloud_run_v2_service.storefront.uri }
output "static_proxy_uri" { value = google_cloud_run_v2_service.static_proxy.uri }
