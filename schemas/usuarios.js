import zod from "zod";

const usuarioEsquema = zod.object({
    dni: zod.string({
        invalid_type_error: "El DNI debe ser una cadena de texto",
        required_error: "El DNI es requerido"
    }).length(8, {
        message: "El DNI debe tener exactamente 8 caracteres"
    }).regex(/^\d{8}$/, {
        message: "El DNI debe contener solo números"
    }),
    
    contraseña: zod.string({
        invalid_type_error: "La contraseña debe ser una cadena de texto",
        required_error: "La contraseña es requerida"
    }).min(6, "La contraseña debe tener al menos 6 caracteres"), // Puedes cambiar el número de caracteres mínimos
    
    nombres: zod.string({
        invalid_type_error: "Los nombres del usuario deben ser una cadena de texto",
        required_error: "Los nombres del usuario son requeridos"
    }).max(255),

    apellidos: zod.string({
        invalid_type_error: "Los apellidos del usuario deben ser una cadena de texto",
        required_error: "Los apellidos del usuario son requeridos"
    }).max(255),

    correo: zod.string({
        invalid_type_error: "El correo electrónico debe ser una cadena de texto",
        required_error: "El correo electrónico es requerido"
    }).email({
        message: "El correo electrónico debe tener un formato válido"
    }),

    telefono: zod.string({
        invalid_type_error: "El teléfono del usuario deben ser cadena de texto",
        required_error: "El teléfono del usuario es requerido"
    }).length(9, "El teléfono debe tener exactamente 9 digitos"),
    
    procedencia: zod.enum(['San Pedro de Lloc', 'Pacasmayo'], {
        invalid_type_error: "La procedencia debe estar dentro de las opciones",
        required_error: "La procedencia es requerida"
    }),

    direccion: zod.string({
        invalid_type_error: "La dirección del usuario deben ser una cadena de texto",
        required_error: "La dirección del usuario es requerida"
    }),
    
    url_foto: zod.string({
        invalid_type_error: "La URL de la foto del usuario debe ser una cadena de texto"
    }).optional()
});

export function validarUsuario(objeto) {
    return usuarioEsquema.safeParse(objeto);
}

export function validarUsuarioParcial(objeto) {
    return usuarioEsquema.partial().safeParse(objeto);
}
