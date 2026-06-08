-- ================================================================================
-- SCRIPT DE INSERCIÓN DE DATOS INICIALES (SEED) - CATÁLOGOS
-- Sistema: Solicitud de Empleo
-- DBMS: SQL Server
-- Fecha: 08/06/2026
-- ================================================================================

USE Sol_Empleo;
GO

-- 1. POBLAR CATÁLOGO DE IDIOMAS
-- Validar si existen previamente para evitar duplicados en re-ejecuciones
IF NOT EXISTS (SELECT 1 FROM tbl_idiomas WHERE descripcion = 'Español')
    INSERT INTO tbl_idiomas (descripcion) VALUES ('Español');

IF NOT EXISTS (SELECT 1 FROM tbl_idiomas WHERE descripcion = 'Inglés')
    INSERT INTO tbl_idiomas (descripcion) VALUES ('Inglés');

IF NOT EXISTS (SELECT 1 FROM tbl_idiomas WHERE descripcion = 'Francés')
    INSERT INTO tbl_idiomas (descripcion) VALUES ('Francés');

IF NOT EXISTS (SELECT 1 FROM tbl_idiomas WHERE descripcion = 'Alemán')
    INSERT INTO tbl_idiomas (descripcion) VALUES ('Alemán');

IF NOT EXISTS (SELECT 1 FROM tbl_idiomas WHERE descripcion = 'Mandarín')
    INSERT INTO tbl_idiomas (descripcion) VALUES ('Mandarín');

IF NOT EXISTS (SELECT 1 FROM tbl_idiomas WHERE descripcion = 'Italiano')
    INSERT INTO tbl_idiomas (descripcion) VALUES ('Italiano');

IF NOT EXISTS (SELECT 1 FROM tbl_idiomas WHERE descripcion = 'Portugués')
    INSERT INTO tbl_idiomas (descripcion) VALUES ('Portugués');

IF NOT EXISTS (SELECT 1 FROM tbl_idiomas WHERE descripcion = 'Japonés')
    INSERT INTO tbl_idiomas (descripcion) VALUES ('Japonés');

GO

-- Imprimir confirmación
SELECT * FROM tbl_idiomas;
GO
