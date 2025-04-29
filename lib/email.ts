import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: "ProjecTory <noreply@projectory.com>",
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Réinitialisation de votre mot de passe</h2>
          <p>Bonjour,</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe ProjecTory.</p>
          <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
          <div style="margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Réinitialiser mon mot de passe
            </a>
          </div>
          <p>Ce lien expirera dans 1 heure.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
          <p>Cordialement,<br>L'équipe ProjecTory</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280;">
            Cet email a été envoyé à ${email}. Si vous pensez avoir reçu cet email par erreur, veuillez nous contacter.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw new Error("Erreur lors de l'envoi de l'email de réinitialisation");
  }
}

export async function sendPasswordChangedEmail(email: string) {
  try {
    await resend.emails.send({
      from: "ProjecTory <noreply@projectory.com>",
      to: email,
      subject: "Votre mot de passe a été modifié",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Mot de passe modifié</h2>
          <p>Bonjour,</p>
          <p>Votre mot de passe ProjecTory a été modifié avec succès.</p>
          <p>Si vous n'avez pas effectué cette modification, veuillez nous contacter immédiatement.</p>
          <p>Cordialement,<br>L'équipe ProjecTory</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280;">
            Cet email a été envoyé à ${email}. Si vous pensez avoir reçu cet email par erreur, veuillez nous contacter.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw new Error("Erreur lors de l'envoi de l'email de confirmation");
  }
}
