-- ================================================================================
-- SCRIPT DE CREACIÓN DE TABLAS - BASE DE DATOS MODERNIZADA
-- Sistema: Solicitud de Empleo
-- DBMS: SQL Server
-- Fecha: 08/06/2026
-- ================================================================================

USE Sol_Empleo;
GO

-- 1. TABLA PRINCIPAL DE CANDIDATOS
CREATE TABLE tbl_candidatos (
    candidato_id INT IDENTITY(1,1) PRIMARY KEY,
    cedula VARCHAR(20) NOT NULL,
    pnombre VARCHAR(50) NOT NULL,
    snombre VARCHAR(50) NULL,
    papellido VARCHAR(50) NOT NULL,
    sapellido VARCHAR(50) NULL,
    fecha_nac DATE NOT NULL,
    lugar_nac VARCHAR(100) NULL,
    nacionalidad VARCHAR(50) NOT NULL,
    inss VARCHAR(20) NULL,
    ruc VARCHAR(20) NULL,
    estatura DECIMAL(5,2) NULL, -- en metros (ej. 1.75)
    peso DECIMAL(5,2) NULL,     -- en kg o libras (ej. 70.50)
    licencia CHAR(1) NOT NULL DEFAULT 'N',     -- 'S' / 'N'
    cat_licencia VARCHAR(20) NULL,
    vehiculo CHAR(1) NOT NULL DEFAULT 'N',     -- 'S' / 'N'
    marca VARCHAR(50) NULL,
    ano_vehic INT NULL,
    celular VARCHAR(20) NULL,
    telefono_dom VARCHAR(20) NULL,
    departamento_dom VARCHAR(50) NULL,
    ciudad_dom VARCHAR(50) NULL,
    direccion_dom VARCHAR(255) NULL,
    tipo_casa VARCHAR(50) NULL,
    cuenta_banco CHAR(1) NOT NULL DEFAULT 'N', -- 'S' / 'N'
    banco VARCHAR(50) NULL,
    no_cuenta VARCHAR(50) NULL,
    pasaporte VARCHAR(30) NULL,
    e_civil CHAR(1) NOT NULL,                  -- 'S' (Soltero), 'C' (Casado), 'V' (Viudo), 'D' (Divorciado), 'A' (Acompañado)
    fecha_sol DATETIME NOT NULL DEFAULT GETDATE(),
    activo BIT NOT NULL DEFAULT 1
);
GO

-- 2. TABLA DE DATOS DE SALUD Y DEPORTES (Relación 1:1 con Candidato)
CREATE TABLE tbl_candidatos_salud_deportes (
    candidato_id INT PRIMARY KEY,
    penfermedad CHAR(1) NOT NULL DEFAULT 'N', -- 'S' / 'N'
    enfermedad VARCHAR(255) NULL,
    palergia CHAR(1) NOT NULL DEFAULT 'N',     -- 'S' / 'N'
    alergia VARCHAR(255) NULL,
    tsangre VARCHAR(10) NULL,
    p_deporte VARCHAR(255) NULL,
    t_tarjeta CHAR(1) NOT NULL DEFAULT 'N'     -- 'S' / 'N'
);
GO

-- 3. TABLA DE PUESTO SOLICITADO Y EXPERIENCIA RESUMIDA (Relación 1:1 con Candidato)
CREATE TABLE tbl_candidatos_puesto (
    candidato_id INT PRIMARY KEY,
    puesto VARCHAR(100) NOT NULL,
    salario_max DECIMAL(12,2) NULL,
    salario_min DECIMAL(12,2) NULL,
    turno VARCHAR(50) NULL,
    obs_horario VARCHAR(255) NULL,
    experiencia VARCHAR(MAX) NULL -- Resumen general de experiencia del candidato
);
GO

-- 4. TABLA DE CONTACTO DE EMERGENCIA (Relación 1:1 con Candidato)
CREATE TABLE tbl_candidatos_emergencia (
    candidato_id INT PRIMARY KEY,
    contacto_emer VARCHAR(100) NOT NULL,
    parentesco_cont VARCHAR(50) NOT NULL,
    tel_contacto VARCHAR(20) NOT NULL
);
GO

-- 5. TABLA DE DATOS FAMILIARES (Relación 1:N con Candidato)
CREATE TABLE tbl_datos_familiares (
    id_df INT IDENTITY(1,1) PRIMARY KEY,
    candidato_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    parentesco VARCHAR(50) NOT NULL,
    l_trabajo VARCHAR(100) NULL,
    direccion VARCHAR(255) NULL
);
GO

-- 6. TABLA DE DATOS ACADÉMICOS (Relación 1:N con Candidato)
CREATE TABLE tbl_datos_academicos (
    id_da INT IDENTITY(1,1) PRIMARY KEY,
    candidato_id INT NOT NULL,
    nivel_academico VARCHAR(2) NOT NULL, -- 'P' (Primaria), 'S' (Secundaria), 'T' (Técnico), 'U' (Universidad), 'Pg' (Postgrado), 'M' (Maestría), 'D' (Doctorado)
    titulo VARCHAR(150) NOT NULL,
    estado VARCHAR(50) NOT NULL,         -- 'Graduado', 'Cursando', 'Incompleto'
    ult_ano_aprob INT NULL,
    institucion VARCHAR(150) NOT NULL,
    duracion VARCHAR(50) NULL
);
GO

-- 7. TABLA DE EXPERIENCIA PROFESIONAL DETALLADA (Relación 1:N con Candidato)
CREATE TABLE tbl_experiencia_profesional (
    id_ep INT IDENTITY(1,1) PRIMARY KEY,
    candidato_id INT NOT NULL,
    empresa VARCHAR(100) NOT NULL,
    giro VARCHAR(100) NULL,
    cargo VARCHAR(100) NOT NULL,
    jefe_inmediato VARCHAR(100) NULL,
    f_ingreso DATE NULL,
    f_salida DATE NULL,
    motivo_salida VARCHAR(255) NULL
);
GO

-- 8. TABLA DE REFERENCIAS (Relación 1:N con Candidato)
CREATE TABLE tbl_referencias (
    id_ref INT IDENTITY(1,1) PRIMARY KEY,
    candidato_id INT NOT NULL,
    nombre_completo VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NULL,
    empresa VARCHAR(100) NULL,
    edad INT NULL,
    telefono VARCHAR(20) NULL,
    tipo_relacion VARCHAR(50) NOT NULL, -- 'Personal', 'Laboral'
    interno CHAR(1) NOT NULL DEFAULT 'N' -- 'S' (Interna), 'N' (Externa)
);
GO

-- 9. TABLA DE IDIOMAS (Catálogo)
CREATE TABLE tbl_idiomas (
    cod_idioma INT IDENTITY(1,1) PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL UNIQUE
);
GO

-- 10. TABLA INTERMEDIA CANDIDATO - IDIOMAS (Relación N:M)
CREATE TABLE tbl_candidato_idiomas (
    candidato_id INT NOT NULL,
    cod_idioma INT NOT NULL,
    n_lectura INT NOT NULL DEFAULT 0,     -- Porcentaje (0-100)
    n_escritura INT NOT NULL DEFAULT 0,   -- Porcentaje (0-100)
    n_conversacion INT NOT NULL DEFAULT 0 -- Porcentaje (0-100)
);
GO
