import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const nearbyStoreSearchWorkflow = createWorkflow(
  "nearby-store-search",
  (input: { latitude: number, longitude: number, radius: number }) => {
    // This workflow could orchestrate the search across modules
    // but for MVP we use the API route directly for simplicity.
    return new WorkflowResponse(null)
  }
)
