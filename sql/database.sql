CREATE DATABASE bd_mascotas;

USE bd_mascotas;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    dni VARCHAR(8) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    nombres VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(9) NOT NULL UNIQUE,
    procedencia ENUM('San Pedro de Lloc', 'Pacasmayo') NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    url_foto VARCHAR(255) DEFAULT 'default.jpg',
    codigo_verificacion VARCHAR(6),
    expiracion_codigo DATETIME,
    estado BOOLEAN DEFAULT TRUE,  -- Eliminación lógica
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de reportes de mascotas
CREATE TABLE reportes_mascotas (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    fecha_reporte DATE NOT NULL,  -- Fecha de la pérdida/encontrada
    nombre_mascota VARCHAR(100) NOT NULL,
    especie_mascota ENUM('Perro', 'Gato', 'Otro') NOT NULL,  -- Especie de la mascota
    raza_mascota VARCHAR(100) NOT NULL,
    color_mascota VARCHAR(30) NOT NULL,
    sexo_mascota ENUM('Macho', 'Hembra', 'Desconocido') NOT NULL,
    edad_mascota VARCHAR(30) NOT NULL,
    descripcion_mascota TEXT NOT NULL,
    url_foto_mascota VARCHAR(20) NOT NULL,
    estado_mascota ENUM('Perdido', 'Encontrado') NOT NULL,  -- Estado: Perdida o encontrada
    procedencia_mascota ENUM('San Pedro de Lloc', 'Pacasmayo') NOT NULL,
    ubicacion_mascota VARCHAR(255) NOT NULL,  -- Ubicación donde se encontró
    latitud_ubicacion DOUBLE NOT NULL, 
    longitud_ubicacion DOUBLE NOT NULL,
    usuario_id VARCHAR(36) NOT NULL,  -- Usuario que reportó la mascota
    estado_reporte ENUM('Activo', 'Resuelto') DEFAULT 'Activo',  -- Nuevo campo para el estado del reporte
    activo BOOLEAN DEFAULT TRUE,  -- Eliminación lógica
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resuelto_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE  -- Elimina los reportes cuando se elimina el usuario
);

-- Tabla de comentarios
CREATE TABLE comentarios (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    contenido TEXT NOT NULL,  -- Texto del comentario
    usuario_id VARCHAR(36) NOT NULL,  -- Usuario que comentó
    reporte_mascota_id VARCHAR(36) NOT NULL,  -- Mascota sobre la que se comentó
    reportado BOOLEAN DEFAULT FALSE,  -- Para marcar si fue reportado
    activo BOOLEAN DEFAULT TRUE,  -- Eliminación lógica
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,  -- Elimina los comentarios cuando se elimina el usuario
    FOREIGN KEY (reporte_mascota_id) REFERENCES reportes_mascotas(id) ON DELETE CASCADE  -- Elimina los comentarios cuando se elimina el reporte de la mascota
);