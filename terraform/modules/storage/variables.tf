variable "project_id" {
  type = string
}

variable "region" {
  type = string
}

variable "domain" {
  type = string
}

variable "cloudrun_service_accounts" {
  type = map(object({
    email = string
  }))
  default = {}
}
