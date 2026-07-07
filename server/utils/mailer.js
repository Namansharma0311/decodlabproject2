/**
 * mailer.js
 * ------------------------------------------------------
 * Handles outbound transactional email for the platform.
 * Uses nodemailer with SMTP credentials from environment
 * variables. If credentials are not configured, email
 * sending is skipped gracefully (logged, not thrown) so
 * the booking/contact flow never breaks in a demo/dev
 * environment without a mail account set up.
 * ------------------------------------------------------
 */

const nodemailer = require('nodemailer');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'namansharma031106@gmail.com';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

  const looksLikePlaceholder =
    !EMAIL_HOST ||
    !EMAIL_USER ||
    !EMAIL_PASS ||
    EMAIL_USER.includes('your-gmail-address') ||
    EMAIL_PASS.includes('your-16-char');

  if (looksLikePlaceholder) {
    return null; // Not configured — caller should handle gracefully
  }

  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT) || 587,
    secure: Number(EMAIL_PORT) === 465,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    // Fail fast instead of hanging if SMTP credentials are wrong/placeholder
    // or the network can't reach the mail host (e.g. blocked outbound access).
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
  });

  return transporter;
}

/**
 * Sends a booking confirmation email to the customer,
 * and BCCs the admin/business inbox so every booking is
 * visible on the operations side as well.
 *
 * @param {Object} booking - the created booking object
 */
async function sendBookingConfirmation(booking) {
  const t = getTransporter();
  if (!t) {
    console.warn('[mailer] Email not configured — skipping booking confirmation email. Set EMAIL_HOST/EMAIL_USER/EMAIL_PASS in .env to enable.');
    return { sent: false, reason: 'not_configured' };
  }

  const fromAddress = process.env.EMAIL_FROM || `"Far & Few AI" <${process.env.EMAIL_USER}>`;

  const html = `
    <div style="font-family: 'Inter', Arial, sans-serif; background:#0b0d10; color:#f6f3ec; padding:32px; border-radius:12px;">
      <h1 style="font-family: Georgia, serif; color:#c9a24b; font-size:24px; margin-bottom:4px;">Far &amp; Few AI</h1>
      <p style="color:#d9d5c9; font-size:13px; letter-spacing:1px; text-transform:uppercase; margin-top:0;">Booking Confirmed</p>
      <p style="font-size:15px; line-height:1.6;">Hi there,</p>
      <p style="font-size:15px; line-height:1.6;">Your trip to <strong>${booking.destination}</strong> is confirmed. Here are your details:</p>
      <table style="width:100%; border-collapse:collapse; margin:20px 0; font-size:14px;">
        <tr><td style="padding:8px 0; color:#9a968a;">Booking ID</td><td style="padding:8px 0; text-align:right; color:#c9a24b; font-weight:600;">${booking.id}</td></tr>
        <tr style="border-top:1px solid rgba(255,255,255,0.1);"><td style="padding:8px 0; color:#9a968a;">Destination</td><td style="padding:8px 0; text-align:right;">${booking.destination}</td></tr>
        <tr style="border-top:1px solid rgba(255,255,255,0.1);"><td style="padding:8px 0; color:#9a968a;">Check-in</td><td style="padding:8px 0; text-align:right;">${booking.checkIn}</td></tr>
        <tr style="border-top:1px solid rgba(255,255,255,0.1);"><td style="padding:8px 0; color:#9a968a;">Check-out</td><td style="padding:8px 0; text-align:right;">${booking.checkOut}</td></tr>
        <tr style="border-top:1px solid rgba(255,255,255,0.1);"><td style="padding:8px 0; color:#9a968a;">Guests</td><td style="padding:8px 0; text-align:right;">${booking.persons}</td></tr>
        <tr style="border-top:1px solid rgba(255,255,255,0.1);"><td style="padding:8px 0; color:#9a968a;">Budget</td><td style="padding:8px 0; text-align:right;">$${Number(booking.budget).toLocaleString()}</td></tr>
      </table>
      <p style="font-size:13px; color:#9a968a; line-height:1.6;">Save your Booking ID for reference. If you have questions, just reply to this email.</p>
      <p style="font-size:13px; color:#9a968a; margin-top:28px;">— The Far &amp; Few AI Team</p>
    </div>
  `;

  const text = `Far & Few AI — Booking Confirmed

Booking ID: ${booking.id}
Destination: ${booking.destination}
Check-in: ${booking.checkIn}
Check-out: ${booking.checkOut}
Guests: ${booking.persons}
Budget: $${booking.budget}

Save your Booking ID for reference.`;

  try {
    await t.sendMail({
      from: fromAddress,
      to: booking.email,
      bcc: ADMIN_EMAIL,
      subject: `Booking Confirmed — ${booking.destination} (${booking.id})`,
      text,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error('[mailer] Failed to send booking confirmation email:', err.message);
    return { sent: false, reason: err.message };
  }
}

module.exports = { sendBookingConfirmation };
