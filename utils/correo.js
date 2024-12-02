import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// Configuración del transportador de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

/**
 * Función para enviar un correo
 * @param {string} correo - El correo al cual se enviare el mensaje.
 * @param {string} mensaje - El contenido del mensaje que se enviara.
 */
export const enviarCorreo = (correo, mensaje) => {
    const mailOptions = {
        from: process.env.GMAIL,
        to: correo,
        subject: 'Código de verificación',
        text: mensaje
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error al enviar el correo: ', error);
        }
        console.log(mensaje)
        console.log('Correo enviado: ' + info.response);
    });
}