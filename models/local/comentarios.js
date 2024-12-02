import { pool } from '../../connection/local/conexion.js'  // Pool de conexiones

export class ModeloComentarios {
    // Registrar un nuevo comentario
    static async registrar(contenido, usuario_id, reporte_mascota_id) {
        const consulta = 'INSERT INTO comentarios (contenido, usuario_id, reporte_mascota_id) VALUES (?, ?, ?)';
        
        try {
            const [resultado] = await pool.execute(consulta, [contenido, usuario_id, reporte_mascota_id]);
            
            // Retornar el comentario con la estructura esperada
            return {
                id: resultado.insertId,  // El ID generado por MySQL
                contenido,
                usuario_id,
                reporte_mascota_id,
                activo: true,
                reportado: false,
                creado_en: new Date().toISOString(),
            };
        } catch (err) {
            throw new Error('Error al registrar el comentario: ' + err.message);
        }
    }

    // Obtener todos los comentarios
    static async obtenerTodos() {
        const consulta = 'SELECT id, contenido, usuario_id, reporte_mascota_id, activo, reportado, creado_en FROM comentarios WHERE activo = TRUE AND reportado = FALSE';  // Obtener solo comentarios activos
        
        try {
            const [filas] = await pool.execute(consulta);
            
            // Mapeamos el resultado para asegurar la misma estructura
            return filas.map(fila => ({
                id: fila.id,
                contenido: fila.contenido,
                usuario_id: fila.usuario_id,
                reporte_mascota_id: fila.reporte_mascota_id,
                activo: fila.activo,
                reportado: fila.reportado,
                creado_en: fila.creado_en,
            }));
        } catch (err) {
            throw new Error('Error al obtener los comentarios: ' + err.message);
        }
    }

    // Obtener un comentario por ID
    static async obtenerPorId(id) {
        const consulta = 'SELECT id, contenido, usuario_id, reporte_mascota_id, activo, reportado, creado_en FROM comentarios WHERE id = ? AND activo = TRUE AND reportado = FALSE';
        
        try {
            const [filas] = await pool.execute(consulta, [id]);
            if (filas.length === 0) {
                throw new Error('Comentario no encontrado');
            }
            
            // Retornamos el comentario con la estructura esperada
            return {
                id: filas[0].id,
                contenido: filas[0].contenido,
                usuario_id: filas[0].usuario_id,
                reporte_mascota_id: filas[0].reporte_mascota_id,
                activo: filas[0].activo,
                reportado: filas[0].reportado,
                creado_en: filas[0].creado_en,
            };
        } catch (err) {
            throw new Error('Error al obtener el comentario: ' + err.message);
        }
    }
    
    // Obtener un comentario por reporte ID
    static async obtenerPorReporteId(reporte_mascota_id) {
        const consulta = 'SELECT id, contenido, usuario_id, reporte_mascota_id, creado_en FROM comentarios WHERE reporte_mascota_id = ? AND reportado = FALSE AND activo = TRUE';
        
        try {
            const [filas] = await pool.execute(consulta, [reporte_mascota_id]);
            
            // Mapeamos los resultados para devolverlos con la estructura esperada
            return filas.map(fila => ({
                id: fila.id,
                contenido: fila.contenido,
                usuario_id: fila.usuario_id,
                reporte_mascota_id: fila.reporte_mascota_id,
                creado_en: fila.creado_en,
            }));
        } catch (err) {
            throw new Error('Error al obtener los comentarios: ' + err.message);
        }
    }

    // Actualizar un comentario por ID
    static async actualizar(id, datosActualizados) {
        try {
            // Obtener el registro original por ID
            const comentarioOriginal = await ModeloComentarios.obtenerPorId(id);
            if (!comentarioOriginal) {
                throw new Error('Comentario no encontrado');
            }

            // Comparar y mantener los valores originales para los campos que no se pasaron
            const contenido = datosActualizados.contenido || comentarioOriginal.contenido;

            const consulta = 'UPDATE comentarios SET contenido = ? WHERE id = ?';
            const [resultado] = await pool.execute(consulta, [contenido, id]);
            
            // Retornar el comentario actualizado con la estructura esperada
            return {
                id,
                contenido,
                usuario_id: comentarioOriginal.usuario_id,
                reporte_mascota_id: comentarioOriginal.reporte_mascota_id,
                activo: comentarioOriginal.activo,
                reportado: comentarioOriginal.reportado,
                creado_en: comentarioOriginal.creado_en,  // No cambiamos el "creado_en"
            };
        } catch (err) {
            throw new Error('Error al actualizar el comentario: ' + err.message);
        }
    }

    // Eliminar un comentario (eliminación lógica)
    static async eliminar(id) {
        const consulta = 'DELETE FROM comentarios WHERE id = ?';
        
        try {
            const [resultado] = await pool.execute(consulta, [id]);
            if (resultado.affectedRows === 0) {
                throw new Error('Comentario no encontrado');
            }
            
            // Retornar un objeto con la misma estructura que otros modelos
            return {
                id,
                mensaje: 'Comentario eliminado exitosamente',
                activo: false,
            };
        } catch (err) {
            throw new Error('Error al eliminar el comentario: ' + err.message);
        }
    }
}
