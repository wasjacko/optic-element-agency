import nodemailer from 'nodemailer';

// Helpers
const getBaseUrl = () => process.env.API_URL || 'http://localhost:3000';

// Configure Nodemailer transporter
// Use SMTP credentials from .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const isEmailConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASS);

export async function sendAdminRequestEmail(booking: any, token: string) {
  if (!isEmailConfigured) {
    console.log('[Mock Email] Admin Request:', booking);
    return;
  }

  const confirmUrl = `${getBaseUrl()}/api/bookings/confirm?token=${token}`;
  const cancelUrl = `${getBaseUrl()}/api/bookings/cancel?token=${token}`;

  const from = process.env.FROM_EMAIL || process.env.SMTP_USER;
  const to = process.env.ADMIN_EMAIL;

  if (!to) {
    console.error("ADMIN_EMAIL not set");
    return;
  }

  await transporter.sendMail({
    from,
    to,
    subject: `Nouvelle demande de réservation: ${booking.name}`,
    html: `
      <h2>Nouvelle demande</h2>
      <p><strong>Client:</strong> ${booking.name} (${booking.email})</p>
      <p><strong>Tel:</strong> ${booking.phone}</p>
      <p><strong>Date:</strong> ${new Date(booking.start).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })} à ${new Date(booking.end).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}</p>
      <p><strong>Notes:</strong> ${booking.notes || '-'}</p>
      
      <div style="margin-top: 20px;">
        <a href="${confirmUrl}" style="background-color: green; color: white; padding: 10px 20px; text-decoration: none; margin-right: 10px;">Confirmer</a>
        <a href="${cancelUrl}" style="background-color: red; color: white; padding: 10px 20px; text-decoration: none;">Refuser</a>
      </div>
      <p><small>Ces liens expirent dans 7 jours.</small></p>
    `
  });
}

export async function sendClientPendingEmail(booking: any) {
  if (!isEmailConfigured) return;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to: booking.email,
    subject: 'Votre demande de réservation est reçue',
    html: `
      <h1>Demande reçue</h1>
      <p>Bonjour ${booking.name},</p>
      <p>Nous avons bien reçu votre demande pour le créneau suivant :</p>
      <p><strong>Début :</strong> ${new Date(booking.start).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}</p>
      <p><strong>Fin :</strong> ${new Date(booking.end).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}</p>
      <p>Nous reviendrons vers vous rapidement pour confirmation.</p>
    `
  });
}

export async function sendClientConfirmationEmail(booking: any) {
  if (!isEmailConfigured) return;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to: booking.email,
    subject: 'Réservation CONFIRMÉE',
    html: `
      <h1>Confirmation</h1>
      <p>Bonjour ${booking.name},</p>
      <p>Votre réservation est confirmée.</p>
      <p><strong>Date:</strong> ${new Date(booking.start).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}</p>
      <p>A très vite au studio.</p>
    `
  });
}

export async function sendClientCancellationEmail(booking: any) {
  if (!isEmailConfigured) return;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to: booking.email,
    subject: 'Mise à jour de votre réservation',
    html: `
      <p>Bonjour ${booking.name},</p>
      <p>Votre demande de réservation a été annulée ou refusée.</p>
      <p>Merci de nous contacter pour plus d'informations.</p>
    `
  });
}

export async function sendLoginCode(email: string, code: string) {
  if (!isEmailConfigured) {
    console.log(`[Mock Email] Login Code for admin: ${code}`);
    return;
  }

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to: email,
    subject: 'Votre code de connexion Configurateur',
    html: `
      <div style="font-family: monospace; padding: 20px; background: #000; color: #fff;">
        <h1 style="color: #EF5304;">SECURITY ALERT</h1>
        <p>Une nouvelle demande d'accès au configurateur a été initiée depuis votre lien administrateur.</p>
        <p>Utilisez ce code d'authentification pour confirmer :</p>
        <h2 style="font-size: 32px; letter-spacing: 10px; border: 1px solid #333; display: inline-block; padding: 10px 20px;">${code}</h2>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">Ce code expire dans 5 minutes.</p>
        <p style="color: #666; font-size: 12px;">Si ce n'est pas vous, ignorez cet e-mail.</p>
      </div>
    `
  });
}
