# Análisis y Plan de Trabajo — Portal de Solicitudes (Reclutamiento Externo)

## 1. Diagnóstico del Código Existente

### 1.1 Estructura del repositorio `galz35/solicitud`

```
solicitud/
├── backend/                  # API REST (Express + TypeScript)
│   └── src/
│       ├── config/database.ts        # Conexión SQL Server + fallback memoria
│       ├── controllers/
│       │   ├── auth.controller.ts     # Login por cédula → JWT
│       │   ├── candidato.controller.ts # CRUD completo candidato + sub-entidades
│       │   ├── busqueda.controller.ts  # Búsqueda (admin)
│       │   └── catalogo.controller.ts  # Catálogos (idiomas, niveles, etc)
│       ├── middleware/
│       │   ├── auth.middleware.ts      # JWT protect + restrictTo(admin)
│       │   └── validation.middleware.ts
│       ├── routes/api.routes.ts       # Todas las rutas
│       └── validators/                # Zod schemas de validación
├── frontend/                 # SPA (React + Vite + TypeScript)
│   └── src/
│       ├── features/auth/LoginPage.tsx     # Login con cédula
│       ├── features/solicitud/             # Wizard multi-step (datos personales)
│       ├── features/busqueda/              # Búsqueda admin
│       └── services/api.service.ts
├── database/                 # Esquema SQL Server
│   ├── schema/01_create_tables.sql         # 10 tablas (tbl_candidatos, ...)
│   ├── schema/02_create_constraints.sql
│   ├── schema/03_seed_catalogos.sql
│   ├── stored_procedures/                  # SPs CRUD
│   └── migration/migrate_from_legacy.sql
└── *.asp                     # Sistema ASP legado (referencia)
```

### 1.2 Base de datos: `Sol_Empleo` (host remoto `192.168.8.234`)

| Tabla | Relación | Contenido |
|-------|----------|-----------|
| `tbl_candidatos` | Raíz | Datos personales completos |
| `tbl_candidatos_salud_deportes` | 1:1 | Salud, alergias, deportes |
| `tbl_candidatos_puesto` | 1:1 | Puesto deseado, salario, experiencia resumen |
| `tbl_candidatos_emergencia` | 1:1 | Contacto emergencia |
| `tbl_datos_familiares` | 1:N | Familiares |
| `tbl_datos_academicos` | 1:N | Formación académica |
| `tbl_experiencia_profesional` | 1:N | Historial laboral |
| `tbl_referencias` | 1:N | Referencias personales/laborales |
| `tbl_idiomas` | Catálogo | Idiomas disponibles |
| `tbl_candidato_idiomas` | N:M | Nivel por idioma del candidato |

### 1.3 Backend existente: funcionalidades ✅

| Funcionalidad | Método | Ruta | Estado |
|--------------|--------|------|--------|
| Login (cédula) | `POST` | `/api/auth/login` | ✅ Hecho |
| CRUD candidato base | `POST` | `/api/candidatos` | ✅ Hecho |
| Obtener candidato completo | `GET` | `/api/candidatos/:cedula` | ✅ Hecho |
| CRUD familiares | `POST/DELETE` | `/api/candidatos/:cedula/familiares/` | ✅ Hecho |
| CRUD académicos | `POST/DELETE` | `/api/candidatos/:cedula/academicos/` | ✅ Hecho |
| CRUD experiencia | `POST/DELETE` | `/api/candidatos/:cedula/experiencia/` | ✅ Hecho |
| CRUD referencias | `POST/DELETE` | `/api/candidatos/:cedula/referencias/` | ✅ Hecho |
| CRUD idiomas | `POST/DELETE` | `/api/candidatos/:cedula/idiomas/` | ✅ Hecho |
| Búsqueda admin | `GET` | `/api/buscar` | ✅ Hecho |

### 1.4 Frontend existente: funcionalidades ✅

