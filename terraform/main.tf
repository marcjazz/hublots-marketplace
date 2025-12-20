# Enable required APIs
resource "google_project_service" "services" {
  for_each = toset([
    "run.googleapis.com",
    "dns.googleapis.com",
    "iam.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "compute.googleapis.com",
  ])
  project            = var.project_id
  service            = each.key
  disable_on_destroy = false
}

module "iam" {
  source     = "./modules/iam"
  project_id = var.project_id
  region     = var.region
  depends_on = [google_project_service.services]
}

module "storage" {
  source     = "./modules/storage"
  region     = var.region
  depends_on = [google_project_service.services]
}

module "secrets" {
  source           = "./modules/secrets"
  project_id       = var.project_id
  ghcr_pat         = var.ghcr_pat
  github_owner     = var.github_owner
  domain           = var.domain
  service_accounts = module.iam.service_accounts
  depends_on       = [google_project_service.services, module.iam]
}

module "compute" {
  source                                   = "./modules/compute"
  project_id                               = var.project_id
  region                                   = var.region
  github_owner                             = var.github_owner
  github_repository                        = var.github_repository
  container_image_tag                      = var.container_image_tag
  service_accounts                         = module.iam.service_accounts
  admin_bucket_name                        = module.storage.admin_bucket_name
  vendor_bucket_name                       = module.storage.vendor_bucket_name
  nginx_conf_secret_id                     = module.secrets.nginx_conf_secret_id
  neon_db_url                              = var.neon_db_url
  domain                                   = var.domain
  jwt_secret                               = var.jwt_secret
  cookie_secret                            = var.cookie_secret
  algolia_api_key                          = var.algolia_api_key
  algolia_app_id                           = var.algolia_app_id
  stripe_secret_api_key                    = var.stripe_secret_api_key
  stripe_connected_accounts_webhook_secret = var.stripe_connected_accounts_webhook_secret
  resend_api_key                           = var.resend_api_key
  resend_from_email                        = var.resend_from_email
  depends_on                               = [google_project_service.services, module.iam, module.storage, module.secrets]
}

module "networking" {
  source            = "./modules/networking"
  project_id        = var.project_id
  region            = var.region
  domain            = var.domain
  static_proxy_name = module.compute.static_proxy_name
  storefront_name   = module.compute.storefront_name
  depends_on        = [google_project_service.services, module.compute]
}

resource "google_artifact_registry_repository" "ghcr_io_mirror" {
  location      = var.region
  repository_id = "ghcr-io-mirror"
  description   = "Mirror for ghcr.io images"
  format        = "DOCKER"
  mode          = "REMOTE_REPOSITORY"
  remote_repository_config {
    docker_repository {
      custom_repository {
        uri = "https://ghcr.io"
      }
    }
    upstream_credentials {
      username_password_credentials {
        username                = var.github_owner
        password_secret_version = module.secrets.ghcr_pat_secret_version_name
      }
    }
  }
  depends_on = [google_project_service.services, module.secrets]
}

resource "google_artifact_registry_repository_iam_member" "ghcr_io_mirror_reader" {
  for_each   = module.iam.service_accounts
  repository = google_artifact_registry_repository.ghcr_io_mirror.name
  location   = var.region
  project    = var.project_id
  role       = "roles/artifactregistry.reader"
  member     = "serviceAccount:${each.value.email}"
}
