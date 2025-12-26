import { MedusaContainer } from "@medusajs/framework"
import ChatService from "../service"
import { createMedusaContainer } from "@medusajs/framework/utils"

describe("ChatService", () => {
  let service: ChatService
  const mockContainer: MedusaContainer = createMedusaContainer()


  beforeEach(() => {
    service = new ChatService(mockContainer)
    service.getMessages = jest.fn()
  })

  describe("generateContract", () => {
    it("should generate a contract with extracted terms", async () => {
      ;(service.getMessages as jest.Mock).mockResolvedValue([
        { content: "The price is 100 USD" },
        { content: "Term: Delivery in 2 days" },
        { content: "Hello there" }
      ])

      const contract = await service.generateContract("order_1")

      expect(contract).toContain("CONTRACT FOR ORDER order_1")
      expect(contract).toContain("The price is 100 USD")
      expect(contract).toContain("Term: Delivery in 2 days")
      expect(contract).not.toContain("Hello there")
    })

    it("should generate a contract with default message if no terms found", async () => {
      ;(service.getMessages as jest.Mock).mockResolvedValue([
        { content: "Hello" }
      ])

      const contract = await service.generateContract("order_1")

      expect(contract).toContain("No specific terms extracted from chat history.")
    })
  })
})
