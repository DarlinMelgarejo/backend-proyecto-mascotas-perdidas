import { validarReporteMascota, validarReporteMascotaParcial } from '../schemas/reportesMascotas.js';  // Importar las validaciones
import { eliminarImagen } from '../utils/fotos.js';

export class ControladorReportesMascotas {
    constructor({ modeloReportesMascotas }) {
        this.modeloReportesMascotas = modeloReportesMascotas;
    }

    // Registrar un nuevo reporte de mascota
    registrar = async (req, res) => {
        const usuario_id = req.usuario.id;

        // Validación de los datos del reporte
        const resultado = validarReporteMascota({
            ...req.body,
            latitud_ubicacion: Number(req.body.latitud_ubicacion),
            longitud_ubicacion: Number(req.body.longitud_ubicacion),
        });

        if (!resultado.success) {
            return res.status(400).json({ error: JSON.parse(resultado.error.message) });
        }

        const {
            fecha_reporte,
            nombre_mascota,
            especie_mascota,
            raza_mascota,
            color_mascota,
            sexo_mascota,
            edad_mascota,
            descripcion_mascota,
            estado_mascota,
            procedencia_mascota,
            ubicacion_mascota,
            latitud_ubicacion,
            longitud_ubicacion,
        } = resultado.data;

        let url_foto_mascota = null;  // Si no hay imagen, sigue siendo null

        // Si hay una imagen (Multer la coloca en req.file), asignamos el nombre del archivo
        if (req.file) {
            url_foto_mascota = req.file.filename;
        }
        // Intentamos registrar el reporte en la base de datos
        try {
            const nuevoReporteMascota = await this.modeloReportesMascotas.registrar(
                fecha_reporte,
                nombre_mascota,
                especie_mascota,
                raza_mascota,
                color_mascota,
                sexo_mascota,
                edad_mascota,
                descripcion_mascota,
                url_foto_mascota,  // Si no hay imagen, se guarda como null
                estado_mascota,
                procedencia_mascota,
                ubicacion_mascota,
                latitud_ubicacion,
                longitud_ubicacion,
                usuario_id
            );

            // Verificar si se ha creado el reporte correctamente
            if (!nuevoReporteMascota) {
                return res.status(400).json({ mensaje: 'Error al registrar el reporte de mascota' });
            }

            res.status(201).json({
                mensaje: 'Reporte de mascota registrado exitosamente',
                reporte: nuevoReporteMascota,  // Devolvemos el reporte completo tal como lo devuelve el modelo
            });
        } catch (err) {
            res.status(500).json({ mensaje: err.message });
        }
    };

    // Obtener todos los reportes de mascotas
    obtenerTodos = async (req, res) => {
        try {
            const reportes = await this.modeloReportesMascotas.obtenerTodos();
            res.status(200).json({
                mensaje: 'Reportes de mascotas obtenidos exitosamente',
                reportes: reportes  // Devolvemos todos los reportes
            });
        } catch (err) {
            res.status(500).json({ mensaje: err.message });
        }
    }

    // Obtener los reportes más recientes
    obtenerRecientes = async (req, res) => {
        try {
            const reportes = await this.modeloReportesMascotas.obtenerReportesRecientes();
            res.status(200).json({
                mensaje: 'Reportes recientes obtenidos exitosamente',
                reportes: reportes  // Devolvemos los reportes recientes
            });
        } catch (err) {
            res.status(500).json({ mensaje: err.message });
        }
    }

    // Obtener los reportes de un usuario
    obtenerMisReportes = async (req, res) => {
        const usuarioID = req.usuario.id;

        try {
            const reportes = await this.modeloReportesMascotas.obtenerReportesDeUnUsuario(usuarioID);
            res.status(200).json({
                mensaje: 'Reportes obtenidos exitosamente',
                reportes: reportes  // Devolvemos los reportes del usuario
            });
        } catch (err) {
            res.status(500).json({ mensaje: err.message });
        }
    }

