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
