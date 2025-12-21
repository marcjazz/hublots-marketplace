output "admin_bucket_name" { value = google_storage_bucket.admin_static.name }
output "vendor_bucket_name" { value = google_storage_bucket.vendor_static.name }
output "config_bucket_name" { value = google_storage_bucket.config.name }
