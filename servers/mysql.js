import { crearServidor } from "../server.js";

import { ModeloUsuarios } from "../models/mysql/usuarios.js"
import { ModeloReportesMascotas } from "../models/mysql/reportesMascotas.js"
import { ModeloComentarios } from "../models/mysql/comentarios.js"

crearServidor({
    modeloUsuarios: ModeloUsuarios,
    modeloReportesMascotas: ModeloReportesMascotas,
    modeloComentarios: ModeloComentarios
})