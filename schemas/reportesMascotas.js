import zod from "zod";

const reporteMascotaEsquema = zod.object({
    fecha_reporte: zod.string({
        invalid_type_error: "La fecha de reporte debe ser una fecha válida",
        required_error: "La fecha de reporte es requerida"
    }),
    nombre_mascota: zod.string({
        invalid_type_error: "El nombre de la mascota debe ser una cadena de texto",
        required_error: "El nombre de la mascota es requerido"
    }),
    especie_mascota: zod.enum(['Perro', 'Gato', 'Otro'], {
        invalid_type_error: "La especie de la mascota debe estar dentro de las opciones",
        required_error: "La especie de la mascota es requerida"
    }),
    raza_mascota: zod.string({
        invalid_type_error: "La raza de la mascota debe ser una cadena de texto",
        required_error: "La raza de la mascota es requerido"
    }),
    color_mascota: zod.string({
        invalid_type_error: "El color de la mascota debe ser una cadena de texto",
        required_error: "El color de la mascota es requerido"
    }),
    sexo_mascota: zod.enum(['Macho', 'Hembra', 'Desconocido'], {
        invalid_type_error: "El sexo de la mascota debe estar dentro de las opciones",
        required_error: "El sexo de la mascota es requerido"
    }),
    edad_mascota: zod.string({
        invalid_type_error: "La edad de la mascota debe ser una cadena de texto",
        required_error: "La edad de la mascota es requerido"
    }),
    descripcion_mascota: zod.string({
        invalid_type_error: "La descripción de la mascota debe ser una cadena de texto",
        required_error: "La descripción de la mascota es requerida"
    }),
    url_foto_mascota: zod.string({
        invalid_type_error: "La URL de la foto de la mascota debe ser una cadena de texto"
    }).optional(),
    estado_mascota: zod.enum(['Perdido', 'Encontrado'], {
        invalid_type_error: "El estado de la mascota debe ser 'Perdido' o 'Encontrado'",
        required_error: "El estado de la mascota es requerido"
    }),
    procedencia_mascota: zod.enum(['San Pedro de Lloc', 'Pacasmayo'], {
        invalid_type_error: "La procedencia debe estar dentro de las opciones",
        required_error: "La procedencia es requerida"
    }),
    ubicacion_mascota: zod.string({
        invalid_type_error: "La ubicación debe ser una cadena de texto",
        required_error: "La ubicación es requerida"
    }),
    latitud_ubicacion: zod.number({
        invalid_type_error: "La latitud debe ser un número",
        required_error: "La latitud es requerida"
    }),
    longitud_ubicacion: zod.number({
        invalid_type_error: "La longitud debe ser un número",
        required_error: "La longitud es requerida"
    })
});

export function validarReporteMascota(objeto) {
    return reporteMascotaEsquema.safeParse(objeto);
}

export function validarReporteMascotaParcial(objeto) {
    return reporteMascotaEsquema.partial().safeParse(objeto);
}
