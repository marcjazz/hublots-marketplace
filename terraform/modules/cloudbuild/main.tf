data "google_project" "project" {}

resource "google_cloudbuild_trigger" "static_release" {
  name        = "static-release"
  description = "Trigger for static assets release when a new tag is pushed"

  github {
    owner = var.github_owner
    name  = var.github_repository
    push {
      tag = ".*"
    }
  }

  build {
    step {
      name = "gcr.io/cloud-builders/curl"
      args = [
        "-L",
        "-o",
        "admin-panel.tar.gz",
        "https://github.com/${var.github_owner}/${var.github_repository}/releases/download/$TAG_NAME/admin-panel-$TAG_NAME.tar.gz"
      ]
    }

    step {
      name = "gcr.io/cloud-builders/curl"
      args = [
        "-L",
        "-o",
        "vendor-panel.tar.gz",
        "https://github.com/${var.github_owner}/${var.github_repository}/releases/download/$TAG_NAME/vendor-panel-$TAG_NAME.tar.gz"
      ]
    }

    step {
      name       = "ubuntu" # Standard ubuntu image has tar
      entrypoint = "bash"
      args = [
        "-c",
        <<-EOT
        mkdir -p admin-dist
        tar -xzf admin-panel.tar.gz -C admin-dist --strip-components=1
        EOT
      ]
    }

    step {
      name       = "ubuntu"
      entrypoint = "bash"
      args = [
        "-c",
        <<-EOT
        mkdir -p vendor-dist
        tar -xzf vendor-panel.tar.gz -C vendor-dist --strip-components=1
        EOT
      ]
    }

    step {
      name = "gcr.io/google.com/cloudsdktool/cloud-sdk"
      args = ["gsutil", "-m", "rsync", "-r", "-d", "admin-dist", "gs://hublots-admin-static"]
    }

    step {
      name = "gcr.io/google.com/cloudsdktool/cloud-sdk"
      args = ["gsutil", "-m", "setmeta", "-h", "Cache-Control:public, max-age=3600", "gs://hublots-admin-static/**"]
    }

    step {
      name = "gcr.io/google.com/cloudsdktool/cloud-sdk"
      args = ["gsutil", "-m", "rsync", "-r", "-d", "vendor-dist", "gs://hublots-vendor-static"]
    }

    step {
      name = "gcr.io/google.com/cloudsdktool/cloud-sdk"
      args = ["gsutil", "-m", "setmeta", "-h", "Cache-Control:public, max-age=3600", "gs://hublots-vendor-static/**"]
    }

    options {
      logging = "CLOUD_LOGGING_ONLY"
    }
  }
}

# Grant Cloud Build SA permission to manage GCS objects
resource "google_project_iam_member" "cloudbuild_storage_admin" {
  project = var.project_id
  role    = "roles/storage.admin"
  member  = "serviceAccount:${data.google_project.project.number}@cloudbuild.gserviceaccount.com"
}
