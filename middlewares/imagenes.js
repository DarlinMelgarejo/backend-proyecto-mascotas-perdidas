import multer from 'multer'
import { fileURLToPath } from 'url'
import path from 'node:path'

const __rutaGeneral = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__rutaGeneral)

// Función que configura y retorna el middleware Multer
export const guardarImagen = (carpetaDestino) => {
    // Asegurarse de que la subcarpeta esté definida y sea válida
    const direccionCarpeta = path.join(__dirname, '..', 'uploads', carpetaDestino)

    // Configuración de Multer para almacenamiento de imágenes
    const almacenamiento = multer.diskStorage({
        destination: (req, file, cb) => {
        cb(null, direccionCarpeta)  // Carpeta dinámica basada en la subcarpeta
        },
        filename: (req, archivo, cb) => {
        // Crear un nombre único para evitar colisiones
        const nombreUnico = Date.now() + path.extname(archivo.originalname)
        cb(null, nombreUnico)  // Nombre único generado
        }
    })

    // Filtrar solo imágenes
    const filtroArchivo = (req, archivo, cb) => {
        const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png']
        if (tiposPermitidos.includes(archivo.mimetype)) {
            cb(null, true) // Si el tipo es permitido
        } else {
            cb(new Error('Solo se permiten imágenes en formato JPEG, JPG o PNG')) // Error si no es permitido
        }
    }

    // El middleware de Multer con la configuración de almacenamiento
    return multer({
        storage: almacenamiento, // Usar la configuración de almacenamiento
        fileFilter: filtroArchivo, // Usar el filtro de archivos
        limits: { fileSize: 1024 * 1024 * 5 } // Límite de tamaño de archivo de 5MB
    })
}