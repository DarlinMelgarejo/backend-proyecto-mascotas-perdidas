import fs from 'node:fs';
import path from 'node:path';

/**
 * Función para eliminar un archivo de imagen.
 * @param {string} ruta - La ruta del archivo a eliminar.
 * @param {string} nombre - El nombre del archivo a eliminar.
 */
export const eliminarImagen = (ruta, nombre) => {
    const rutaCompleta = path.join(ruta, nombre);
    console.log(rutaCompleta)
    fs.unlink(rutaCompleta, (err) => {
        if (err) {
            console.error('Error al eliminar el archivo:', err);
        } else {
            console.log('Se elimino exitosamente la imagen en la ruta: ' + ruta)
        }
    });
};
