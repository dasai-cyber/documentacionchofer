-- =========================================================
-- ESQUEMA SUPABASE: FICHA REGISTRO CONDUCTORES DASAI
-- =========================================================

-- 1. Crear tabla 'conductores'
CREATE TABLE IF NOT EXISTS public.conductores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Sección 1: Datos Personales
    nombre_completo TEXT NOT NULL,
    rut TEXT NOT NULL,
    direccion TEXT NOT NULL,
    comuna TEXT NOT NULL,
    telefono_principal TEXT NOT NULL,
    telefono_secundario TEXT,
    email TEXT NOT NULL,
    estado_civil TEXT NOT NULL,
    estudios_alcanzados TEXT NOT NULL,
    
    -- Sección 2: Datos Bancarios
    banco TEXT NOT NULL,
    tipo_cuenta TEXT NOT NULL,
    numero_cuenta TEXT NOT NULL,
    
    -- Sección 3: Documentos Conductor (URLs de Supabase Storage)
    cert_hoja_vida TEXT NOT NULL,
    licencia_anverso TEXT NOT NULL,
    licencia_reverso TEXT NOT NULL,
    carnet_anverso TEXT NOT NULL,
    carnet_reverso TEXT NOT NULL,
    cert_antecedentes TEXT NOT NULL,
    
    -- Sección 4: Documentos Vehículo
    padron TEXT NOT NULL,
    soap TEXT NOT NULL,
    permiso_circulacion TEXT NOT NULL,
    revision_tecnica TEXT NOT NULL,
    cert_gases TEXT NOT NULL,
    tiene_gps BOOLEAN NOT NULL DEFAULT FALSE,
    tiene_seguro BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Sección 5: Empresa (Condicional)
    registra_empresa BOOLEAN NOT NULL DEFAULT FALSE,
    estatuto_actualizado TEXT,
    vigencia_actualizada TEXT,
    e_rut TEXT,
    carpeta_tributaria TEXT,
    comodato_notarial TEXT,
    
    -- Sección 6: Consentimiento y Firma
    consentimiento_ley_21719 BOOLEAN NOT NULL DEFAULT TRUE,
    firma_digital TEXT NOT NULL,
    
    -- Enlace a carpeta de Google Drive (si está habilitado)
    google_drive_folder TEXT,
    
    -- Estado de la postulación
    estado TEXT NOT NULL DEFAULT 'pendiente_revision' CHECK (estado IN ('pendiente_revision', 'aprobado', 'rechazado', 'observado')),
    observaciones_admin TEXT
);

-- Índices de búsqueda
CREATE INDEX IF NOT EXISTS idx_conductores_rut ON public.conductores(rut);
CREATE INDEX IF NOT EXISTS idx_conductores_email ON public.conductores(email);
CREATE INDEX IF NOT EXISTS idx_conductores_estado ON public.conductores(estado);
CREATE INDEX IF NOT EXISTS idx_conductores_created_at ON public.conductores(created_at DESC);

-- 2. Configuración de Storage
-- Crear bucket público 'adjuntos-conductores' (o privado con signed URLs)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('adjuntos-conductores', 'adjuntos-conductores', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Políticas de Seguridad RLS (Row Level Security)
ALTER TABLE public.conductores ENABLE ROW LEVEL SECURITY;

-- Permitir inserción anónima desde el formulario web
CREATE POLICY "Permitir insercion publica de conductores" 
ON public.conductores FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Permitir lectura y actualización a usuarios autenticados / service_role (Panel Admin)
CREATE POLICY "Permitir lectura y gestion a administradores" 
ON public.conductores FOR ALL 
TO service_role, authenticated
USING (true)
WITH CHECK (true);

-- Políticas de Storage
CREATE POLICY "Permitir upload publico de documentos de conductores"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'adjuntos-conductores');

CREATE POLICY "Permitir lectura de documentos de conductores"
ON storage.objects FOR SELECT
TO anon, authenticated, service_role
USING (bucket_id = 'adjuntos-conductores');
