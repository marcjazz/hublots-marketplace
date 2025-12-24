variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The region to create resources in"
  type        = string
}

variable "github_owner" {
  description = "The GitHub owner (user or organization)"
  type        = string
}

variable "ghcr_pat_secret_version_name" {
  description = "The name of the secret version containing the GHCR PAT"
  type        = string
}

variable "service_accounts" {
  description = "Map of service accounts to grant reader access to"
  type        = map(any)
}

variable "project_number" {
  description = "The GCP project number"
  type        = string
}