| Pantalla | Ruta React | Descripción |
|----------|-----------|-------------|
| Login | `/login` | Cédula → JWT → redirige a wizard |
| Wizard solicitud | `/solicitud` | Formulario multi-step (datos personales, salud, puesto, familiares, académicos, experiencia, referencias, idiomas) |
| Búsqueda (admin) | `/buscar` | Buscar candidatos por nombre/cedula/apellido |
| Impresión | `/impresion` | Vista imprimible de la solicitud |

---

## 2. Requerimientos del Usuario

1. **RRHH genera link único** de invitación → candidato lo abre y se registra
2. **Candidato se registra**: datos personales + cédula + correo + password (+ CV si aplica)
3. **Login por correo + cédula + password** (no solo cédula)
4. **Candidato que vuelve**: si ya tiene datos, entra con sus credenciales y ve/actualiza su perfil
5. **Empleados internos**: siguen usando el portal principal con las apps existentes (sin cambios)
6. **Candidatos externos**: solo ven el módulo de solicitud, no las apps internas

---

## 3. Plan de Integración con el Portal

### 3.1 Arquitectura Propuesta

```
┌─────────────────────────────────────────────────────────┐
│ rhclaroni.com (Nginx)                                   │
├─────────────────────────────────────────────────────────┤
│ /portal/           → Portal interno (empleados)         │
│ /solicitud/        → Solicitud externa (candidatos)     │
│ /api-solicitud/    → Backend solicitud (Express)        │
│ /api/              → Portal API (NestJS :3120)          │
└─────────────────────────────────────────────────────────┘
```

**Estrategia**: Mantener solicitud como sistema independiente (su propio backend + DB `Sol_Empleo`), pero integrar la experiencia del usuario:
- **Nuevo método de login**: email + password (además de cédula)
- **Link de invitación**: RRHH genera desde el portal admin un token JWT
- **Candidato** usa `/solicitud` sin ver el portal interno

### 3.2 Fase 1 — Backend solicitud: nuevos endpoints

| # | Tarea | Detalle |
|---|-------|---------|
| 1.1 | Agregar tabla `tbl_usuarios_candidatos` | `candidato_id, email, password_hash, token_invitacion, fecha_creacion, activo` |
| 1.2 | Nuevo endpoint `POST /api/auth/registro` | Recibe token_invitacion + email + password + datos base → crea `tbl_candidatos` + `tbl_usuarios_candidatos` |
| 1.3 | Modificar `POST /api/auth/login` | Aceptar `{ email, password }` además de `{ cedula }`. Busca en `tbl_usuarios_candidatos` + `tbl_candidatos` |
| 1.4 | Endpoint `GET /api/auth/validar-token/:token` | Verifica si el token de invitación es válido (no expirado, no usado) |
| 1.5 | Endpoint `POST /api/admin/invitacion` (protegido admin) | Genera token JWT expirable (7d) con `{ vacante_id, email_opcional }` |
| 1.6 | Modificar `guardarCandidato` | Si el candidato ya existe (misma cédula), hace UPDATE en vez de INSERT |
| 1.7 | Nuevo endpoint `GET /api/candidatos/me` | Retorna datos del candidato autenticado (sin pasar cédula en URL) |

### 3.3 Fase 2 — Frontend solicitud: nuevas pantallas

| # | Tarea | Detalle |
|---|-------|---------|
| 2.1 | Modificar LoginPage | Agregar toggle "Login por cédula" / "Login por email+password". Mantener ambas opciones |
| 2.2 | Nueva página `RegistroPage` | Accesible solo con `?token=xxx`. Formulario: email, password, confirmar password + wizard de datos personales (el existente) |
| 2.3 | Nuevo Dashboard `DashboardPage` | Vista post-login: mi perfil, mis datos, estado de postulación, link para editar |
| 2.4 | Adaptar `SolicitudWizard` | Si el candidato ya tiene datos, precargar y permitir **editar** (no solo crear) |
| 2.5 | Ajustar rutas React Router | `/login`, `/registro?token=`, `/solicitud` (wizard), `/dashboard` |

