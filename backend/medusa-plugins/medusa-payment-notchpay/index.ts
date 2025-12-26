// Notch Pay escrow plugin scaffold for Phase 1 MVP
// Provides skeleton for authorize and capture flows
// This scaffold is designed to be extended with actual API calls to Notch Pay
// Idempotent handling: use a reliable idempotency key per booking

export interface NotchPayEvent {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'authorized' | 'captured' | 'failed';
  createdAt: string;
  updatedAt?: string;
}

export type NotchPaySession = {
  id: string;
  bookingId: string;
  status: 'authorized'|'captured'|'voided';
  amount: number;
  currency: string;
}

export class NotchPayService {
  private sessions: Map<string, NotchPaySession> = new Map();
  private container: any;

  constructor(container: any) {
    this.container = container;
  }

  async authorize(bookingId: string, amount: number, currency: string, idempotencyKey?: string): Promise<NotchPaySession> {
    // idempotent: if session exists with idempotencyKey return existing
    const key = idempotencyKey ?? bookingId;
    if (this.sessions.has(key)) return this.sessions.get(key)!;
    const session: NotchPaySession = { id: `np_${Date.now()}`, bookingId, status: 'authorized', amount, currency };
    this.sessions.set(key, session);
    return session;
  }

  async capture(bookingId: string, idempotencyKey?: string): Promise<NotchPaySession> {
    // find by booking
    let session: NotchPaySession | undefined;
    for (const s of this.sessions.values()) {
      if (s.bookingId === bookingId && s.status !== 'captured') {
        session = s;
        break;
      }
    }

    if (!session) {
      throw new Error('Notch Pay session not found for booking');
    }

    // 1. Resolve store ID from booking (assuming order metadata or link)
    // For MVP, we'll assume we can get it.
    const storeId = "store_sample"; 

    // 2. Compute commission
    const subscriptionModule = this.container.resolve("subscriptionModule");
    const entitlements = await subscriptionModule.getEntitlements(storeId);
    const commissionRate = entitlements.commission_rate || 0.2;
    const commissionAmount = session.amount * commissionRate;
    const payoutAmount = session.amount - commissionAmount;

    // 3. Trigger Notch Pay Payout (Scaffold)
    console.log(`Triggering payout of ${payoutAmount} to store ${storeId} (Commission: ${commissionAmount})`);

    session.status = 'captured';
    this.sessions.set(idempotencyKey ?? `cap_${bookingId}`, session);
    return session;
  }

  async reconcile(): Promise<void> {
    // placeholder for reconciliation logic with Notch Pay
  }
}

// Expose minimal plugin interface
export const load = (container: any) => {
  const service = new NotchPayService(container);
  container.register('notchPayService', {
    useValue: service,
  });
  return service;
};

export default { load };
