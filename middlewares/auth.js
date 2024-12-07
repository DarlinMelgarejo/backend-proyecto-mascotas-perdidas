import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    // Primero intentar obtener el token de las cookies (para la web)
    let token = req.cookies.token;

    // Si no se encuentra en las cookies, intentar obtenerlo de las cabeceras (para aplicaciones móviles)
    if (!token && req.headers.authorization) {
        // La cabecera de autorización generalmente tiene el formato "Bearer <token>"
        const authHeader = req.headers.authorization;
        token = authHeader && authHeader.split(' ')[1]; // Obtener el token después de "Bearer"
    }

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
