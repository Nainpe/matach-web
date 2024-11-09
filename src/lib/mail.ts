import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Usamos el host SMTP de Gmail
  port: 465, // El puerto seguro para SMTP sobre TLS
  secure: true, // Asegura que se use TLS
  auth: {
    user: process.env.EMAIL_USER, // El correo de envío
    pass: process.env.EMAIL_PASSWORD, // Contraseña de aplicación o contraseña normal (si no usas 2FA)
  },
});

export const sendMail = async (to: string, subject: string, text: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Tu Proyecto" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: `<p>${text}</p>`, // Si deseas enviar contenido HTML
    });
    console.log('Email enviado:', info.messageId);
  } catch (error: any) {
    // Mejor manejo de errores
    console.error('Error enviando el correo:', error.message);
  }
};