    // Obtener los últimos n reportes de un usuario
    obtenerMisUltimosReportes = async (req, res) => {
        const usuarioID = req.usuario.id;
        const numeroRegistros = req.params.n;

        try {
            const reportes = await this.modeloReportesMascotas.obtenerAlgunosReportesDeUnUsuario(usuarioID, Number(numeroRegistros));
            res.status(200).json({
                mensaje: `Últimos ${numeroRegistros} reportes obtenidos exitosamente`,
                reportes: reportes  // Devolvemos los últimos n reportes del usuario
            });
        } catch (err) {
            //console.log(err)
            res.status(500).json({ mensaje: err.message });
        }
    }

    // Obtener un reporte por ID
    obtenerPorId = async (req, res) => {
        const { id } = req.params;

        try {
            const reporte = await this.modeloReportesMascotas.obtenerPorId(id);
            if (!reporte) {
                return res.status(404).json({ mensaje: 'Reporte de mascota no encontrado' });
            }

            res.status(200).json({
                mensaje: 'Reporte de mascota obtenido exitosamente',
                reporte: reporte  // Devolvemos el reporte
            });
        } catch (err) {
            res.status(500).json({ mensaje: err.message });
        }
    }

    // Actualizar un reporte de mascota
    actualizar = async (req, res) => {
        const { id } = req.params;
        // console.log(`ID: ${id}`)
        // console.log(req.body)
        const resultado = validarReporteMascotaParcial({
            ...req.body,
            latitud_ubicacion: Number(req.body.latitud_ubicacion),
            longitud_ubicacion: Number(req.body.longitud_ubicacion),
        });  // Validación parcial de los datos
        
        if (!resultado.success) {
            return res.status(400).json({ error: JSON.parse(resultado.error.message) });
        }

        const { fecha_reporte, nombre_mascota, especie_mascota, raza_mascota, color_mascota, sexo_mascota, edad_mascota, descripcion_mascota, url_foto_mascota, estado_mascota, procedencia_mascota, ubicacion_mascota, latitud_ubicacion, longitud_ubicacion } = resultado.data;

        let nueva_url_foto_mascota = url_foto_mascota
        if (req.file) {
            eliminarImagen('uploads/mascotas/', nueva_url_foto_mascota);
            nueva_url_foto_mascota = req.file.filename
        }
        
        try {
            const resultadoActualizacion = await this.modeloReportesMascotas.actualizar(id, fecha_reporte, nombre_mascota, especie_mascota, raza_mascota, color_mascota, sexo_mascota, edad_mascota, descripcion_mascota, nueva_url_foto_mascota, estado_mascota, procedencia_mascota, ubicacion_mascota, latitud_ubicacion, longitud_ubicacion);
            
            if (resultadoActualizacion && resultadoActualizacion.id) {
                return res.status(200).json({
                    mensaje: 'Reporte de mascota actualizado exitosamente',
                    reporte: resultadoActualizacion  // Devolvemos el reporte actualizado
                });
            }

            res.status(404).json({ mensaje: 'Reporte de mascota no encontrado' });
        } catch (err) {
            console.log(err)
            res.status(500).json({ mensaje: err.message });
        }
    }

    // Actualizar el estado del reporte
    actualizarEstado = async (req, res) => {
        const { id } = req.params;

        try {
            const resultado = await this.modeloReportesMascotas.actualizarEstado(id);
            
            if (!resultado) return res.status(404).json({mensaje: 'Reporte de mascota no encontrado'});


            res.status(200).json({mensaje: 'Reporte de mascota actualizado exitosamente'});
        } catch (err) {
            console.log(err)
            res.status(500).json({ mensaje: err.message });
        }
    }

    // Eliminar un reporte de mascota (eliminación lógica)
    eliminar = async (req, res) => {
        const { id } = req.params;

        try {
            const resultado = await this.modeloReportesMascotas.eliminar(id);
            if (resultado && resultado.id) {
                return res.status(200).json({
                    mensaje: 'Reporte de mascota eliminado exitosamente',
                    resultado: resultado  // Devolvemos el resultado de la eliminación
                });
            }

            res.status(404).json({ mensaje: 'Reporte de mascota no encontrado' });
        } catch (err) {
            res.status(500).json({ mensaje: err.message });
        }
    }
}