### 3.4 Fase 3 — Portal API: integración admin

| # | Tarea | Detalle |
|---|-------|---------|
| 3.1 | Agregar módulo `SolicitudAdminModule` | En portal-api-nest (`:3120`), endpoints protegidos para RRHH |
| 3.2 | Endpoint `POST /api/admin/solicitud/invitacion` | Genera link con token JWT (compartir secreto con backend solicitud) |
| 3.3 | Endpoint `GET /api/admin/solicitud/candidatos` | Lista candidatos con sus datos (joins entre PortalCore y Sol_Empleo si es posible, o proxy al backend solicitud) |

### 3.5 Fase 4 — Despliegue

| # | Tarea | Detalle |
|---|-------|---------|
| 4.1 | Ajustar DB config | Cambiar `192.168.8.234` → `localhost` (mismo VPS, SQL Server Docker) |
| 4.2 | Crear BD `Sol_Empleo` en SQL Server local | Ejecutar scripts del repo en el Docker `sql2022` |
| 4.3 | Configurar PM2 | Agregar `solicitud-api` en puerto (ej: `3036`) |
| 4.4 | Build frontend | `npm run build` y copiar a `/var/www/solicitud/` |
| 4.5 | Nginx snippet | `/solicitud/` → `/var/www/solicitud/`, `/api-solicitud/` → `:3036` |
| 4.6 | Registrar en BD portal | INSERT en `AplicacionSistema`: `('solicitud', 'Solicitud de Empleo', 'https://rhclaroni.com/solicitud', 'FileUser', 7)` |

---

## 4. Flujo Completo del Candidato

```
┌──────────┐   genera link    ┌────────────┐   email/whatsapp   ┌───────────┐
│  RRHH    │ ────────────────>│ Token JWT   │ ─────────────────>│ Candidato │
│ (portal) │                  │ (válido 7d) │                   │           │
└──────────┘                  └────────────┘                   └─────┬─────┘
                                                                     │
                                               Abre /solicitud/registro?token=xxx
                                                                     │
                                                              ┌──────▼──────┐
                                                              │ Registro    │
                                                              │ email+pass  │
                                                              │ + wizard    │
                                                              └──────┬──────┘
                                                                     │
                                                   Vuelve después con email+pass
                                                                     │
                                                              ┌──────▼──────┐
                                                              │ /solicitud/ │
                                                              │  dashboard  │
                                                              └─────────────┘
```

---

## 5. Seguridad

| Aspecto | Solución |
|---------|----------|
| Token invitación | JWT firmado con secreto compartido, expira 7d, vinculado a vacante |
| Passwords | bcrypt hash (mismo que portal existente) |
| Sesión | JWT (Express backend), middleware `protect` ya existe |
| CORS | Configurar para `rhclaroni.com` |
| Rate limiting | Agregar a `login` y `registro` (evitar brute force) |
| Cédula única | Validar al guardar que no exista duplicada (el SP ya maneja INSERT/UPDATE) |

---

## 6. Pendientes / Decisiones

1. **¿BD local o remota?** — `192.168.8.234` no es accesible desde este VPS. Migrar `Sol_Empleo` al SQL Server Docker local.
2. **¿La app es solo para candidatos externos o también internos pueden postularse?** — Definir si los empleados internos también pueden ver vacantes y aplicar.
3. **¿Portal admin para RRHH o backend propio?** — Recomiendo agregar los endpoints admin en el portal API existente (`:3120`) porque RRHH ya está ahí.
4. **Login cédula vs email** — Mantener ambos: cédula para candidatos legacy, email+pass para nuevos registrados.

---

¿Procedo con la **Fase 1** (backend solicitud: tabla usuarios + nuevos endpoints)?
