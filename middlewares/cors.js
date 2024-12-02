import cors from "cors"

const ORIGENES_ACEPTADOS = [
    'http://localhost:3000',
    'https://huellasperdidas.netlify.app'
]

export const corsMiddleware = ({ origenesAceptados = ORIGENES_ACEPTADOS } = {}) => cors({
    origin: (origin, callback) => {
        if(origenesAceptados.includes(origin)) {
            return callback(null, true)
        }

        // Permitir solicitudes sin el encabezado Origin (como las de aplicaciones móviles)
        if(!origin) {
            return callback(null, true)
        }

        return callback(new Error("No permitido por CORS"))
    },
    credentials: true
})