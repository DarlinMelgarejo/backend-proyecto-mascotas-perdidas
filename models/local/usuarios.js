import { pool } from '../../connection/local/conexion.js'  // Pool de conexiones

export class ModeloUsuarios {
    // Registrar un nuevo usuario
    static async registrar(dni, contraseña, nombres, apellidos, correo, telefono, procedencia, direccion) {
        const consulta = 'INSERT INTO usuarios (dni, contraseña, nombres, apellidos, correo, telefono, procedencia, direccion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'

        try {
            const [resultado] = await pool.execute(consulta, [dni, contraseña, nombres, apellidos, correo, telefono, procedencia, direccion])
            return { 
                id: resultado.insertId
             }
        } catch (err) {
            throw new Error('Error al crear el usuario: ' + err.message)
        }
    }

    // Obtener todos los usuarios
    static async obtenerTodos() {
        const consulta = 'SELECT id, dni, nombres, apellidos, correo, telefono, procedencia, direccion, url_foto FROM usuarios WHERE estado = TRUE'  // Filtrar solo usuarios activos

        try {
            const [filas] = await pool.execute(consulta)
            return filas.map(fila => ({
                id: fila.id,
                dni: fila.dni,
                nombres: fila.nombres,
                apellidos: fila.apellidos,
                correo: fila.correo,
                telefono: fila.telefono,
                procedencia: fila.procedencia,
                direccion: fila.direccion,
                url_foto: fila.url_foto,
                estado: true
            }))
        } catch (err) {
            throw new Error('Error al obtener los usuarios: ' + err.message)
        }
    }

    // Obtener un usuario por algun campo
    static async obtenerPor(campo, valor) {
        const consulta = `SELECT id, dni, contraseña, nombres, apellidos, correo, telefono, procedencia, direccion, url_foto, creado_en FROM usuarios WHERE ${campo} = ? AND estado = TRUE`
        try {
            const [filas] = await pool.execute(consulta, [valor])
            if (filas.length === 0) {
                throw new Error('Usuario no encontrado')
            }
            return filas[0]  // Retornar solo el primer registro (el usuario)
        } catch (err) {
            throw new Error('Error al obtener el usuario: ' + err.message)
        }
    }

    // Actualizar un usuario por ID
    static async actualizar(id, nombres, apellidos, correo, telefono, direccion, url_foto) {
        try {
            const consulta = 'UPDATE usuarios SET nombres = ?, apellidos = ?, correo = ?, telefono = ?, direccion = ?, url_foto = ? WHERE id = ?'
            const [resultado] = await pool.execute(consulta, [nombres, apellidos, correo, telefono, direccion, url_foto, id])

            // Retornamos el usuario actualizado
            return {
                id,
                nombres,
                apellidos,
                correo,
                telefono,
                direccion,
                url_foto
            } // Retornamos los datos actualizados
        } catch (err) {
            throw new Error('Error al actualizar los datos del usuario: ' + err.message)
        }
    }

    // Eliminar un usuario por ID (eliminación lógica)
    static async eliminar(id) {
        const consulta = 'UPDATE usuarios SET estado = FALSE WHERE id = ?'

        try {
            const [resultado] = await pool.execute(consulta, [id])
            if (resultado.affectedRows === 0) {
                throw new Error('Usuario no encontrado')
            }
            return { id, estado: false }  // Retornamos el ID y el estado actualizado
        } catch (err) {
            throw new Error('Error al eliminar el usuario: ' + err.message)
        }
    }

    // Establecer foto de perfil al usuario
    static async establecerURLFoto(id, url_foto) {
        const consulta = 'UPDATE usuarios SET url_foto = ? WHERE id = ?'

        try {
            const [resultado] = await pool.execute(consulta, [url_foto, id])
            if (resultado.affectedRows === 0) {
                throw new Error('Usuario no encontrado')
            }
            return { id, url_foto }  // Retornamos el ID y la nueva URL de la foto
        } catch (err) {
            throw new Error('Error al establecer la foto de perfil: ' + err.message)
        }
    }

    // Guardar el código de verificación y la expiración
    static async guardarCodigoVerificacion(id, codigo, expiracion) {
        const consulta = 'UPDATE usuarios SET codigo_verificacion = ?, expiracion_codigo = ? WHERE id = ? AND estado = TRUE'

        try {
            const [resultado] = await pool.execute(consulta, [codigo, expiracion, id])
            return { id, codigo_verificacion: codigo, expiracion_codigo: expiracion }
        } catch (err) {
            throw new Error('Error al guardar el código de verificación: ' + err.message)
        }
    }

    // Obtener el código de verificación y la expiración
    static async obtenerCodigoVerificacion(id) {
        const consulta = 'SELECT codigo_verificacion, expiracion_codigo FROM usuarios WHERE id = ? AND estado = TRUE'

        try {
            const [filas] = await pool.execute(consulta, [id])
            if (filas.length === 0) {
                return null
            }
            return filas[0]  // Retornamos el código de verificación y expiración
        } catch (err) {
            throw new Error('Error al obtener el código de verificación: ' + err.message)
        }
    }

    // Comparar código de verificación
    static async compararCodigoVerificacion(correo, codigo) {
        const consulta = 'SELECT id FROM usuarios WHERE correo = ? AND codigo_verificacion = ? AND estado = TRUE'

        try {
            const [filas] = await pool.execute(consulta, [correo, codigo])
            return filas[0]  // Retornamos el ID si la comparación es correcta
        } catch (err) {
            throw new Error('Error al comparar código de verificación: ' + err.message)
        }
    }

    // Restablecer Contraseña del Usuario
    static async actualizarContraseña(correo, nuevaContraseña) {
        const consulta = 'UPDATE usuarios SET contraseña = ? WHERE correo = ? AND estado = TRUE'

        try {
            const [resultado] = await pool.execute(consulta, [nuevaContraseña, correo])
            return { correo, nuevaContraseña }  // Retornamos el ID y la nueva contraseña
        } catch (err) {
            throw new Error('Error al actualizar la contraseña: ' + err.message)
        }
    }
}
