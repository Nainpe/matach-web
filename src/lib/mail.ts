import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Función para manejar errores desconocidos
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return "Error desconocido al enviar el correo";
};

/**
 * Función genérica para enviar correos.
 * @param to - Dirección de correo del destinatario
 * @param subject - Asunto del correo
 * @param html - Contenido HTML del correo
 */
export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Tu Proyecto" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Correo enviado:", info.messageId);
  } catch (error) {
    console.error("Error enviando el correo:", getErrorMessage(error));
  }
};