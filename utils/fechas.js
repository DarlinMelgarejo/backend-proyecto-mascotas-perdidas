const  convertirTimestampAFecha = (timestamp) => {
    // Si el timestamp es de Firebase (con _seconds y _nanoseconds)
    if (timestamp._seconds && timestamp._nanoseconds) {
        const fecha = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
        return formatearFecha(fecha);
    }
    
    // Si el timestamp es de MySQL (en formato "YYYY-MM-DD HH:MM:SS")
    if (typeof timestamp === 'string' && timestamp.match(/^\d{4}-\d{2}-\d{2}/)) {
        const fecha = new Date(timestamp);
        return formatearFecha(fecha);
    }
  
    // Si el tipo de timestamp no es válido
    throw new Error('Formato de timestamp no válido');
}
  
  // Función para formatear la fecha en "DD/MM/YYYY"
const formatearFecha = (fecha) => {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JS van de 0 a 11
    const año = fecha.getFullYear();
  
    return `${dia}/${mes}/${año}`;
}
  