import zod from "zod";

const comentarioEsquema = zod.object({
    contenido: zod.string({
        invalid_type_error: "El contenido del comentario debe ser una cadena de texto",
        required_error: "El contenido del comentario es requerido"
    }).nonempty("El comentario no puede estar vacío"),

    usuario_id: zod.string().length(36, {
        message: "El ID del usuario debe tener exactamente 36 caracteres"
    }),

    reporte_mascota_id: zod.string().length(36, {
        message: "El ID del reporte de la mascota debe tener exactamente 36 caracteres"
    }),

    reportado: zod.boolean().default(false),  // Valor por defecto para reportado
    activo: zod.boolean().default(true)  // Valor por defecto para activo
});

export function validarComentario(objeto) {
    return comentarioEsquema.safeParse(objeto);
}

export function validarComentarioParcial(objeto) {
    return comentarioEsquema.partial().safeParse(objeto);
}
