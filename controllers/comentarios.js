import { validarComentario, validarComentarioParcial } from '../schemas/comentarios.js';  // Importar las validaciones

export class ControladorComentarios {
    constructor({ modeloComentarios }) {
        this.modeloComentarios = modeloComentarios;
    }

    // Registrar un nuevo comentario
    registrar = async (req, res) => {
        const resultado = validarComentario(req.body);

        if (!resultado.success) {
            return res.status(400).json({ error: JSON.parse(resultado.error.message) });
        }

        const { contenido, usuario_id, reporte_mascota_id } = resultado.data;

        try {
            const nuevoComentario = await this.modeloComentarios.registrar(contenido, usuario_id, reporte_mascota_id);
            return res.status(201).json({
                mensaje: 'Comentario registrado exitosamente',
                comentario: nuevoComentario  // Devolvemos el comentario tal como lo devuelve el modelo
            });
        } catch (err) {
            if (err.message.includes("FOREIGN key constraint fails")) {
                return res.status(400).json({ mensaje: 'El ID de usuario o mascota no existe.' });
            }
            res.status(500).json({ mensaje: err.message });
        }
    }

    // Obtener todos los comentarios
    obtenerTodos = async (req, res) => {
        try {
            const comentarios = await this.modeloComentarios.obtenerTodos();
            res.status(200).json({
                mensaje: 'Comentarios obtenidos exitosamente',
                comentarios: comentarios  // Devolvemos todos los comentarios
            });
        } catch (err) {
            res.status(500).json({ mensaje: err.message });
        }
    }

    // Obtener un comentario por ID
    obtenerPorId = async (req, res) => {
        const { id } = req.params;

        try {
            const comentario = await this.modeloComentarios.obtenerPorId(id);
            if (!comentario) {
                return res.status(404).json({ mensaje: 'Comentario no encontrado' });
            }
            res.status(200).json({
                mensaje: 'Comentario obtenido exitosamente',
                comentario: comentario  // Devolvemos el comentario tal cual
            });
        } catch (err) {
            res.status(500).json({ mensaje: err.message });
        }
    }

    // Obtener comentarios por reporte ID
    obtenerPorReporteId = async (req, res) => {
        const { id } = req.params;

        try {
            const comentarios = await this.modeloComentarios.obtenerPorReporteId(id);
            if (!comentarios || comentarios.length === 0) {
                return res.status(404).json({ mensaje: 'Comentarios no encontrados' });
            }
            res.status(200).json({
                mensaje: 'Comentarios obtenidos exitosamente',
                comentarios: comentarios  // Devolvemos todos los comentarios relacionados con el reporte
            });
        } catch (err) {
            res.status(500).json({ mensaje: err.message });
        }
    }

    // Actualizar un comentario
    actualizar = async (req, res) => {
        const { id } = req.params;
        const resultado = validarComentarioParcial(req.body);  // Validación parcial de los datos
        
        if (!resultado.success) {
            return res.status(400).json({ error: JSON.parse(resultado.error.message) });
        }

        const datosActualizados = resultado.data;

        try {
            const comentarioActualizado = await this.modeloComentarios.actualizar(id, datosActualizados);
            if (!comentarioActualizado) {
                return res.status(404).json({ mensaje: 'Comentario no encontrado' });
            }

            res.status(200).json({
                mensaje: 'Comentario actualizado exitosamente',
                comentario: comentarioActualizado  // Devolvemos el comentario actualizado
            });
        } catch (err) {
            res.status(500).json({ mensaje: err.message });
        }
    }

    // Eliminar un comentario (eliminación lógica)
    eliminar = async (req, res) => {
        const { id } = req.params;

        try {
            const resultadoEliminacion = await this.modeloComentarios.eliminar(id);
            if (!resultadoEliminacion) {
                return res.status(404).json({ mensaje: 'Comentario no encontrado' });
            }
            res.status(200).json({
                mensaje: 'Comentario eliminado exitosamente',
                resultado: resultadoEliminacion  // Devolvemos el resultado de la eliminación
            });
        } catch (err) {
            res.status(500).json({ mensaje: err.message });
        }
    }
}
