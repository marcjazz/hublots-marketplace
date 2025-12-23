
module "iam" {
  source     = "./modules/iam"
  project_id = var.project_id
  region     = var.region

  depends_on = [google_project_service.services]
}

module "storage" {
  source                    = "./modules/storage"
  project_id                = var.project_id
  region                    = var.region
  domain                    = var.domain
  cloudrun_service_accounts = module.iam.service_accounts

  depends_on = [google_project_service.services, module.iam]
}

module "secrets" {
  source                = "./modules/secrets"
  project_id            = var.project_id
  ghcr_pat              = var.ghcr_pat
  github_owner          = var.github_owner
  domain                = var.domain
  service_accounts      = module.iam.service_accounts
  jwt_secret            = var.jwt_secret
  cookie_secret         = var.cookie_secret
  resend_api_key        = var.resend_api_key
  revalidate_secret     = var.revalidate_secret
  stripe_secret_api_key = var.stripe_secret_api_key
  neon_db_url           = var.neon_db_url

  depends_on = [google_project_service.services, module.iam]
}

module "compute" {
  source                 = "./modules/compute"
  project_id             = var.project_id
  region                 = var.region
  github_repository      = var.github_repository
  container_image_tag    = var.container_image_tag
  service_accounts       = module.iam.service_accounts
  admin_bucket_name      = module.storage.admin_bucket_name
  vendor_bucket_name     = module.storage.vendor_bucket_name
  config_bucket_name     = module.storage.config_bucket_name
  domain                 = var.domain
  medusa_publishable_key = var.medusa_publishable_key
  default_region         = var.default_region
  site_name              = var.site_name
  site_description       = var.site_description
  resend_from_email      = var.resend_from_email
  secret_ids             = module.secrets.secret_ids

  depends_on = [google_project_service.services, module.iam, module.storage, module.secrets]
}

module "networking" {
  source           = "./modules/networking"
  project_id       = var.project_id
  region           = var.region
  domain           = var.domain
  nginx_proxy_name = module.compute.nginx_proxy_name
  storefront_name  = module.compute.storefront_name
  backend_name     = module.compute.backend_name

  depends_on = [google_project_service.services, module.compute]
}
