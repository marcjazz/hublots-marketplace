output "ghcr_pat_secret_version_name" { value = google_secret_manager_secret_version.ghcr_pat.name }
output "nginx_conf_secret_id" { value = google_secret_manager_secret.nginx_conf.secret_id }
