import express from 'express'
import { ControladorEstadisticas } from '../controllers/estadisticas.js'
import { verificarToken } from '../middlewares/auth.js' // Importar el middleware

export const crearRouterEstadisticas = ({modeloEstadisticas}) => {
    const routerEstadisticas = express.Router()

    const controladorEstadisticas = new ControladorEstadisticas({modeloEstadisticas})
    
    
    // Ruta para obtener todos los Estadisticas
    routerEstadisticas.get('/', controladorEstadisticas.obtenerEstadisticasGlobales)
    
    // Ruta para obtener todos los Estadisticas de un usuario
    routerEstadisticas.get('/usuario', verificarToken, controladorEstadisticas.obtenerEstadisticasUsuario)

    return routerEstadisticas
}

