export async function sendTransactionalEmail(input: {
  to: string;
  subject: string;
  previewText: string;
}) {
  // Swap this for Resend, Postmark, SendGrid, or AWS SES in production.
  if (process.env.NODE_ENV !== "production") {
    console.info(`[email:dev] ${input.subject} -> ${input.to}: ${input.previewText}`);
  }
}
