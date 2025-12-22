resource "google_storage_bucket" "config" {
  name                        = "hublots-config"
  location                    = var.region
  uniform_bucket_level_access = true
}

resource "google_storage_bucket_object" "nginx_conf" {
  name   = "nginx.conf"
  bucket = google_storage_bucket.config.name
  content = templatefile("${path.module}/../../templates/nginx.conf.tftpl", {
    domain = var.domain
  })
}

resource "google_storage_bucket" "admin_static" {
  name                        = "hublots-admin-static"
  location                    = var.region
  uniform_bucket_level_access = true
  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }
}

resource "google_storage_bucket" "vendor_static" {
  name                        = "hublots-vendor-static"
  location                    = var.region
  uniform_bucket_level_access = true
  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }
}

resource "google_storage_bucket_iam_member" "config_proxy_access" {
  bucket = google_storage_bucket.config.name
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:cloudrun-nginx-proxy-sa@${var.project_id}.iam.gserviceaccount.com"
}

resource "google_storage_bucket_iam_member" "admin_static_public" {
  bucket = google_storage_bucket.admin_static.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

resource "google_storage_bucket_iam_member" "vendor_static_public" {
  bucket = google_storage_bucket.vendor_static.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}
resource "google_storage_bucket_iam_member" "admin_nginx_proxy_access" {
  bucket = google_storage_bucket.admin_static.name
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:cloudrun-nginx-proxy-sa@${var.project_id}.iam.gserviceaccount.com"
}

resource "google_storage_bucket_iam_member" "vendor_nginx_proxy_access" {
  bucket = google_storage_bucket.vendor_static.name
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:cloudrun-nginx-proxy-sa@${var.project_id}.iam.gserviceaccount.com"
}

resource "google_storage_bucket_iam_member" "admin_static_gha" {
  bucket = google_storage_bucket.admin_static.name
  role   = "roles/storage.admin"
  member = "serviceAccount:github-actions-sa@${var.project_id}.iam.gserviceaccount.com"
}

resource "google_storage_bucket_iam_member" "vendor_static_gha" {
  bucket = google_storage_bucket.vendor_static.name
  role   = "roles/storage.admin"
  member = "serviceAccount:github-actions-sa@${var.project_id}.iam.gserviceaccount.com"
}
