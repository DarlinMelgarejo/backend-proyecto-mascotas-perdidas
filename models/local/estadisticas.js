import { pool } from '../../connection/local/conexion.js'  // Pool de conexiones

export class ModeloEstadisticas {

    // Obtener la cantidad de reportes de mascotas
    static async obtenerCantidadReportes() {
        const consulta = 'SELECT COUNT(*) AS cantidad FROM reportes_mascotas' 
        
        try {
            const [filas] = await pool.execute(consulta)
            
            return filas[0]
        } catch (err) {
            throw new Error('Error al obtener los comentarios: ' + err.message)
        }
    }
    
    // Obtener la cantidad de reportes de mascotas resueltos
    static async obtenerCantidadReportesResueltos() {
        const consulta = "SELECT COUNT(*) AS cantidad FROM reportes_mascotas WHERE estado_mascota = 'Encontrado'" 
        
        try {
            const [filas] = await pool.execute(consulta)
            
            return filas[0]
        } catch (err) {
            throw new Error('Error al obtener los comentarios: ' + err.message)
        }
    }
    
    // Obtener la cantidad de usuarios activos
    static async obtenerCantidadUsuariosActivos() {
        const consulta = "SELECT COUNT(*) AS cantidad FROM usuarios WHERE estado = TRUE" 
        
        try {
            const [filas] = await pool.execute(consulta)
            
            return filas[0]
        } catch (err) {
            throw new Error('Error al obtener los comentarios: ' + err.message)
        }
    }

    // Obtener cantidad de reportes por un usuario
    static async obtenerCantidadReportesUsuario(usuario_id) {
        const consulta = 'SELECT COUNT(*) AS cantidad FROM reportes_mascotas WHERE usuario_id = ?'
        
        try {
            const [filas] = await pool.execute(consulta, [usuario_id])
            
            return filas[0]
        } catch (err) {
            throw new Error('Error al obtener el comentario: ' + err.message)
        }
    }
    
    // Obtener cantidad de reportes encontrados por un usuario
    static async obtenerCantidadReportesEncontradosUsuario(usuario_id) {
        const consulta = "SELECT COUNT(*) AS cantidad FROM reportes_mascotas WHERE usuario_id = ? AND estado_mascota = 'Encontrado'"
        
        try {
            const [filas] = await pool.execute(consulta, [usuario_id])
            
            return filas[0]
        } catch (err) {
            throw new Error('Error al obtener el comentario: ' + err.message)
        }
    }
    
    // Obtener cantidad de comentarios por un usuario
    static async obtenerCantidadComentariosUsuario(usuario_id) {
        const consulta = 'SELECT COUNT(*) AS cantidad FROM comentarios WHERE usuario_id = ?'
        
        try {
            const [filas] = await pool.execute(consulta, [usuario_id])
            
            return filas[0]
        } catch (err) {
            throw new Error('Error al obtener el comentario: ' + err.message)
        }
    }
}
