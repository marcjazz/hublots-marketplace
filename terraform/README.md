# Hublots Marketplace GCP Deployment with Terraform

This Terraform script deploys the Hublots Marketplace applications (backend, admin-panel, storefront, vendor-panel) to Google Cloud Platform (GCP) using a low-cost, serverless-first approach.

## Architecture Overview

*   **Applications:** Deployed as Google Cloud Run services. Cloud Run is a fully managed serverless platform that automatically scales your stateless containers. This minimizes operational overhead and costs as you only pay for the compute resources consumed during request processing.
*   **Database:** Utilizing Neon Tech (or any external PostgreSQL-compatible service) for the database. This keeps the database costs separate and potentially lower than managed GCP database services, especially for hobby or small-scale projects. The connection string is provided as a Terraform variable.
*   **Container Registry:** GitHub Container Registry (GHCR) is used for storing Docker images. This integrates well with GitHub-based CI/CD workflows and avoids costs associated with GCP Artifact Registry if not already in use.
*   **DNS & Domain Mappings:** Google Cloud DNS manages the domain `kdmarc.xyz` and its subdomains. Cloud Run Domain Mappings are used to associate custom domains with the deployed services, providing clean URLs and managed SSL certificates.

## Deployed Services

| Application   | Description                                     | Cloud Run Service Name        | Custom Domain Mapping           |
| :------------ | :---------------------------------------------- | :---------------------------- | :------------------------------ |
| `backend`     | Medusa.js backend API                           | `hublots-backend`             | `backend.kdmarc.xyz`            |
| `admin-panel` | Medusa.js admin dashboard                       | `hublots-admin-panel`         | `store-admin.kdmarc.xyz`        |
| `storefront`  | Next.js customer-facing storefront              | `hublots-storefront`          | `store.kdmarc.xyz`              |
| `vendor-panel`| Next.js vendor-facing panel (if applicable)     | `hublots-vendor-panel`        | `store-vendor.kdmarc.xyz`       |

## Deployment Steps

1.  **Prerequisites:**
    *   A GCP project with billing enabled.
    *   `gcloud` CLI installed and authenticated to your GCP project.
    *   Terraform CLI installed.
    *   A Neon Tech account with a PostgreSQL database provisioned. Obtain the connection string (`neon_db_url`).
    *   A GitHub Personal Access Token (PAT) with `read:packages` scope if your GHCR images are private.

2.  **Clone this repository:**

    ```bash
    git clone <your-repo-url>
    cd <your-repo-directory>/terraform
    ```

3.  **Update `terraform/variables.tf` (if necessary):**
    Ensure `project_id`, `region`, `domain`, `neon_db_url`, and `github_owner` variables are correctly set. You can provide these values directly in a `terraform.tfvars` file or via the command line.

    Example `terraform.tfvars`:
    ```hcl
    project_id       = "gen-lang-client-0898950144"
    region           = "europe-west1"
    domain           = "kdmarc.xyz"
    neon_db_url      = "postgresql://user:password@host/database?sslmode=require" # Replace with your actual Neon DB URL
    github_owner     = "<your-github-username-or-org>"
    container_image_tag = "latest"
    ```

4.  **Initialize Terraform:**

    ```bash
    terraform init
    ```

5.  **Review the plan:**

    ```bash
    terraform plan
    ```

6.  **Apply the Terraform configuration:**

    ```bash
    terraform apply
    ```

7.  **Configure DNS:**
    After `terraform apply` completes, you will get outputs for `dns_nameservers` and CNAME targets for your domain mappings. You **MUST** update your domain registrar (e.g., GoDaddy, Namecheap) to use the provided `dns_nameservers` for `kdmarc.xyz` and create the `CNAME` records for `store.kdmarc.xyz`, `store-admin.kdmarc.xyz`, and `store-vendor.kdmarc.xyz` pointing to `ghs.googlehosted.com.`.

    *Manual Step:* Log in to your domain registrar, navigate to DNS settings, and update the nameservers to the ones provided by the `dns_nameservers` output. Then, add CNAME records for each subdomain, pointing to `ghs.googlehosted.com.`

8.  **Build and Push Docker Images (Manual for now, can be automated with GitHub Actions/Cloud Build):**
    The Cloud Build triggers in `terraform/main.tf` are configured to listen for pushes to the `main` branch of a GitHub repository named `hublots-marketplace`.
    You will need to manually trigger the first builds or set up GitHub Actions to build and push to GHCR.

    Ensure your Dockerfiles are correctly set up in `admin-panel`, `backend`, `storefront`, and `vendor-panel` directories. For GHCR, you'll need to login:

    ```bash
    echo ${GITHUB_TOKEN} | docker login ghcr.io -u <your-github-username> --password-stdin
    docker build -t ghcr.io/<your-github-username-or-org>/hublots-marketplace/backend:latest ./backend
    docker push ghcr.io/<your-github-username-or-org>/hublots-marketplace/backend:latest
    # Repeat for admin-panel, storefront, vendor-panel
    ```
    You will also need to enable GitHub integration for Cloud Build in your GCP project settings.

## Cost Considerations (Low-Cost Strategy)

*   **Cloud Run:** Pay-per-use serverless compute. Scales to zero when not in use, resulting in significant cost savings for applications with intermittent traffic or low usage.
*   **Neon Tech:** Free tier for hobby projects with generous limits. Scalable and cost-effective PostgreSQL hosting.
*   **GHCR:** Free for public repositories, and generous free limits for private repositories.
*   **Cloud DNS:** Very low cost for managing DNS records.
*   **No Load Balancers/VMs:** Avoiding traditional load balancers and virtual machines reduces infrastructure complexity and cost.

## Important Notes

*   **Secrets Management:** For production environments, sensitive information like `JWT_SECRET` and `COOKIE_SECRET` should be stored securely using GCP Secret Manager and injected into Cloud Run services as environment variables.
*   **Redis:** The backend currently uses an in-memory Redis sidecar. For a production environment, consider a dedicated Redis instance (e.g., Google Cloud Memorystore for Redis or another managed Redis provider) for persistence and scalability.
*   **Cloud Build Triggers:** The provided Cloud Build triggers assume a GitHub repository named `hublots-marketplace`. Adjust `repo_name` in `main.tf` if your repository name is different.
