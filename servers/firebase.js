import { crearServidor } from "../server.js";

import { ModeloUsuarios } from "../models/firebase/usuarios.js"
import { ModeloReportesMascotas } from "../models/firebase/reportesMascotas.js"
import { ModeloComentarios } from "../models/firebase/comentarios.js"

crearServidor({
    modeloUsuarios: ModeloUsuarios,
    modeloReportesMascotas: ModeloReportesMascotas,
    modeloComentarios: ModeloComentarios
})