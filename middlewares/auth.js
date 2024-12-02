import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    // Obtener el token de la cookie
    console.log(req.cookies)
    const token = req.cookies.token; // Se asume que estás utilizando `cookie-parser` middleware
    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado. No se proporcionó un token.' });
    }

    try {
        // Verificar el token
        const datos = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = datos; // Guardar los datos del usuario en la solicitud para usarlos más adelante
        next(); // Pasar al siguiente middleware o ruta
    } catch (err) {
        return res.status(401).json({ mensaje: 'Token inválido.' });
    }
};
