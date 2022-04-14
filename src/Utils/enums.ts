export enum ReservationStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  EXPIRED = 'EXPIRED',
  APPROVED = 'APPROVED'
}

export enum TicketStatus {
  FREE = 'FREE',
  RESERVED = 'RESERVED',
  TICKETED = 'TICKETED'
}

export enum SellingOption {
  EVEN = 'even',
  ALL_TOGETHER = 'all-together',
  AVOID_ONE = 'avoid-one'
}

export interface PaymentDetails {
  reservationId: number;
  status: boolean;
  createDate: Date;
  rejectionReason: string;
  transactionNo: string;
}
