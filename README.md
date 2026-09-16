# Ficha Registro Conductores — Dasai Logística 🚛

Aplicación web moderna desarrollada para reemplazar la ficha PDF de registro de conductores y transportistas para **Dasai**, con captura integral de datos personales, bancarios, documentación vehicular y societaria, validación estricta de RUT chileno (Módulo 11), consentimiento de protección de datos conforme a la **Ley 21.719**, firma digital manuscrita en canvas y persistencia en Supabase (DB + Storage).

---

## ✨ Características Principales

1. **Formulario Multi-paso (Wizard) Dinámico**:
   - **Paso 1:** Datos Personales (Nombre, RUT validado con DV, Dirección, Comunas de Chile, Teléfono `+56 9`, Email, Estado Civil, Estudios).
   - **Paso 2:** Datos de Transferencia (Catálogo de Bancos de Chile, Tipo de cuenta, Número de cuenta).
   - **Paso 3:** Documentación Personal del Conductor (Hoja de vida, Licencia anverso/reverso, Carnet anverso/reverso, Certificado de antecedentes).
   - **Paso 4:** Documentación del Vehículo (Padrón, SOAP, Permiso de circulación, Revisión técnica, Certificado de gases, GPS, Seguro).
   - **Paso 5:** Acreditación de Empresa (Toggle condicional: Estatutos, Vigencia, E-RUT, Carpeta Tributaria o Nota informativa de comodato notarial con adjunto opcional).
   - **Paso 6:** Consentimiento Ley 21.719 (Checkbox legal obligatorio) y Firma Digital manuscrita en Canvas HTML5.

2. **Carga Segura de Archivos**:
   - Drag-and-drop con previsualización en tiempo real para PDFs e imágenes (JPG, PNG, WEBP).
   - Límite de 10MB por documento con validación estricta.

3. **Resguardo de Borrador Local**:
   - Guardado automático en `localStorage` para no perder el progreso si se cierra el navegador.

4. **Panel Administrativo Integrado (`/admin`)**:
   - Búsqueda en tiempo real por RUT, nombre o comuna.
   - Filtros por estado (*Pendiente*, *Aprobado*, *Rechazado*, *Observado*).
   - Visor integrado de documentos adjuntos y firma digital.
   - Dictamen administrativo con notas internas y exportación de datos a formato CSV/Excel.

5. **Modo Híbrido**:
   - Funciona de inmediato en modo local/desarrollo (mock store).
   - Conexión directa a Supabase con RLS y Storage para producción.

---

## 🚀 Inicio Rápido

### 1. Instalación de dependencias
```bash
npm install
```

### 2. Ejecución en desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 3. Configuración de Supabase (Producción)
1. Crea un proyecto en [Supabase](https://supabase.com).
2. Ve al **SQL Editor** de Supabase y ejecuta el script ubicado en [`supabase/schema.sql`](supabase/schema.sql).
3. Copia el archivo `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Asigna las variables con tus credenciales de Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
   SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
   ```

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript.
- **Estilos:** TailwindCSS, Lucide Icons.
- **Formularios & Validación:** React Hook Form, Zod.
- **Backend & Storage:** Supabase (PostgreSQL, Storage Buckets, Row Level Security).
- **Firma Digital:** Canvas API HTML5 con soporte táctil y alta resolución.
