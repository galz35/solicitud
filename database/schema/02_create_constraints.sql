-- ================================================================================
-- SCRIPT DE CONSTRAINTS, LLAVES FORÁNEAS E ÍNDICES
-- Sistema: Solicitud de Empleo
-- DBMS: SQL Server
-- Fecha: 08/06/2026
-- ================================================================================

USE Sol_Empleo;
GO

-- 1. RESTRICCIONES DE INTEGRIDAD Y LLAVES ÚNICAS
-- Cédula única en candidatos
ALTER TABLE tbl_candidatos
ADD CONSTRAINT UQ_tbl_candidatos_cedula UNIQUE (cedula);
GO

-- 2. LLAVES FORÁNEAS (RELACIONES 1:1)
-- Salud y deportes
ALTER TABLE tbl_candidatos_salud_deportes
ADD CONSTRAINT FK_tbl_candidatos_salud_deportes_candidatos
FOREIGN KEY (candidato_id) REFERENCES tbl_candidatos(candidato_id)
ON DELETE CASCADE;
GO

-- Puesto solicitado
ALTER TABLE tbl_candidatos_puesto
ADD CONSTRAINT FK_tbl_candidatos_puesto_candidatos
FOREIGN KEY (candidato_id) REFERENCES tbl_candidatos(candidato_id)
ON DELETE CASCADE;
GO

-- Contacto de emergencia
ALTER TABLE tbl_candidatos_emergencia
ADD CONSTRAINT FK_tbl_candidatos_emergencia_candidatos
FOREIGN KEY (candidato_id) REFERENCES tbl_candidatos(candidato_id)
ON DELETE CASCADE;
GO


-- 3. LLAVES FORÁNEAS (RELACIONES 1:N)
-- Datos familiares
ALTER TABLE tbl_datos_familiares
ADD CONSTRAINT FK_tbl_datos_familiares_candidatos
FOREIGN KEY (candidato_id) REFERENCES tbl_candidatos(candidato_id)
ON DELETE CASCADE;
GO

-- Datos académicos
ALTER TABLE tbl_datos_academicos
ADD CONSTRAINT FK_tbl_datos_academicos_candidatos
FOREIGN KEY (candidato_id) REFERENCES tbl_candidatos(candidato_id)
ON DELETE CASCADE;
GO

-- Experiencia profesional
ALTER TABLE tbl_experiencia_profesional
ADD CONSTRAINT FK_tbl_experiencia_profesional_candidatos
FOREIGN KEY (candidato_id) REFERENCES tbl_candidatos(candidato_id)
ON DELETE CASCADE;
GO

-- Referencias
ALTER TABLE tbl_referencias
ADD CONSTRAINT FK_tbl_referencias_candidatos
FOREIGN KEY (candidato_id) REFERENCES tbl_candidatos(candidato_id)
ON DELETE CASCADE;
GO


-- 4. LLAVES FORÁNEAS Y LLAVE PRIMARIA (RELACIÓN N:M CANDIDATO-IDIOMAS)
ALTER TABLE tbl_candidato_idiomas
ADD CONSTRAINT PK_tbl_candidato_idiomas
PRIMARY KEY (candidato_id, cod_idioma);
GO

ALTER TABLE tbl_candidato_idiomas
ADD CONSTRAINT FK_tbl_candidato_idiomas_candidatos
FOREIGN KEY (candidato_id) REFERENCES tbl_candidatos(candidato_id)
ON DELETE CASCADE;
GO

ALTER TABLE tbl_candidato_idiomas
ADD CONSTRAINT FK_tbl_candidato_idiomas_idiomas
FOREIGN KEY (cod_idioma) REFERENCES tbl_idiomas(cod_idioma)
ON DELETE CASCADE;
GO


-- 5. RESTRICCIONES DE CHECK (VALIDACIÓN A NIVEL BASE DE DATOS)
-- Validar que porcentajes de idiomas estén entre 0 y 100
ALTER TABLE tbl_candidato_idiomas
ADD CONSTRAINT CK_tbl_candidato_idiomas_n_lectura CHECK (n_lectura BETWEEN 0 AND 100),
    CONSTRAINT CK_tbl_candidato_idiomas_n_escritura CHECK (n_escritura BETWEEN 0 AND 100),
    CONSTRAINT CK_tbl_candidato_idiomas_n_conversacion CHECK (n_conversacion BETWEEN 0 AND 100);
GO

-- Validar opciones de campos tipo bandera ('S' o 'N')
ALTER TABLE tbl_candidatos
ADD CONSTRAINT CK_tbl_candidatos_licencia CHECK (licencia IN ('S', 'N')),
    CONSTRAINT CK_tbl_candidatos_vehiculo CHECK (vehiculo IN ('S', 'N')),
    CONSTRAINT CK_tbl_candidatos_cuenta_banco CHECK (cuenta_banco IN ('S', 'N')),
    CONSTRAINT CK_tbl_candidatos_e_civil CHECK (e_civil IN ('S', 'C', 'V', 'D', 'A'));
GO

ALTER TABLE tbl_candidatos_salud_deportes
ADD CONSTRAINT CK_tbl_candidatos_salud_deportes_penfermedad CHECK (penfermedad IN ('S', 'N')),
    CONSTRAINT CK_tbl_candidatos_salud_deportes_palergia CHECK (palergia IN ('S', 'N')),
    CONSTRAINT CK_tbl_candidatos_salud_deportes_t_tarjeta CHECK (t_tarjeta IN ('S', 'N'));
GO

ALTER TABLE tbl_referencias
ADD CONSTRAINT CK_tbl_referencias_interno CHECK (interno IN ('S', 'N')),
    CONSTRAINT CK_tbl_referencias_tipo_relacion CHECK (tipo_relacion IN ('Personal', 'Laboral'));
GO

ALTER TABLE tbl_datos_academicos
ADD CONSTRAINT CK_tbl_datos_academicos_nivel CHECK (nivel_academico IN ('P', 'S', 'T', 'U', 'Pg', 'M', 'D')),
    CONSTRAINT CK_tbl_datos_academicos_estado CHECK (estado IN ('Graduado', 'Cursando', 'Incompleto'));
GO


-- 6. ÍNDICES NO AGRUPADOS PARA OPTIMIZAR BÚSQUEDAS
-- Índice para buscar candidato por cédula (la restricción UNIQUE ya crea un índice, pero lo explicitamos para el plan)
CREATE NONCLUSTERED INDEX IX_tbl_candidatos_cedula
ON tbl_candidatos(cedula);
GO

-- Índice para búsqueda de candidatos por nombre y apellido (buscar.asp / BuscarPage)
CREATE NONCLUSTERED INDEX IX_tbl_candidatos_nombre_completo
ON tbl_candidatos(pnombre, papellido)
INCLUDE (snombre, sapellido, celular, fecha_sol);
GO

-- Índices de llaves foráneas para optimizar JOINS comunes
CREATE NONCLUSTERED INDEX IX_tbl_datos_familiares_candidato_id ON tbl_datos_familiares(candidato_id);
CREATE NONCLUSTERED INDEX IX_tbl_datos_academicos_candidato_id ON tbl_datos_academicos(candidato_id);
CREATE NONCLUSTERED INDEX IX_tbl_experiencia_profesional_candidato_id ON tbl_experiencia_profesional(candidato_id);
CREATE NONCLUSTERED INDEX IX_tbl_referencias_candidato_id ON tbl_referencias(candidato_id);
CREATE NONCLUSTERED INDEX IX_tbl_candidato_idiomas_candidato_id ON tbl_candidato_idiomas(candidato_id);
GO
