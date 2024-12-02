import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { eliminarImagen } from '../utils/fotos.js';
import { generarCodigoVerificacion } from '../utils/codigo.js';

import { validarUsuario, validarUsuarioParcial } from '../schemas/usuarios.js';
import { enviarCorreo } from '../utils/correo.js';

export class ControladorUsuarios {
    constructor({ modeloUsuarios }) {
        this.modeloUsuarios = modeloUsuarios;
    }

    // Registrar un nuevo usuario
    registrar = async (req, res) => {
        const resultado = validarUsuario(req.body);

        if (!resultado.success) {
            return res.status(400).json({ error: JSON.parse(resultado.error.message) });
        }

        const { dni, contraseña, nombres, apellidos, correo, telefono, procedencia, direccion } = resultado.data;

        try {
            // Encriptar la contraseña
            const contraseñaHasheada = await bcrypt.hash(contraseña, 10);
            const nuevoUsuario = await this.modeloUsuarios.registrar(dni, contraseñaHasheada, nombres, apellidos, correo, telefono, procedencia, direccion);

            if (!nuevoUsuario) {
                return res.status(400).json({ mensaje: 'Error al registrar el usuario' });
            }
            
            res.status(201).json({
                mensaje: 'Usuario registrado exitosamente',
                usuario: nuevoUsuario // Devolver el usuario recién creado
            });

        } catch (err) {
            // Manejo de errores más específico
            if (err.message.includes('UNIQUE constraint failed')) {
                res.status(400).json({ mensaje: 'El DNI, el correo o el teléfono ya están en uso.' });
                return
            }
            res.status(500).json({ mensaje: err.message });
        }
    }

