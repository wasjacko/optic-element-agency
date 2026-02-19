
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Helpers
const getBaseUrl = () => process.env.API_URL || 'http://localhost:3000';

export async function sendAdminRequestEmail(booking: any, token: string) {
  if (!resend) {
    console.log('[Mock Email] Admin Request:', booking);
    return;
  }

  const confirmUrl = `${getBaseUrl()}/api/bookings/confirm?token=${token}`;
  const cancelUrl = `${getBaseUrl()}/api/bookings/cancel?token=${token}`;

  const from = process.env.FROM_EMAIL || 'onboarding@resend.dev';
  const to = process.env.ADMIN_EMAIL;

  if (!to) {
    console.error("ADMIN_EMAIL not set");
    return;
  }

  await resend.emails.send({
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
  if (!resend) return;

  await resend.emails.send({
    from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
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
  if (!resend) return;

  await resend.emails.send({
    from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
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
  if (!resend) return;

  await resend.emails.send({
    from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
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
  if (!resend) {
    console.log(`[Mock Email] Login Code for ${email}: ${code}`);
    return;
  }

  await resend.emails.send({
    from: process.env.FROM_EMAIL || 'security@resend.dev',
    to: email,
    subject: 'Votre code de connexion Admin',
    html: `
      <div style="font-family: monospace; padding: 20px; background: #000; color: #fff;">
        <h1 style="color: #FF5000;">SECURITY ALERT</h1>
        <p>Une tentative de connexion a été détectée.</p>
        <p>Votre code d'accès unique :</p>
        <h2 style="font-size: 32px; letter-spacing: 10px; border: 1px solid #333; display: inline-block; padding: 10px 20px;">${code}</h2>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">Ce code expire dans 5 minutes.</p>
        <p style="color: #666; font-size: 12px;">Si ce n'est pas vous, ignorez cet e-mail.</p>
      </div>
    `
  });
}
