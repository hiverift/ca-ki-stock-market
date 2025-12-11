import client from "../client";

export async function getServices() {
  const res = await client.get('services');
  // our backend returns CustomResponse => { statusCode, message, result }
  return res.data.result ?? res.data;
}

// month format: "2025-09"
export async function getAvailability(serviceId: any, month: string) {
  const res = await client.get(`availability/${serviceId}?month=${month}`);
  console.log('res availivility',res)
  return res.data.result ?? res.data;
}

// create booking (returns bookingId, amount, paymentRef)
interface CreateBookingParams {
  serviceId: string;
  slotId: string;
  userId: string;
  paymentMethod?: string;
}

export async function createBooking({ serviceId, slotId, userId, paymentMethod = 'mock' }: CreateBookingParams) {
  const res = await client.post('bookings', { serviceId, slotId, userId, paymentMethod });
  return res.data.result ?? res.data;
}

// confirm payment
interface ConfirmPaymentParams {
  bookingId: string;
  paymentRef: string;
  status?: string;
}

export async function confirmPayment({ bookingId, paymentRef, status = 'success' }: ConfirmPaymentParams) {
  const res = await client.post('/bookings/confirm', { bookingId, paymentRef, status });
  return res.data.result ?? res.data;
}

// get my bookings
export async function getMyBookings(userId: any) {
  const res = await client.get(`/bookings/user/${userId}`);
  return res.data.result ?? res.data;
}



