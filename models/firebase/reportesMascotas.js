import admin from 'firebase-admin';

const db = admin.firestore();

export class ModeloReportesMascotas {

    // Registrar un nuevo reporte de mascota con imagen
    static async registrar(fecha_reporte, nombre_mascota, especie_mascota, raza_mascota, color_mascota, sexo_mascota, edad_mascota, descripcion_mascota, url_foto_mascota, estado_mascota, procedencia_mascota, ubicacion_mascota, latitud_ubicacion, longitud_ubicacion, usuario_id) {
        try {
            const nuevoReporte = {
                fecha_reporte,
                nombre_mascota,
                especie_mascota,
                raza_mascota,
                color_mascota,
                sexo_mascota,
                edad_mascota,
                descripcion_mascota,
                url_foto_mascota,
                estado_mascota,
                procedencia_mascota,
                ubicacion_mascota,
                latitud_ubicacion,
                longitud_ubicacion,
                usuario_id,
                activo: true,  // Marcamos que el reporte está activo por defecto
                creado_en: new Date()  // Fecha de creación en Firestore
            };
            
            const docRef = await db.collection('reportes_mascotas').add(nuevoReporte);
            return {
                id: docRef.id,
                ...nuevoReporte
            }; 
        } catch (err) {
            throw new Error('Error al registrar el reporte de la mascota: ' + err.message);
        }
    }

    // Obtener todos los reportes de mascotas
    static async obtenerTodos() {
        try {
            const snapshot = await db.collection('reportes_mascotas')
                .where('activo', '==', true)  // Solo reportes activos
                .get();

            const reportes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return reportes;
        } catch (err) {
            throw new Error('Error al obtener los reportes de mascotas: ' + err.message);
        }
    }

    // Obtener los reportes más recientes (últimos 5)
    static async obtenerReportesRecientes() {
        try {
            const snapshot = await db.collection('reportes_mascotas')
                .where('activo', '==', true)
                .orderBy('creado_en', 'desc')
                .limit(5)
                .get();

            const reportes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return reportes;
        } catch (err) {
            throw new Error('Error al obtener los reportes recientes de mascotas: ' + err.message);
        }
    }

    // Obtener reportes de mascotas de un usuario por su ID
    static async obtenerReportesDeUnUsuario(usuario_id) {
        try {
            const snapshot = await db.collection('reportes_mascotas')
                .where('activo', '==', true)
                .where('usuario_id', '==', usuario_id)
                .get();

            const reportes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return reportes;
        } catch (err) {
            throw new Error('Error al obtener los reportes de mascotas del usuario: ' + err.message);
        }
    }

    // Obtener algunos reportes de un usuario por ID con un límite
    static async obtenerAlgunosReportesDeUnUsuario(usuario_id, limite) {
        try {
            const snapshot = await db.collection('reportes_mascotas')
                .where('activo', '==', true)
                .where('usuario_id', '==', usuario_id)
                .limit(limite)
                .get();

            const reportes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return reportes;
        } catch (err) {
            console.log(err)
            throw new Error('Error al obtener algunos reportes de mascotas del usuario: ' + err.message);
        }
    }

    // Obtener una mascota por ID
    static async obtenerPorId(id) {
        try {
            const docRef = db.collection('reportes_mascotas').doc(id);
            const doc = await docRef.get();

            if (!doc.exists) {
                throw new Error('Reporte de mascota no encontrado');
            }

            return { id: doc.id, ...doc.data() };
        } catch (err) {
            throw new Error('Error al obtener el reporte de la mascota: ' + err.message);
        }
    }

    // Actualizar un reporte de mascota por ID
    static async actualizar(id, datosActualizados) {
        try {
            const docRef = db.collection('reportes_mascotas').doc(id);
            const doc = await docRef.get();

            if (!doc.exists) {
                throw new Error('Reporte de mascota no encontrado');
            }

            await docRef.update(datosActualizados);
            return { mensaje: 'Reporte actualizado exitosamente' };
        } catch (err) {
            throw new Error('Error al actualizar el reporte de la mascota: ' + err.message);
        }
    }

    // Eliminar (lógicamente) un reporte de mascota
    static async eliminar(id) {
        try {
            const docRef = db.collection('reportes_mascotas').doc(id);
            const doc = await docRef.get();

            if (!doc.exists) {
                throw new Error('Reporte de mascota no encontrado');
            }

            // Marcamos como no activo (eliminación lógica)
            await docRef.update({ activo: false });
            return { id };
        } catch (err) {
            throw new Error('Error al eliminar el reporte de la mascota: ' + err.message);
        }
    }
}
