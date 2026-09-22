// Importamos createClient para establecer la conexión con Supabase
import { createClient } from "@supabase/supabase-js";

// Obtenemos las credenciales configuradas mediante las variables de entorno de Expo
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validamos que ambas variables hayan sido configuradas antes de crear el cliente
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Faltan las variables de entorno de Supabase.");
}

// Creamos y exportamos el cliente que utilizaremos en la aplicación
export const supabase = createClient(supabaseUrl, supabaseAnonKey);