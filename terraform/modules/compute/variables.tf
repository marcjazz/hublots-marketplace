variable "project_id" { type = string }
variable "region" { type = string }
variable "gar_repository" { type = string }
variable "container_image_tag" { type = string }
variable "service_accounts" { type = map(any) }
variable "admin_bucket_name" { type = string }
variable "vendor_bucket_name" { type = string }
variable "config_bucket_name" { type = string }
variable "domain" { type = string }
variable "resend_from_email" { type = string }

variable "medusa_publishable_key" { type = string }
variable "default_region" { type = string }
variable "site_name" { type = string }
variable "site_description" { type = string }

variable "secret_ids" {
  type        = map(string)
  description = "Map of secret names to their secret manager IDs"
}
