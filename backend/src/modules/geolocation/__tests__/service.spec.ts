import GeolocationService from '../service'

jest.unmock('../service') // Use the actual implementation

describe('GeolocationService', () => {
  let service: GeolocationService
  const mockContainer = {
    resolve: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    service = new GeolocationService(mockContainer)

    // Spy on the database methods to avoid actual DB calls
    jest.spyOn(service, 'listStoreLocations').mockResolvedValue([])
    jest.spyOn(service, 'createStoreLocations').mockResolvedValue([])
    jest.spyOn(service, 'updateStoreLocations').mockResolvedValue([])
  })

  describe('upsertStoreLocation', () => {
    it("should create a new location if it doesn't exist", async () => {
      ;(service.listStoreLocations as jest.Mock).mockResolvedValue([])

      await service.upsertStoreLocation('store_1', 10, 20)

      expect(service.createStoreLocations).toHaveBeenCalledWith({
        store_id: 'store_1',
        latitude: 10,
        longitude: 20,
      })
    })

    it('should update existing location if it exists', async () => {
      ;(service.listStoreLocations as jest.Mock).mockResolvedValue([
        { id: 'loc_1' },
      ])

      await service.upsertStoreLocation('store_1', 10, 20)

      expect(service.updateStoreLocations).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'loc_1',
          latitude: 10,
          longitude: 20,
        })
      )
    })
  })

  describe('findStoresInRadius', () => {
    const mockQuery = jest.fn()

    beforeEach(() => {
      const mockPg = { query: mockQuery }
      mockContainer.resolve.mockReturnValue(mockPg)
      ;(service as any).__container__ = mockContainer
    })

    it('should use PostGIS query and return store IDs', async () => {
      mockQuery.mockResolvedValue({
        rows: [{ store_id: 'store_1' }, { store_id: 'store_2' }],
      })

      const result = await service.findStoresInRadius(10, 20, 5)

      expect(mockQuery).toHaveBeenCalled()
      expect(result).toEqual(['store_1', 'store_2'])
    })

    it('should throw an error if PostGIS fails', async () => {
      mockQuery.mockRejectedValue(new Error('PostGIS error'));

      await expect(service.findStoresInRadius(10, 20, 5)).rejects.toThrow(
        'Could not retrieve stores due to a database error.'
      );
    });
  })
})
