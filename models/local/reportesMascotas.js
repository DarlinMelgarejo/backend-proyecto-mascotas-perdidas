import { pool } from '../../connection/local/conexion.js'  // Pool de conexiones

export class ModeloReportesMascotas {
    // Registrar un nuevo reporte de mascota con imagen
    static async registrar(fecha_reporte, nombre_mascota, especie_mascota, raza_mascota, color_mascota, sexo_mascota, edad_mascota, descripcion_mascota, url_foto_mascota, estado_mascota, procedencia_mascota, ubicacion_mascota, latitud_ubicacion, longitud_ubicacion, usuario_id) {
        const consulta = `
            INSERT INTO reportes_mascotas (fecha_reporte, nombre_mascota, especie_mascota, raza_mascota, color_mascota, sexo_mascota, edad_mascota, descripcion_mascota, url_foto_mascota, estado_mascota, procedencia_mascota, ubicacion_mascota, latitud_ubicacion, longitud_ubicacion, usuario_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        try {
            const [resultado] = await pool.execute(consulta, [
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
                usuario_id
            ]);
            return { id: resultado.insertId, ...resultado };  // Retorna el ID y el resultado completo
        } catch (err) {
            throw new Error('Error al registrar el reporte de la mascota: ' + err.message);
        }
    }

    // Obtener todos los reportes de mascotas
    static async obtenerTodos() {
        const consulta = "SELECT * FROM reportes_mascotas WHERE activo = TRUE";  // Obtener todas las mascotas activas
        
        try {
            const [filas] = await pool.execute(consulta);
            return filas.map(fila => ({ id: fila.id, ...fila }));  // Agregar el campo id a cada fila
        } catch (err) {
            throw new Error('Error al obtener los reportes de mascotas: ' + err.message);
        }
    }
    
    // Obtener los reportes más recientes
    static async obtenerReportesRecientes() {
        const consulta = 'SELECT id, nombre_mascota, especie_mascota, url_foto_mascota, estado_mascota, creado_en FROM reportes_mascotas WHERE activo = TRUE ORDER BY creado_en DESC LIMIT 5';
        
        try {
            const [filas] = await pool.execute(consulta);
            return filas.map(fila => ({ id: fila.id, ...fila }));  // Agregar el campo id a cada fila
        } catch (err) {
            throw new Error('Error al obtener los reportes recientes de mascotas: ' + err.message);
        }
    }
    
    // Obtener todos los reportes de mascotas de un usuario por su ID
    static async obtenerReportesDeUnUsuario(id) {
        const consulta = 'SELECT id, fecha_reporte, nombre_mascota, especie_mascota, raza_mascota, color_mascota, url_foto_mascota, estado_mascota, procedencia_mascota, estado_reporte FROM reportes_mascotas WHERE activo = TRUE AND usuario_id = ?';
        
        try {
            const [filas] = await pool.execute(consulta, [id]);
            return filas.map(fila => ({ id: fila.id, ...fila }));  // Agregar el campo id a cada fila
        } catch (err) {
            throw new Error('Error al obtener los reportes de mascotas: ' + err.message);
        }
    }
    
    // Obtener un cierto número de reportes de mascotas de un usuario por su ID
    static async obtenerAlgunosReportesDeUnUsuario(id, n) {
        const consulta = 'SELECT id, fecha_reporte, nombre_mascota, especie_mascota, url_foto_mascota, estado_mascota, procedencia_mascota, estado_reporte FROM reportes_mascotas WHERE activo = TRUE AND usuario_id = ? LIMIT ?';
        
        try {
            const [filas] = await pool.execute(consulta, [id, n]);
            return filas.map(fila => ({ id: fila.id, ...fila }));  // Agregar el campo id a cada fila
        } catch (err) {
            throw new Error('Error al obtener los reportes de mascotas: ' + err.message);
        }
    }

    // Obtener un reporte de mascota por ID
    static async obtenerPorId(id) {
        const consulta = 'SELECT * FROM reportes_mascotas WHERE id = ? AND activo = TRUE';
        
        try {
            const [filas] = await pool.execute(consulta, [id]);
            if (filas.length === 0) {
                throw new Error('Reporte de mascota no encontrado');
            }
            return { id: filas[0].id, ...filas[0] };  // Retorna el reporte con su ID
        } catch (err) {
            throw new Error('Error al obtener el reporte de la mascota: ' + err.message);
        }
    }

    // Actualizar un reporte de mascota por ID
    static async actualizar(id, fecha_reporte, nombre_mascota, especie_mascota, raza_mascota, color_mascota, sexo_mascota, edad_mascota, descripcion_mascota, url_foto_mascota, estado_mascota, procedencia_mascota, ubicacion_mascota, latitud_ubicacion, longitud_ubicacion) {
        try {
            // Actualizar los datos del reporte
            const consulta = 'UPDATE reportes_mascotas SET fecha_reporte = ?, nombre_mascota = ?, especie_mascota = ?, raza_mascota = ?, color_mascota = ?, sexo_mascota = ?, edad_mascota = ?, descripcion_mascota = ?, url_foto_mascota = ?, estado_mascota = ?, procedencia_mascota = ?, ubicacion_mascota = ?, latitud_ubicacion = ?, longitud_ubicacion = ? WHERE id = ? AND activo = TRUE';
            const [resultado] = await pool.execute(consulta, [
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
                id
            ]);

            if (resultado.affectedRows === 0) {
                throw new Error('Reporte de mascota no encontrado');
            }

            return { id };  // Retorna el ID y los datos actualizados
        } catch (err) {
            throw new Error('Error al actualizar el reporte de la mascota: ' + err.message);
        }
    }

    // Actualizar el estado del reporte por ID
    static async actualizarEstado(id) {
        try {
            const consulta = "UPDATE reportes_mascotas SET estado_reporte = 'Resuelto', resuelto_en = NOW() WHERE id = ?"
            const [resultado] = await pool.execute(consulta, [id])
            return resultado
        } catch (error) {
            throw new Error('Error al actualizar el reporte de la mascota: ' + error.message);
        }
    }

    // Eliminar un reporte de mascota (eliminación lógica)
    static async eliminar(id) {
        const consulta = 'UPDATE reportes_mascotas SET activo = FALSE WHERE id = ?';
        
        try {
            const [resultado] = await pool.execute(consulta, [id]);
            if (resultado.affectedRows === 0) {
                throw new Error('Reporte de mascota no encontrado');
            }
            return { id };  // Devuelve mensaje de éxito con el ID
        } catch (err) {
            throw new Error('Error al eliminar el reporte de la mascota: ' + err.message);
        }
    }
}
