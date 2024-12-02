import express from 'express'
import { ControladorComentarios } from '../controllers/comentarios.js'
import { verificarToken } from '../middlewares/auth.js' // Importar el middleware

export const crearRouterComentarios = ({modeloComentarios}) => {
    const routerComentarios = express.Router()

    const controladorComentarios = new ControladorComentarios({modeloComentarios})
    
    // Ruta para registrar un nuevo comentario
    routerComentarios.post('/registrar', verificarToken, controladorComentarios.registrar)
    
    // Ruta para obtener todos los comentarios
    routerComentarios.get('/', verificarToken, controladorComentarios.obtenerTodos)
    
    // Ruta para obtener un comentario por ID
    routerComentarios.get('/:id', verificarToken, controladorComentarios.obtenerPorId)
    
    // Ruta para obtener los comentarios de un reporte de una mascota por ID
    routerComentarios.get('/reporte/:id', verificarToken, controladorComentarios.obtenerPorReporteId)
    
    // Ruta para actualizar un comentario por ID
    routerComentarios.patch('/:id', verificarToken, controladorComentarios.actualizar)
    
    // Ruta para eliminar un comentario por ID
    routerComentarios.delete('/:id', verificarToken, controladorComentarios.eliminar)

    return routerComentarios
}

