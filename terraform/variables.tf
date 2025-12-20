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
