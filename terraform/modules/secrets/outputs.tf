output "secret_versions" {
  value = {
    for k, v in google_secret_manager_secret_version.app_secrets : k => v.name
  }
}

output "secret_ids" {
  value = {
    for k, v in google_secret_manager_secret.app_secrets : k => v.secret_id
  }
}
