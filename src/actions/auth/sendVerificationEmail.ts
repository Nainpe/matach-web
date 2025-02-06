'use server';

import { sendMail } from "@/lib/mail";

/**
 * Enviar un correo de verificación al usuario.
 * @param email - Correo del usuario
 * @param token - Token de verificación
 */
export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify/${token}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://ejemplo.com/logo.png" alt="Logo" style="width: 100px; height: auto;">
        <h1 style="color: #333; font-size: 24px; margin-top: 10px;">¡Bienvenido a Matach Shop!</h1>
      </div>

      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
        <p style="color: #555; font-size: 16px; line-height: 1.5;">
          Gracias por registrarte en Matach Shop. Para completar tu registro, por favor verifica tu dirección de correo electrónico haciendo clic en el siguiente enlace:
        </p>

        <div style="text-align: center; margin: 20px 0;">
          <a href="${verificationLink}" style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
            Verificar Email
          </a>
        </div>

        <p style="color: #555; font-size: 14px;">
          Si no has solicitado este correo, puedes ignorarlo de manera segura.
        </p>
      </div>

      <div style="text-align: center; margin-top: 20px; color: #777; font-size: 12px;">
        <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
        <p>&copy; ${new Date().getFullYear()} Matach Shop. Todos los derechos reservados.</p>
      </div>
    </div>
  `;

  await sendMail(email, "Verifica tu correo electrónico - Matach Shop", htmlContent);
};