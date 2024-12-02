export class ControladorEstadisticas {
    constructor({ modeloEstadisticas }) {
        this.modeloEstadisticas = modeloEstadisticas;
    }

    // Obtener todas las estadisticas globales
    obtenerEstadisticasGlobales = async (req, res) => {
        try {
            const reportes = await this.modeloEstadisticas.obtenerCantidadReportes();
            const resueltos = await this.modeloEstadisticas.obtenerCantidadReportesResueltos()
            const usuarios = await this.modeloEstadisticas.obtenerCantidadUsuariosActivos()
            res.status(200).json({
                cantidad_reportes: reportes.cantidad,
                cantidad_reportes_resueltos: resueltos.cantidad,
                cantidad_usuarios_activos: usuarios.cantidad
            });
        } catch (err) {
            res.status(500).json({ mensaje: err.message });
        }
    }

    obtenerEstadisticasUsuario = async (req, res) => {
        const usuarioID = req.usuario.id;
        
        try {
            const reportes = await this.modeloEstadisticas.obtenerCantidadReportesUsuario(usuarioID)
            const encontrados = await this.modeloEstadisticas.obtenerCantidadReportesEncontradosUsuario(usuarioID)
            const comentarios = await this.modeloEstadisticas.obtenerCantidadComentariosUsuario(usuarioID)
            res.status(200).json({
                cantidad_reportes: reportes.cantidad,
                cantidad_animales_encontrados: encontrados.cantidad,
                cantidad_comentarios: comentarios.cantidad
            })
        } catch (error) {
            
        }
    }
}
