import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

// Crear el pool de conexiones
export const pool = mysql.createPool({
    host: process.env.DB_HOST_DEV,
    user: process.env.BD_USERNAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    database: process.env.DB_DATABASE_DEV,
    port: process.env.BD_PORT_DEV,
    waitForConnections: true,  // Esperar cuando no hay conexiones disponibles
    connectionLimit: 10,  // Máximo de conexiones simultáneas
    queueLimit: 0  // Sin límite en la cola de conexiones
})

// Función asincrónica para obtener la conexión
const testConexion = async () => {
    try {
        // Intentamos obtener una conexión
        const connection = await pool.getConnection()
        console.log('Conexión exitosa a la base de datos MySQL local')
        connection.release() // Liberamos la conexión
    } catch (error) {
        console.error('Error de conexión:', error.message)
    }
}

testConexion()
