import { db } from '../../connection/firebase/conexion.js';  // Conexión a Firebase

export class ModeloComentarios {
    // Registrar un nuevo comentario
    static async registrar(contenido, usuario_id, reporte_mascota_id) {
        try {
            // Crear una nueva entrada en la colección "comentarios"
            const comentarioRef = db.collection('comentarios').doc();  // Genera un ID automáticamente
            const comentarioData = {
                contenido,
                usuario_id,
                reporte_mascota_id,
                activo: true,
                reportado: false,
                creado_en: new Date().toISOString(),
            };

            // Guardar el comentario
            await comentarioRef.set(comentarioData);
            return {
                id: comentarioRef.id,  // Retornar el ID generado por Firebase
                ...comentarioData,     // Retornar los datos completos del comentario
            };
        } catch (err) {
            throw new Error('Error al registrar el comentario: ' + err.message);
        }
    }

    // Obtener todos los comentarios
    static async obtenerTodos() {
        try {
            const snapshot = await db.collection('comentarios')
                .where('activo', '==', true)
                .where('reportado', '==', false)
                .get();

            // Devolver los comentarios en formato adecuado
            const comentarios = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            return comentarios;
        } catch (err) {
            throw new Error('Error al obtener los comentarios: ' + err.message);
        }
    }

    // Obtener un comentario por ID
    static async obtenerPorId(id) {
        try {
            const doc = await db.collection('comentarios').doc(id).get();
            if (!doc.exists) {
                throw new Error('Comentario no encontrado');
            }
            return { id: doc.id, ...doc.data() };  // Retornar el comentario con el ID
        } catch (err) {
            throw new Error('Error al obtener el comentario: ' + err.message);
        }
    }

    // Obtener comentarios por reporte de mascota ID
    static async obtenerPorReporteId(reporte_mascota_id) {
        try {
            const snapshot = await db.collection('comentarios')
                .where('reporte_mascota_id', '==', reporte_mascota_id)
                .where('activo', '==', true)
                .where('reportado', '==', false)
                .get();

            // Devolver los comentarios en formato adecuado
            const comentarios = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            return comentarios;
        } catch (err) {
            throw new Error('Error al obtener los comentarios: ' + err.message);
        }
    }

    // Actualizar un comentario por ID
    static async actualizar(id, datosActualizados) {
        try {
            const docRef = db.collection('comentarios').doc(id);
            const doc = await docRef.get();
            if (!doc.exists) {
                throw new Error('Comentario no encontrado');
            }

            // Actualizar solo los campos que se pasen
            await docRef.update(datosActualizados);

            // Retornar los datos actualizados
            const updatedDoc = await docRef.get();
            return {
                id: updatedDoc.id,
                ...updatedDoc.data(),
            };
        } catch (err) {
            throw new Error('Error al actualizar el comentario: ' + err.message);
        }
    }

    // Eliminar un comentario (eliminación lógica)
    static async eliminar(id) {
        try {
            const docRef = db.collection('comentarios').doc(id);
            const doc = await docRef.get();
            if (!doc.exists) {
                throw new Error('Comentario no encontrado');
            }

            // Marcar como no activo (eliminación lógica)
            await docRef.update({ activo: false });

            return { id, mensaje: 'Comentario eliminado exitosamente' };
        } catch (err) {
            throw new Error('Error al eliminar el comentario: ' + err.message);
        }
    }
}
