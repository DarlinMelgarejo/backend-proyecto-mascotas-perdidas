import dotenv from "dotenv"
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore"

// Cargar las variables de entorno
dotenv.config()

initializeApp({
    credential: applicationDefault()
})

export const db = getFirestore()