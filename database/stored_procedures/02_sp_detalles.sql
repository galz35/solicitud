-- ================================================================================
-- PROCEDIMIENTOS ALMACENADOS: SUB-ENTIDADES DEL CANDIDATO
-- Sistema: Solicitud de Empleo
-- DBMS: SQL Server
-- Fecha: 08/06/2026
-- ================================================================================

USE Sol_Empleo;
GO

-- ==========================================
-- 1. DATOS FAMILIARES
-- ==========================================
CREATE OR ALTER PROCEDURE sp_GuardarFamiliar (
    @id_df INT = NULL OUTPUT,
    @candidato_id INT,
    @nombre VARCHAR(100),
    @parentesco VARCHAR(50),
    @l_trabajo VARCHAR(100) = NULL,
    @direccion VARCHAR(255) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @id_df IS NOT NULL AND EXISTS (SELECT 1 FROM tbl_datos_familiares WHERE id_df = @id_df)
    BEGIN
        UPDATE tbl_datos_familiares
        SET nombre = @nombre,
            parentesco = @parentesco,
            l_trabajo = @l_trabajo,
            direccion = @direccion
        WHERE id_df = @id_df;
    END
    ELSE
    BEGIN
        INSERT INTO tbl_datos_familiares (candidato_id, nombre, parentesco, l_trabajo, direccion)
        VALUES (@candidato_id, @nombre, @parentesco, @l_trabajo, @direccion);
        
        SET @id_df = SCOPE_IDENTITY();
    END
END;
GO

CREATE OR ALTER PROCEDURE sp_EliminarFamiliar (
    @id_df INT
)
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM tbl_datos_familiares WHERE id_df = @id_df;
END;
GO


-- ==========================================
-- 2. DATOS ACADÉMICOS
-- ==========================================
CREATE OR ALTER PROCEDURE sp_GuardarAcademico (
    @id_da INT = NULL OUTPUT,
    @candidato_id INT,
    @nivel_academico VARCHAR(2),
    @titulo VARCHAR(150),
    @estado VARCHAR(50),
    @ult_ano_aprob INT = NULL,
    @institucion VARCHAR(150),
    @duracion VARCHAR(50) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @id_da IS NOT NULL AND EXISTS (SELECT 1 FROM tbl_datos_academicos WHERE id_da = @id_da)
    BEGIN
        UPDATE tbl_datos_academicos
        SET nivel_academico = @nivel_academico,
            titulo = @titulo,
            estado = @estado,
            ult_ano_aprob = @ult_ano_aprob,
            institucion = @institucion,
            duracion = @duracion
        WHERE id_da = @id_da;
    END
    ELSE
    BEGIN
        INSERT INTO tbl_datos_academicos (candidato_id, nivel_academico, titulo, estado, ult_ano_aprob, institucion, duracion)
        VALUES (@candidato_id, @nivel_academico, @titulo, @estado, @ult_ano_aprob, @institucion, @duracion);
        
        SET @id_da = SCOPE_IDENTITY();
    END
END;
GO

CREATE OR ALTER PROCEDURE sp_EliminarAcademico (
    @id_da INT
)
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM tbl_datos_academicos WHERE id_da = @id_da;
END;
GO


-- ==========================================
-- 3. EXPERIENCIA PROFESIONAL
-- ==========================================
CREATE OR ALTER PROCEDURE sp_GuardarExperiencia (
    @id_ep INT = NULL OUTPUT,
    @candidato_id INT,
    @empresa VARCHAR(100),
    @giro VARCHAR(100) = NULL,
    @cargo VARCHAR(100),
    @jefe_inmediato VARCHAR(100) = NULL,
    @f_ingreso DATE = NULL,
    @f_salida DATE = NULL,
    @motivo_salida VARCHAR(255) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @id_ep IS NOT NULL AND EXISTS (SELECT 1 FROM tbl_experiencia_profesional WHERE id_ep = @id_ep)
    BEGIN
        UPDATE tbl_experiencia_profesional
        SET empresa = @empresa,
            giro = @giro,
            cargo = @cargo,
            jefe_inmediato = @jefe_inmediato,
            f_ingreso = @f_ingreso,
            f_salida = @f_salida,
            motivo_salida = @motivo_salida
        WHERE id_ep = @id_ep;
    END
    ELSE
    BEGIN
        INSERT INTO tbl_experiencia_profesional (candidato_id, empresa, giro, cargo, jefe_inmediato, f_ingreso, f_salida, motivo_salida)
        VALUES (@candidato_id, @empresa, @giro, @cargo, @jefe_inmediato, @f_ingreso, @f_salida, @motivo_salida);
        
        SET @id_ep = SCOPE_IDENTITY();
    END
END;
GO

CREATE OR ALTER PROCEDURE sp_EliminarExperiencia (
    @id_ep INT
)
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM tbl_experiencia_profesional WHERE id_ep = @id_ep;
END;
GO


-- ==========================================
-- 4. REFERENCIAS
-- ==========================================
CREATE OR ALTER PROCEDURE sp_GuardarReferencia (
    @id_ref INT = NULL OUTPUT,
    @candidato_id INT,
    @nombre_completo VARCHAR(100),
    @direccion VARCHAR(255) = NULL,
    @empresa VARCHAR(100) = NULL,
    @edad INT = NULL,
    @telefono VARCHAR(20) = NULL,
    @tipo_relacion VARCHAR(50),
    @interno CHAR(1) = 'N'
)
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @id_ref IS NOT NULL AND EXISTS (SELECT 1 FROM tbl_referencias WHERE id_ref = @id_ref)
    BEGIN
        UPDATE tbl_referencias
        SET nombre_completo = @nombre_completo,
            direccion = @direccion,
            empresa = @empresa,
            edad = @edad,
            telefono = @telefono,
            tipo_relacion = @tipo_relacion,
            interno = @interno
        WHERE id_ref = @id_ref;
    END
    ELSE
    BEGIN
        INSERT INTO tbl_referencias (candidato_id, nombre_completo, direccion, empresa, edad, telefono, tipo_relacion, interno)
        VALUES (@candidato_id, @nombre_completo, @direccion, @empresa, @edad, @telefono, @tipo_relacion, @interno);
        
        SET @id_ref = SCOPE_IDENTITY();
    END
END;
GO

CREATE OR ALTER PROCEDURE sp_EliminarReferencia (
    @id_ref INT
)
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM tbl_referencias WHERE id_ref = @id_ref;
END;
GO


-- ==========================================
-- 5. IDIOMAS DEL CANDIDATO
-- ==========================================
CREATE OR ALTER PROCEDURE sp_GuardarCandidatoIdioma (
    @candidato_id INT,
    @cod_idioma INT,
    @n_lectura INT,
    @n_escritura INT,
    @n_conversacion INT
)
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (SELECT 1 FROM tbl_candidato_idiomas WHERE candidato_id = @candidato_id AND cod_idioma = @cod_idioma)
    BEGIN
        UPDATE tbl_candidato_idiomas
        SET n_lectura = @n_lectura,
            n_escritura = @n_escritura,
            n_conversacion = @n_conversacion
        WHERE candidato_id = @candidato_id AND cod_idioma = @cod_idioma;
    END
    ELSE
    BEGIN
        INSERT INTO tbl_candidato_idiomas (candidato_id, cod_idioma, n_lectura, n_escritura, n_conversacion)
        VALUES (@candidato_id, @cod_idioma, @n_lectura, @n_escritura, @n_conversacion);
    END
END;
GO

CREATE OR ALTER PROCEDURE sp_EliminarCandidatoIdioma (
    @candidato_id INT,
    @cod_idioma INT
)
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM tbl_candidato_idiomas WHERE candidato_id = @candidato_id AND cod_idioma = @cod_idioma;
END;
GO