    // Obtener perfil de un usuario logeado
    obtenerPerfil = async (req, res) => {
        const usuarioID = req.usuario.id;
        console.log(usuarioID)
        try {
            const usuario = await this.modeloUsuarios.obtenerPor('id', usuarioID);
            if (!usuario) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }

            if (usuario.creado_en._seconds && usuario.creado_en._nanoseconds) {
                return res.status(200).json({
                    mensaje: 'Perfil de usuario obtenido exitosamente',
                    usuario: {
                        ...usuario,
                        creado_en: new Date(usuario.creado_en._seconds * 1000 + usuario.creado_en._nanoseconds / 1000000),
                        actualizado_en: new Date(usuario.actualizado_en._seconds * 1000 + usuario.actualizado_en._nanoseconds / 1000000)
                    } // Devolver el perfil completo del usuario
                });
            }
            
            res.status(200).json({
                mensaje: 'Perfil de usuario obtenido exitosamente',
                usuario // Devolver el perfil completo del usuario
            });
        } catch (err) {
            res.status(500).json({ mensaje: err.message });
        }
    }

    // Obtener todos los usuarios
    obtenerTodos = async (req, res) => {
        try {
            const usuarios = await this.modeloUsuarios.obtenerTodos();
            res.status(200).json({
                mensaje: 'Usuarios obtenidos exitosamente',
                usuarios // Devolver todos los usuarios
            });
        } catch (err) {
            res.status(500).json({ mensaje: err.message });
        }
    }

    // Obtener un usuario por ID
    obtenerPorId = async (req, res) => {
        const id = req.params.id;

        try {
            const usuario = await this.modeloUsuarios.obtenerPor('id', id);
            if (!usuario) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }
            res.status(200).json({
                mensaje: 'Usuario encontrado exitosamente',
                usuario // Devolver el usuario encontrado
            });
        } catch (err) {
            res.status(500).json({ mensaje: err.message });
        }
    }

    // Actualizar un usuario (actualización parcial)
    actualizar = async (req, res) => {
        const usuario_id = req.usuario.id;

        const resultado = validarUsuarioParcial(req.body);  // Validación parcial de los datos

        if (!resultado.success) {
            return res.status(400).json({ error: JSON.parse(resultado.error.message) });
        }

        const {nombres, apellidos, correo, telefono, direccion, url_foto} = resultado.data;  // Solo los campos que se pasaron en la solicitud

        let nueva_url_foto = url_foto

        // Se verifica si se recibe un archivo en la petición
        if (req.file) {
            /*
            * Si el nombre del archivo que se pasa inicialmente en la petición
            * es diferente a default.jpg entonces se borra la imagen
            */
            if (nueva_url_foto != 'default.jpg') {
                eliminarImagen('uploads/usuarios/', nueva_url_foto);
            }
            nueva_url_foto = req.file.filename
        }
        
        try {
            const resultadoActualizacion = await this.modeloUsuarios.actualizar(
                usuario_id, 
                nombres,
                apellidos,
                correo,
                telefono,
                direccion,
                nueva_url_foto
            );
                

            if (!resultadoActualizacion) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }
            
            res.status(200).json({
                mensaje: 'Usuario actualizado exitosamente',
                usuario: resultadoActualizacion // Devolver el usuario actualizado
            });
        } catch (err) {
            console.log(err)
            res.status(500).json({ mensaje: err.message });
        }
    }

    // Eliminar un usuario
    eliminar = async (req, res) => {
        const { id } = req.params;

        try {
            const resultado = await this.modeloUsuarios.eliminar(id);
            if (resultado && resultado.id) {
                return res.status(200).json({
                    mensaje: 'Usuario eliminado exitosamente',
                    usuario: resultado // Devolver el usuario eliminado
                });
            }

            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        } catch (err) {
            res.status(500).json({ mensaje: err.message });
        }
    }

    // Logear un usuario
    logear = async (req, res) => {
        const { dni, contraseña, recordarme } = req.body;

        if (!dni || !contraseña) return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });

        try {
            const usuarioEncontrado = await this.modeloUsuarios.obtenerPor('dni', dni);
            if (!usuarioEncontrado) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }

            // Verificar la contraseña
            const contraseñaValida = await bcrypt.compare(contraseña, usuarioEncontrado.contraseña);
            if (!contraseñaValida) {
                return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
            }

            // Generar token JWT con una expiración dinámica basada en 'recordarme'
            const expiracion = recordarme ? '30d' : '2h';  // 30 días si recordarme es true, 2 horas si no lo es
            const token = jwt.sign(
                {
                    id: usuarioEncontrado.id
                },
                process.env.JWT_SECRET,
                { expiresIn: expiracion }
            );

            // Guardar el token en una cookie
            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // `secure` para producción
            res.status(200).json({
                mensaje: 'Inicio de sesión exitoso',
                usuario: usuarioEncontrado // Devolver el perfil completo del usuario
            });
            
        } catch (err) {
            res.status(500).json({ mensaje: err.message });
        }
    }

    // Cerrar sesión del usuario
    cerrarSesion = async (req, res) => {
        try {
            // Eliminar la cookie que contiene el token
            res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            res.status(200).json({
                mensaje: 'Sesión cerrada exitosamente'
            });
        } catch (err) {
            res.status(500).json({ mensaje: 'Error al cerrar sesión: ' + err.message });
        }
    }

    enviarCodigoVerificacion = async (req, res) => {
        const { correo } = req.body;
        try {
            const usuario = await this.modeloUsuarios.obtenerPor('correo', correo);

            if (!usuario) {
                return res.status(404).json({ mensaje: 'Correo no registrado.' });
            }

            const codigoVerificacion = generarCodigoVerificacion();
            const expiracion = new Date();
            expiracion.setMinutes(expiracion.getMinutes() + 10); // Código válido por 10 minutos

            await this.modeloUsuarios.guardarCodigoVerificacion(usuario.id, codigoVerificacion, expiracion);

            // Enviar el código por correo electrónico
            enviarCorreo(correo, `Tu código de verificación es: ${codigoVerificacion}`);

            res.status(200).json({
                mensaje: 'Código de verificación enviado al correo.'
            });
        } catch (err) {
            res.status(500).json({ mensaje: err.message });
        }
    }

    validarCodigoDeVerificacion = async (req, res) => {
        const { correo, codigoVerificacion } = req.body;

        // console.log(req.body)
        try {
            const usuario = await this.modeloUsuarios.obtenerPor('correo', correo);

            if (!usuario) {
                return res.status(404).json({ mensaje: 'Correo no registrado.' });
            }

            
            const valido = await this.modeloUsuarios.compararCodigoVerificacion(usuario.correo, codigoVerificacion);
            // console.log(valido)
            if (!valido) {
                return res.status(400).json({ mensaje: 'Código incorrecto o expirado.' });
            }

            res.status(200).json({
                mensaje: 'Código verificado correctamente.'
            });
        } catch (err) {
            // console.log(err)
            res.status(500).json({ mensaje: err.message });
        }
    }

    restablecerContraseña = async (req, res) => {
        const { correo, nuevaContrasena } = req.body;
        console.log(req.body)
        try {

            const contraseñaHasheada = await bcrypt.hash(nuevaContrasena, 10);
            
            const resultado = await this.modeloUsuarios.actualizarContraseña(correo, contraseñaHasheada);
            // console.log(contraseñaHasheada)
            if (!resultado) {
                return res.status(400).json({ mensaje: 'No se pudo restablecer la contraseña' });
            }
            
            res.status(200).json({
                mensaje: 'Contraseña restablecida exitosamente',
                usuario: resultado // Devolver el usuario con la contraseña actualizada
            });

        } catch (err) {
            // console.log(err)
            res.status(500).json({ mensaje: err.message });
        }
    }
}
