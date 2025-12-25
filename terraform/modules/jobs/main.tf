locals {
  job_image = "${var.region}-docker.pkg.dev/${var.project_id}/ghcr-io-mirror/${var.github_repository}-backend:${var.container_image_tag}"
}

resource "random_id" "run_id" {
  byte_length = 4
  # This triggers a new ID (and thus a new run) only when the image changes
  keepers = {
    image = local.job_image
  }
}

resource "google_storage_bucket" "sample_images" {
  name                        = "${var.project_id}-sample-images"
  location                    = var.region
  uniform_bucket_level_access = true
  force_destroy               = true
}

resource "google_storage_bucket_iam_member" "sample_images_public" {
  bucket = google_storage_bucket.sample_images.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

resource "google_storage_bucket_object" "sample_images" {
  for_each     = fileset("${path.module}/../../../backend/static/sample-images", "*.jpeg")
  name         = each.value
  bucket       = google_storage_bucket.sample_images.name
  source       = "${path.module}/../../../backend/static/sample-images/${each.value}"
  content_type = "image/jpeg"
}

resource "google_cloud_run_v2_job" "medusa_init" {
  name     = "medusa-init-job"
  location = var.region

  launch_stage = "BETA"
  # This triggers the job whenever the image tag changes
  start_execution_token = "run-${random_id.run_id.hex}"

  template {
    template {
      max_retries     = 0
      timeout         = "1800s"
      service_account = var.service_accounts["backend"].email

      containers {
        name  = "medusa-init"
        image = local.job_image

        command = ["/bin/sh", "-c"]
        args = [
          "yarn medusa db:migrate && yarn medusa exec ./src/scripts/seed.js"
        ]

        env {
          name = "DATABASE_URL"
          value_source {
            secret_key_ref {
              secret  = var.secret_ids["neon-db-url"]
              version = "latest"
            }
          }
        }
        env {
          name  = "SAMPLE_IMAGES_BUCKET"
          value = google_storage_bucket.sample_images.name
        }
      }
    }
  }

  depends_on = [google_storage_bucket_object.sample_images]

  lifecycle {
    ignore_changes = [start_execution_token]
  }
}
