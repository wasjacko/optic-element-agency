import nodemailer from 'nodemailer';
import { Resend } from 'resend';

// Helpers
const getBaseUrl = () => process.env.API_URL || 'http://localhost:3000';

// Configure Nodemailer transporter (SMTP fallback)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Configure Resend client (recommended for Vercel/serverless to bypass SMTP port blocking)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const isEmailConfigured = !!(
  process.env.RESEND_API_KEY || 
  (process.env.SMTP_USER && process.env.SMTP_PASS)
);

/**
 * Unified email sending helper that abstracts Resend API and Nodemailer SMTP.
 */
async function sendMailHelper(options: { to: string; subject: string; html: string }) {
  if (!isEmailConfigured) {
    console.log(`[Mock Email Mocked] To: ${options.to} | Subject: ${options.subject}`);
    return;
  }

  if (resend) {
    // Resend REST API Client
    const from = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    console.log(`[Email] Sending via Resend API from "${from}" to "${options.to}"...`);
    const response = await resend.emails.send({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    
    if (response.error) {
      console.error("Resend API failed to send email:", response.error);
      throw new Error(`Resend Error: ${response.error.message}`);
    }
    return response.data;
  } else {
    // Nodemailer SMTP Client
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const from = (host.includes('gmail.com') || host.includes('google'))
      ? (process.env.SMTP_USER || '')
      : (process.env.FROM_EMAIL || process.env.SMTP_USER || '');

    console.log(`[Email] Sending via SMTP from "${from}" to "${options.to}"...`);
    return await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }
}

export async function sendAdminRequestEmail(booking: any, token: string) {
  const confirmUrl = `${getBaseUrl()}/api/bookings/confirm?token=${token}`;
  const cancelUrl = `${getBaseUrl()}/api/bookings/cancel?token=${token}`;
  const to = process.env.ADMIN_EMAIL;

  if (!to) {
    console.error("ADMIN_EMAIL not set");
    return;
  }

  await sendMailHelper({
    to,
    subject: `New Booking Request: ${booking.name}`,
    html: `
      <h2>New Booking Request</h2>
      <p><strong>Client:</strong> ${booking.name} (${booking.email})</p>
      <p><strong>Phone:</strong> ${booking.phone}</p>
      <p><strong>Time:</strong> ${new Date(booking.start).toLocaleString('en-US')} to ${new Date(booking.end).toLocaleString('en-US')}</p>
      <p><strong>Notes:</strong> ${booking.notes || '-'}</p>
      
      <div style="margin-top: 20px;">
        <a href="${confirmUrl}" style="background-color: #EF5304; color: white; padding: 10px 20px; text-decoration: none; margin-right: 10px; border-radius: 4px;">Confirm</a>
        <a href="${cancelUrl}" style="background-color: transparent; border: 1px solid #333; color: #333; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Reject</a>
      </div>
      <p><small>These links expire in 7 days.</small></p>
    `
  });
}

export async function sendClientPendingEmail(booking: any) {
  await sendMailHelper({
    to: booking.email,
    subject: 'Booking Request Received - Optic Element',
    html: `
      <h1>Request Received</h1>
      <p>Hello ${booking.name},</p>
      <p>We have received your booking request for the following slot:</p>
      <p><strong>Start:</strong> ${new Date(booking.start).toLocaleString('en-US')}</p>
      <p><strong>End:</strong> ${new Date(booking.end).toLocaleString('en-US')}</p>
      <p>Our team will review your request and get back to you shortly for confirmation.</p>
    `
  });
}

export async function sendClientConfirmationEmail(booking: any) {
  await sendMailHelper({
    to: booking.email,
    subject: 'Booking CONFIRMED - Optic Element',
    html: `
      <h1>Confirmation</h1>
      <p>Hello ${booking.name},</p>
      <p>Your booking is confirmed.</p>
      <p><strong>Date:</strong> ${new Date(booking.start).toLocaleString('en-US')}</p>
      <p>See you soon at the studio.</p>
    `
  });
}

export async function sendClientCancellationEmail(booking: any) {
  await sendMailHelper({
    to: booking.email,
    subject: 'Booking Status Update - Optic Element',
    html: `
      <p>Hello ${booking.name},</p>
      <p>Your booking request has been cancelled or rejected.</p>
      <p>Please contact us if you need more information.</p>
    `
  });
}

export async function sendLoginCode(email: string, code: string) {
  await sendMailHelper({
    to: email,
    subject: 'Your Dashboard Login Code',
    html: `
      <div style="font-family: sans-serif; padding: 40px; background: #fff; color: #000; border: 1px solid #eee;">
        <h1 style="color: #000; font-size: 20px; letter-spacing: -0.5px; border-bottom: 2px solid #EF5304; padding-bottom: 15px; display: inline-block;">ADMIN DASHBOARD ACCESS</h1>
        <p style="margin-top: 30px; font-size: 14px; color: #666;">A new login request was triggered for the Optic Element dashboard.</p>
        <p style="font-size: 14px; color: #666;">Use the following authentication code to confirm:</p>
        <div style="margin: 30px 0;">
          <h2 style="font-size: 42px; letter-spacing: 12px; font-weight: 800; color: #000;">${code}</h2>
        </div>
        <p style="color: #999; font-size: 11px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">This code expires in 5 minutes.</p>
        <p style="color: #999; font-size: 11px;">If you did not request this code, please ignore this email.</p>
      </div>
    `
  });
}
