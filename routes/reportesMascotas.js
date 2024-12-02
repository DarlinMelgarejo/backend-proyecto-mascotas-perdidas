import express from 'express'
import { verificarToken } from '../middlewares/auth.js'  // Middleware de autenticación
import { guardarImagen }from '../middlewares/imagenes.js'

import { ControladorReportesMascotas } from '../controllers/reportesMascotas.js'

export const crearRouterReportesMascotas = ({modeloReportesMascotas}) => {
    const routerReportesMascotas = express.Router()
    
    const controladorReportesMascotas = new ControladorReportesMascotas({modeloReportesMascotas})

    // Ruta para registrar una nueva mascota con imagen (requeriría autenticación)
    routerReportesMascotas.post('/registrar', verificarToken, guardarImagen('mascotas').single('foto_mascota'), controladorReportesMascotas.registrar)
    
    // Ruta para obtener todas las mascotas (pública)
    routerReportesMascotas.get('/', controladorReportesMascotas.obtenerTodos)
    
    // Ruta para obtener los reportes más recientes (requiere autenticación)
    routerReportesMascotas.get('/recientes', controladorReportesMascotas.obtenerRecientes)
    
    // Ruta para obtener los reportes de un usuario (requiere autenticación)
    routerReportesMascotas.get('/mis-reportes', verificarToken, controladorReportesMascotas.obtenerMisReportes)
    
    // Ruta para obtener los últimos reportes de un usuario (requiere autenticación)
    routerReportesMascotas.get('/mis-reportes/:n', verificarToken, controladorReportesMascotas.obtenerMisUltimosReportes)
    
    // Ruta para obtener una mascota por ID (pública)
    routerReportesMascotas.get('/:id', controladorReportesMascotas.obtenerPorId)
    
    // Ruta para actualizar una mascota por ID (requiere autenticación)
    routerReportesMascotas.patch('/:id', verificarToken, guardarImagen('mascotas').single('foto_mascota'), controladorReportesMascotas.actualizar)
    
    // Ruta para actualizar el estado del reporte a resuelto
    routerReportesMascotas.patch('/resuelto/:id', controladorReportesMascotas.actualizarEstado)
    // Ruta para eliminar una mascota por ID (requiere autenticación)
    routerReportesMascotas.delete('/:id', verificarToken, controladorReportesMascotas.eliminar)

    return routerReportesMascotas
}