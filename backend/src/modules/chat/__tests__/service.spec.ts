import { MedusaContainer } from "@medusajs/framework/types"
import ChatService from "../service"

describe("ChatService", () => {
  let service: ChatService

  // ---- mocks ----
  const mockLogger = {
    info: jest.fn(),
  }

  const resolveMock = jest.fn()

  const mockContainer = {
    resolve: resolveMock,
  } as unknown as MedusaContainer

  beforeEach(() => {
    jest.clearAllMocks()

    resolveMock.mockImplementation((key: string) => {
      if (key === "logger") return mockLogger
      throw new Error(`Unexpected container resolve: ${key}`)
    })

    service = new ChatService(mockContainer)
  })

  describe("generateContract", () => {
    it("generates a contract with extracted terms", async () => {
      jest
        .spyOn(service, "getMessages")
        .mockResolvedValue([
          {
            id: "msg_1",
            order_id: "order_1",
            sender_id: "user_1",
            content: "The price is 100 USD",
            metadata: null,
          },
          {
            id: "msg_2",
            order_id: "order_1",
            sender_id: "user_2",
            content: "Term: Delivery in 2 days",
            metadata: null,
          },
          {
            id: "msg_3",
            order_id: "order_1",
            sender_id: "user_1",
            content: "Hello there",
            metadata: null,
          },
        ])

      const contract = await service.generateContract("order_1")

      expect(contract).toContain("CONTRACT FOR ORDER order_1")
      expect(contract).toContain("The price is 100 USD")
      expect(contract).toContain("Term: Delivery in 2 days")
      expect(contract).not.toContain("Hello there")
      expect(mockLogger.info).toHaveBeenCalled()
    })

    it("uses default message when no terms are found", async () => {
      jest
        .spyOn(service, "getMessages")
        .mockResolvedValue([
          {
            id: "msg_1",
            order_id: "order_1",
            sender_id: "user_1",
            content: "Hello",
            metadata: null,
          },
        ])

      const contract = await service.generateContract("order_1")

      expect(contract).toContain(
        "No specific terms extracted from chat history."
      )
      expect(mockLogger.info).toHaveBeenCalled()
    })
  })
})
