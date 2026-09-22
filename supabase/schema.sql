-- ==============================================================================
-- Creación de la tabla 'expenses' para GastoApp
-- Ejecuta este script en el SQL Editor de tu proyecto en Supabase Dashboard
-- ==============================================================================

-- 1. Crear la tabla de gastos con las columnas especificadas
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- 3. Crear políticas para permitir operaciones con la clave anónima (anon key)

-- Permitir lectura (SELECT)
CREATE POLICY "Permitir lectura publica de gastos" 
ON public.expenses 
FOR SELECT 
USING (true);

-- Permitir inserción (INSERT)
CREATE POLICY "Permitir insercion publica de gastos" 
ON public.expenses 
FOR INSERT 
WITH CHECK (true);

-- Permitir eliminación (DELETE)
CREATE POLICY "Permitir eliminacion publica de gastos" 
ON public.expenses 
FOR DELETE 
USING (true);

-- Permitir actualización (UPDATE)
CREATE POLICY "Permitir actualizacion publica de gastos" 
ON public.expenses 
FOR UPDATE 
USING (true);

-- 4. Índice para optimizar consultas por fecha
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON public.expenses (created_at DESC);
