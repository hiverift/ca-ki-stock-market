import client from "../client";

// send booking emails to user and consultant
export async function sendBookingEmails(payload:any) {
  // payload: { bookingId, serviceName, user: { name, email }, consultant: { name, email }, date, slotLabel, amount }
  const res = await client.post("/notifications/sendBookingEmails", payload);
  return res.data;
}