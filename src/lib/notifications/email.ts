export async function sendEmailReminder(params: {
  to: string;
  subject: string;
  body: string;
}) {
  if (!process.env.NOTIFICATION_EMAIL_FROM) {
    return { sent: false, reason: "Missing email provider configuration" };
  }

  // Placeholder for provider integration (SES, SendGrid, Resend, etc.)
  console.info("[MedicationReminderEmail]", {
    from: process.env.NOTIFICATION_EMAIL_FROM,
    to: params.to,
    subject: params.subject,
    body: params.body,
  });

  return { sent: true };
}
