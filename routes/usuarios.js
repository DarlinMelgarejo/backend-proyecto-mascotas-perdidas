import express from 'express'
import { verificarToken } from '../middlewares/auth.js'
import { ControladorUsuarios } from '../controllers/usuarios.js'
import { guardarImagen }from '../middlewares/imagenes.js'


export const crearRouterUsuarios = ({modeloUsuarios}) => {
    const routerUsuarios = express.Router()
    
    const controladorUsuarios = new ControladorUsuarios({modeloUsuarios})
    // Ruta para cerrar sesión
    routerUsuarios.post('/cerrar-sesion', verificarToken, controladorUsuarios.cerrarSesion)
    
    // Ruta para registrar un nuevo usuario (no requiere autenticación)
    routerUsuarios.post('/registrar', controladorUsuarios.registrar)
    
    // Ruta para logear un usuario (no requiere autenticación)
    routerUsuarios.post('/logear', controladorUsuarios.logear)
    
    // Ruta para enviar código de verificación
    routerUsuarios.post('/solicitar-codigo', controladorUsuarios.enviarCodigoVerificacion)
    
    // Ruta para comparar código de verificación
    routerUsuarios.post('/validar-codigo', controladorUsuarios.validarCodigoDeVerificacion)
    
    // Ruta para validar el código y actualizar la contraseña
    routerUsuarios.post('/restablecer-contrasena', controladorUsuarios.restablecerContraseña)
    
    // Ruta para obtener todos los usuarios (requeriría autenticación)
    routerUsuarios.get('/', controladorUsuarios.obtenerTodos)
    
    // Ruta para obtener un usuario (requeriría autenticación)
    routerUsuarios.get('/perfil', verificarToken, controladorUsuarios.obtenerPerfil)
    
    // Ruta para obtener un usuario por ID
    routerUsuarios.get('/:id', controladorUsuarios.obtenerPorId)
    
    // Ruta para actualizar un usuario por ID (requeriría autenticación)
    routerUsuarios.patch('/', verificarToken, guardarImagen('usuarios').single('foto_usuario'), controladorUsuarios.actualizar)
    
    // Ruta para eliminar un usuario por ID (requeriría autenticación)
    routerUsuarios.delete('/:id', verificarToken, controladorUsuarios.eliminar)

    return routerUsuarios
}