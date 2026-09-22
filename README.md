# GastoApp 📱💰

Aplicación móvil desarrollada en **React Native con Expo** y **TypeScript** para el registro y control de gastos personales, con persistencia en **Supabase** y gestión de estado con **Redux Toolkit**.

---

## 🚀 Características

- **Pantalla Única Intuitiva**:
  - **Registro de Gastos**: Formulario interactivo con descripción, monto numérico y selector de categorías con iconos representativos.
  - **Historial Completo**: Listado de todos los gastos registrados en tiempo real.
  - **Eliminación Segura**: Botón para eliminar gastos con confirmación y estado de carga individual.
  - **Resumen Financiero**: Tarjeta con gasto total acumulado, cantidad de registros y promedio por gasto.
  - **Filtros por Categoría**: Chips interactivos para filtrar rápidamente por categoría (Alimentación, Transporte, Vivienda, Servicios, Entretenimiento, Salud, Educación, Otros).
  - **Pull to Refresh**: Desliza hacia abajo para refrescar los datos desde Supabase.
- **Gestión de Estado**:
  - Implementado con **Redux Toolkit** (`@reduxjs/toolkit` y `react-redux`).
  - Async Thunks para operaciones asíncronas (`fetchExpenses`, `addExpense`, `deleteExpense`).
- **Persistencia en la Nube**:
  - Conexión con **Supabase** mediante `@supabase/supabase-js` y `react-native-url-polyfill`.
  - Variables de entorno seguras con prefijo `EXPO_PUBLIC_` protegidas en `.gitignore`.

---

## 🗄️ Estructura de la Base de Datos (Supabase)

La tabla `expenses` en Supabase cuenta con la siguiente estructura:

| Columna | Tipo | Restricción / Por Defecto |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, `DEFAULT gen_random_uuid()` |
| `description` | `text` | `NOT NULL` |
| `amount` | `numeric` | `NOT NULL` |
| `category` | `text` | `NOT NULL` |
| `created_at` | `timestamptz` | `DEFAULT now()` |

El script SQL de creación y configuración de políticas RLS se encuentra en [`supabase/schema.sql`](./supabase/schema.sql).

---

## ⚙️ Configuración del Entorno

1. Copia o verifica el archivo `.env` en la raíz del proyecto:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://aywlnrcadaagraiijikr.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
2. El archivo `.env` está excluido del control de versiones mediante `.gitignore`.

---

## 📦 Ejecución del Proyecto

Instalar dependencias (si es necesario):
```bash
npm install
```

Iniciar el servidor de desarrollo de Expo:
```bash
npx expo start
```

Opciones de ejecución:
- Presiona **`a`** para abrir en un emulador Android o dispositivo conectado.
- Presiona **`w`** para abrir en el navegador web.
- Escanea el código QR con la app **Expo Go** en tu dispositivo móvil (Android / iOS).
