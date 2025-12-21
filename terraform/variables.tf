variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region for resources"
  type        = string
  default     = "europe-west1"
}

variable "domain" {
  description = "Root domain for the applications"
  type        = string
  default     = "kdmarc.xyz"
}

variable "neon_db_url" {
  description = "Neon PostgreSQL connection URL"
  type        = string
}

variable "container_image_tag" {
  description = "Tag for container images (e.g., latest)"
  type        = string
  default     = "latest"
}

variable "github_repository" {
  description = "GitHub repository for GHCR images"
  type        = string
}

variable "github_owner" {
  description = "GitHub owner or organization for GHCR images"
  type        = string
}

variable "environment" {
  description = "Deployment environment (e.g., dev, prod)"
  type        = string
  default     = "dev"
}

variable "ghcr_pat" {
  description = "GitHub Personal Access Token for accessing ghcr.io"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret key for authentication"
  type        = string
  sensitive   = true
}

variable "cookie_secret" {
  description = "Cookie secret key for session management"
  type        = string
  sensitive   = true
}

variable "algolia_api_key" {
  description = "Algolia API Key"
  type        = string
  sensitive   = true
}

variable "algolia_app_id" {
  description = "Algolia Application ID"
  type        = string
}

variable "stripe_secret_api_key" {
  description = "Stripe Secret API Key"
  type        = string
  sensitive   = true
}

variable "stripe_connected_accounts_webhook_secret" {
  description = "Stripe Connected Accounts Webhook Secret"
  type        = string
  sensitive   = true
}

variable "resend_api_key" {
  description = "Resend API Key for email services"
  type        = string
  sensitive   = true
}

variable "resend_from_email" {
  description = "Resend 'from' email address"
  type        = string
}

variable "medusa_publishable_key" {
  description = "Medusa Publishable Key"
  type        = string
}

variable "default_region" {
  description = "Default region for the application"
  type        = string
}

variable "stripe_publishable_key" {
  description = "Stripe Publishable Key"
  type        = string
}

variable "revalidate_secret" {
  description = "Secret key for revalidation"
  type        = string
  sensitive   = true
}

variable "site_name" {
  description = "Site name for SEO"
  type        = string
}

variable "site_description" {
  description = "Site description for SEO"
  type        = string
}

variable "algolia_id_storefront" {
  description = "Algolia ID for storefront"
  type        = string
}

variable "algolia_search_key_storefront" {
  description = "Algolia Search Key for storefront"
  type        = string
  sensitive   = true
}