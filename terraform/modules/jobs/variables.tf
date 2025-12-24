variable "project_id" { type = string }
variable "region" { type = string }
variable "github_repository" { type = string }
variable "container_image_tag" { type = string }
variable "service_accounts" { type = map(any) }
variable "secret_ids" {
  type        = map(string)
  description = "Map of secret names to their secret manager IDs"
}
