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

export interface PaymentDetails {
  reservationId: number;
  status: boolean;
  createDate: Date;
  rejectionReason: string;
  transactionNo: string;
}
