import path from 'node:path' 
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'url'
import { corsMiddleware } from './middlewares/cors.js'

import { crearRouterUsuarios } from './routes/usuarios.js'
import { crearRouterReportesMascotas } from './routes/reportesMascotas.js'
import { crearRouterComentarios } from './routes/comentarios.js'
import { crearRouterEstadisticas } from './routes/estadisticas.js'

// Cargar las variables de entorno
dotenv.config()

export const crearServidor = ({modeloUsuarios, modeloReportesMascotas, modeloComentarios, modeloEstadisticas}) => {
    const server = express()
    
    server.use(morgan("dev"))
    server.use(bodyParser.json())
    server.use(cookieParser()) // Usar cookie-parser
    server.use(corsMiddleware())
    
    // Obtener __dirname
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    
    // Permitir el acceso a la carpeta 'uploads' para servir las imágenes
    server.use('/uploads', express.static(path.join(__dirname, 'uploads')))
    
    // Definir prefijos de rutas
    server.use('/api/usuarios', crearRouterUsuarios({modeloUsuarios}))
    server.use('/api/reportes-mascotas', crearRouterReportesMascotas({modeloReportesMascotas}))
    server.use('/api/comentarios', crearRouterComentarios({modeloComentarios}))
    server.use('/api/estadisticas', crearRouterEstadisticas({modeloEstadisticas}))
    
    // Iniciar el servidor
    const PORT = process.env.PORT ?? 5000

    server.listen(PORT, () => {
        console.log(`Servidor ejecutándose en el puerto ${PORT}`)
    })
}
