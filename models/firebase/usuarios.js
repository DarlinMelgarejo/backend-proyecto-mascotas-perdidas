import { db } from '../../connection/firebase/conexion.js'  // Archivo de conexión a Firebase

export class ModeloUsuarios {
    // Registrar un nuevo usuario
    static async registrar(dni, contraseña, nombres, apellidos, correo, telefono, procedencia, direccion) {
        const usuariosRef = db.collection('usuarios')
        const nuevoUsuario = {
            dni,
            contraseña,
            nombres,
            apellidos,
            correo,
            telefono,
            procedencia,
            direccion,
            estado: true,  // Usuario activo por defecto
            url_foto: 'default.jpg',  // Foto de perfil por defecto
            codigo_verificacion: null,
            expiracion_codigo: null,
            creado_en: new Date(),
            actualizado_en: new Date()
        }

        try {
            const docRef = await usuariosRef.add(nuevoUsuario)
            return { id: docRef.id,
                ...nuevoUsuario
            }  // Retornamos el ID del documento creado
        } catch (err) {
            throw new Error('Error al crear el usuario: ' + err.message)
        }
    }

    // Obtener todos los usuarios
    static async obtenerTodos() {
        const usuariosRef = db.collection('usuarios')
        
        try {
            const snapshot = await usuariosRef.where('estado', '==', true).get()
            if (snapshot.empty) {
                return []
            }
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        } catch (err) {
            throw new Error('Error al obtener los usuarios: ' + err.message)
        }
    }

    // Obtener un usuario por algun campo
    static async obtenerPor(campo, valor) {
        try {
            if (campo === 'id') {
                // Si el campo es 'id', buscamos el documento con el id directamente
                const docRef = db.collection('usuarios').doc(valor)
                const doc = await docRef.get()

                if (!doc.exists) {
                    throw new Error('Usuario no encontrado')
                }

                const usuarioData = doc.data()
                const usuario = {
                    id: doc.id, // El ID del documento
                    ...usuarioData
                }

                return usuario
            } else {
                // Si el campo no es 'id', utilizamos 'where' para buscar por otros campos
                const snapshot = await db.collection('usuarios')
                    .where(campo, '==', valor)  // Realizamos la búsqueda por el campo proporcionado
                    .where('estado', '==', true)  // Solo usuarios activos
                    .get()

                if (snapshot.empty) {
                    throw new Error('Usuario no encontrado')
                }

                // Tomamos el primer documento encontrado
                const usuarioData = snapshot.docs[0].data()
                const usuario = {
                    id: snapshot.docs[0].id, // El ID del documento
                    ...usuarioData
                }

                return usuario
            }
        } catch (err) {
            throw new Error('Error al obtener el usuario: ' + err.message)
        }
    }

    // Actualizar un usuario por ID
    static async actualizar(id, nombres, apellidos, correo, telefono, direccion, url_foto) {
        const usuarioRef = db.collection('usuarios').doc(id)

        try {
            await usuarioRef.update({
                nombres,
                apellidos,
                correo,
                telefono,
                direccion,
                url_foto,
                actualizado_en: new Date()
            })
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
        const usuarioRef = db.collection('usuarios').doc(id)

        try {
            const usuario = await usuarioRef.get()
            if (!usuario.exists) {
                throw new Error('Usuario no encontrado')
            }

            await usuarioRef.update({ estado: false })
            return { id, estado: false }  // Indicamos que el estado del usuario es falso (eliminado)
        } catch (err) {
            throw new Error('Error al eliminar el usuario: ' + err.message)
        }
    }

    // Establecer foto de perfil al usuario
    static async establecerURLFoto(id, url_foto) {
        const usuarioRef = db.collection('usuarios').doc(id)

        try {
            const usuario = await usuarioRef.get()
            if (!usuario.exists) {
                throw new Error('Usuario no encontrado')
            }

            await usuarioRef.update({ url_foto })
            return { id, url_foto }  // Retornamos el ID y la nueva URL de la foto
        } catch (err) {
            throw new Error('Error al establecer la foto de perfil: ' + err.message)
        }
    }

    // Guardar el código de verificación y la expiración
    static async guardarCodigoVerificacion(id, codigo, expiracion) {
        const usuarioRef = db.collection('usuarios').doc(id)

        try {
            await usuarioRef.update({
                codigo_verificacion: codigo,
                expiracion_codigo: expiracion
            })

            return { id, codigo_verificacion: codigo, expiracion_codigo: expiracion }
        } catch (err) {
            throw new Error('Error al guardar el código de verificación: ' + err.message)
        }
    }

    // Obtener el código de verificación y la expiración
    static async obtenerCodigoVerificacion(id) {
        const usuarioRef = db.collection('usuarios').doc(id)

        try {
            const doc = await usuarioRef.get()
            if (!doc.exists) {
                throw new Error('Usuario no encontrado')
            }
            return { id, ...doc.data() }
        } catch (err) {
            throw new Error('Error al obtener el código de verificación: ' + err.message)
        }
    }

    // Comparar código de verificación
    static async compararCodigoVerificacion(correo, codigo) {
        const usuariosRef = db.collection('usuarios')

        try {
            const snapshot = await usuariosRef.where('correo', '==', correo)
                                               .where('codigo_verificacion', '==', codigo)
                                               .where('estado', '==', true)
                                               .get()

            if (snapshot.empty) {
                return null
            }

            return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() }
        } catch (err) {
            throw new Error('Error al comparar código de verificación: ' + err.message)
        }
    }

    // Restablecer Contraseña del Usuario
    static async actualizarContraseña(id, nuevaContraseña) {
        const usuarioRef = db.collection('usuarios').doc(id)

        try {
            await usuarioRef.update({ contraseña: nuevaContraseña })
            return { id, contraseña: nuevaContraseña }
        } catch (err) {
            throw new Error('Error al actualizar la contraseña: ' + err.message)
        }
    }
}
