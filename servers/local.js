import { crearServidor } from "../server.js";

import { ModeloUsuarios } from "../models/local/usuarios.js"
import { ModeloReportesMascotas } from "../models/local/reportesMascotas.js"
import { ModeloComentarios } from "../models/local/comentarios.js"
import { ModeloEstadisticas } from "../models/local/estadisticas.js";

crearServidor({
    modeloUsuarios: ModeloUsuarios,
    modeloReportesMascotas: ModeloReportesMascotas,
    modeloComentarios: ModeloComentarios,
    modeloEstadisticas: ModeloEstadisticas
})