import { MedusaContainer } from "@medusajs/types"
import GeolocationService from "../service"

describe("GeolocationService", () => {
  let service: GeolocationService

  // ---- mocks ----
  const mockLogger = {
    warn: jest.fn(),
  }

  const mockPg = {
    query: jest.fn(),
  }

  // Explicit jest mock for container.resolve
  const resolveMock = jest.fn()

  const mockContainer = {
    resolve: resolveMock,
  } as unknown as MedusaContainer

  // ---- setup ----
  beforeEach(() => {
    jest.clearAllMocks()

    resolveMock.mockImplementation((key: string) => {
      switch (key) {
        case "logger":
          return mockLogger
        case "pg_connection":
          return mockPg
        default:
          throw new Error(`Unexpected container resolve: ${key}`)
      }
    })

    service = new GeolocationService(mockContainer)

    // MedusaService DB methods should never hit a real DB in unit tests
    jest
      .spyOn(service, "listStoreLocations")
      .mockResolvedValue([])
  })

  // ---- upsertStoreLocation ----
  describe("upsertStoreLocation", () => {
    it("executes an upsert SQL query", async () => {
      mockPg.query.mockResolvedValue({ rows: [] })

      await service.upsertStoreLocation("store_1", 10, 20)

      expect(mockPg.query).toHaveBeenCalledTimes(1)

      const [sql, params] = mockPg.query.mock.calls[0]

      expect(sql).toContain("INSERT INTO")
      expect(params).toHaveLength(4)
      expect(params[1]).toBe("store_1")
      expect(params[2]).toBe(10)
      expect(params[3]).toBe(20)
    })
  })

  // ---- findStoresInRadius ----
  describe("findStoresInRadius", () => {
    it("returns store IDs from PostGIS", async () => {
      mockPg.query.mockResolvedValue({
        rows: [
          { store_id: "store_1" },
          { store_id: "store_2" },
        ],
      })

      const result = await service.findStoresInRadius(10, 20, 5)

      expect(result).toEqual(["store_1", "store_2"])
      expect(mockPg.query).toHaveBeenCalled()
      expect(mockLogger.warn).not.toHaveBeenCalled()
    })

    it("falls back to haversine when PostGIS fails", async () => {
      mockPg.query.mockRejectedValue(new Error("PostGIS down"))

      ;(service.listStoreLocations as jest.Mock).mockResolvedValue([
        {
          store_id: "store_near",
          latitude: 10,
          longitude: 20,
        },
        {
          store_id: "store_far",
          latitude: 80,
          longitude: 80,
        },
      ])

      const result = await service.findStoresInRadius(10, 20, 5)

      expect(mockLogger.warn).toHaveBeenCalled()
      expect(result).toEqual(["store_near"])
    })
  })
})
