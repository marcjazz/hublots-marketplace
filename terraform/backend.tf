
terraform {
  backend "gcs" {
    bucket  = "hublots-marketplace-tf-state"
    prefix  = "terraform/state"
  }
}
