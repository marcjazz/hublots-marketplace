import SubscriptionService from '../service'

// Un-mock the service to test the actual implementation
jest.unmock('../service')

describe('SubscriptionService', () => {
  let service: SubscriptionService
  const mockContainer = {} // Mock container if needed

  beforeEach(() => {
    service = new SubscriptionService(mockContainer)
    // Spy on methods to track calls without altering their implementation
    jest
      .spyOn(service, 'listStoreSubscriptions')
      .mockImplementation(async () => [])
    jest
      .spyOn(service, 'createStoreSubscriptions')
      .mockImplementation(async () => [])
    jest
      .spyOn(service, 'updateStoreSubscriptions')
      .mockImplementation(async () => [])
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getEntitlements', () => {
    it('should return default entitlements if no active subscription found', async () => {
      // Arrange
      ;(service.listStoreSubscriptions as jest.Mock).mockResolvedValue([])

      // Act
      const entitlements = await service.getEntitlements('store_1')

      // Assert
      expect(entitlements).toEqual({
        commission_rate: 0.2,
        visibility_boost: false,
      })
    })

    it('should return plan entitlements if active subscription found', async () => {
      // Arrange
      const mockSubscriptions = [
        {
          subscription_plan: {
            name: 'Pro',
            commission_rate: 0.1,
            visibility_boost: true,
          },
        },
      ]
      ;(service.listStoreSubscriptions as jest.Mock).mockResolvedValue(
        mockSubscriptions
      )

      // Act
      const entitlements = await service.getEntitlements('store_1')

      // Assert
      expect(entitlements).toEqual({
        commission_rate: 0.1,
        visibility_boost: true,
        plan_name: 'Pro',
      })
    })
  })

  describe('activateSubscription', () => {
    it('should deactivate old and create new subscription', async () => {
      // Arrange
      ;(service.listStoreSubscriptions as jest.Mock).mockResolvedValue([
        { id: 'sub_old' },
      ])

      // Act
      await service.activateSubscription('store_1', 'plan_new')

      // Assert
      expect(service.updateStoreSubscriptions).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'sub_old',
            status: 'inactive',
          }),
        ]),
        {}
      )

      expect(service.createStoreSubscriptions).toHaveBeenCalledWith(
        expect.objectContaining({
          store_id: 'store_1',
          subscription_plan_id: 'plan_new',
          status: 'active',
        }),
        {}
      )
    })
  })
})
