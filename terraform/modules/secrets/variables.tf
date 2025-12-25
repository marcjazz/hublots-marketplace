variable "project_id" { type = string }
variable "domain" { type = string }
variable "service_accounts" { type = map(any) }

variable "jwt_secret" { type = string }
variable "cookie_secret" { type = string }
variable "resend_api_key" { type = string }
variable "revalidate_secret" { type = string }
variable "stripe_secret_api_key" { type = string }
variable "neon_db_url" { type = string }
variable "admin_password" { type = string }
variable "seller_password" { type = string }
