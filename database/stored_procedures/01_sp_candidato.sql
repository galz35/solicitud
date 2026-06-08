-- ================================================================================
-- PROCEDIMIENTOS ALMACENADOS: CANDIDATO
-- Sistema: Solicitud de Empleo
-- DBMS: SQL Server
-- Fecha: 08/06/2026
-- ================================================================================

USE Sol_Empleo;
GO

-- 1. REGISTRAR O ACTUALIZAR CANDIDATO (TRANSACCIONAL - TABLAS 1:1)
CREATE OR ALTER PROCEDURE sp_GuardarCandidato (
    @candidato_id INT OUTPUT,
    @cedula VARCHAR(20),
    @pnombre VARCHAR(50),
    @snombre VARCHAR(50) = NULL,
    @papellido VARCHAR(50),
    @sapellido VARCHAR(50) = NULL,
    @fecha_nac DATE,
    @lugar_nac VARCHAR(100) = NULL,
    @nacionalidad VARCHAR(50),
    @inss VARCHAR(20) = NULL,
    @ruc VARCHAR(20) = NULL,
    @estatura DECIMAL(5,2) = NULL,
    @peso DECIMAL(5,2) = NULL,
    @licencia CHAR(1) = 'N',
    @cat_licencia VARCHAR(20) = NULL,
    @vehiculo CHAR(1) = 'N',
    @marca VARCHAR(50) = NULL,
    @ano_vehic INT = NULL,
    @celular VARCHAR(20) = NULL,
    @telefono_dom VARCHAR(20) = NULL,
    @departamento_dom VARCHAR(50) = NULL,
    @ciudad_dom VARCHAR(50) = NULL,
    @direccion_dom VARCHAR(255) = NULL,
    @tipo_casa VARCHAR(50) = NULL,
    @cuenta_banco CHAR(1) = 'N',
    @banco VARCHAR(50) = NULL,
    @no_cuenta VARCHAR(50) = NULL,
    @pasaporte VARCHAR(30) = NULL,
    @e_civil CHAR(1),
    
    -- Campos Salud y Deportes
    @penfermedad CHAR(1) = 'N',
    @enfermedad VARCHAR(255) = NULL,
    @palergia CHAR(1) = 'N',
    @alergia VARCHAR(255) = NULL,
    @tsangre VARCHAR(10) = NULL,
    @p_deporte VARCHAR(255) = NULL,
    @t_tarjeta CHAR(1) = 'N',
    
    -- Campos Puesto Solicitado
    @puesto VARCHAR(100),
    @salario_max DECIMAL(12,2) = NULL,
    @salario_min DECIMAL(12,2) = NULL,
    @turno VARCHAR(50) = NULL,
    @obs_horario VARCHAR(255) = NULL,
    @experiencia VARCHAR(MAX) = NULL,
    
    -- Campos Contacto Emergencia
    @contacto_emer VARCHAR(100),
    @parentesco_cont VARCHAR(50),
    @tel_contacto VARCHAR(20)
)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    BEGIN TRY
        
        -- Validar si el candidato ya existe por Cédula (para Insert vs Update)
        DECLARE @exist_id INT = NULL;
        SELECT @exist_id = candidato_id FROM tbl_candidatos WHERE cedula = @cedula;
        
        IF @exist_id IS NOT NULL
        BEGIN
            -- UPDATE CANDIDATO
            UPDATE tbl_candidatos
            SET pnombre = @pnombre,
                snombre = @snombre,
                papellido = @papellido,
                sapellido = @sapellido,
                fecha_nac = @fecha_nac,
                lugar_nac = @lugar_nac,
                nacionalidad = @nacionalidad,
                inss = @inss,
                ruc = @ruc,
                estatura = @estatura,
                peso = @peso,
                licencia = @licencia,
                cat_licencia = @cat_licencia,
                vehiculo = @vehiculo,
                marca = @marca,
                ano_vehic = @ano_vehic,
                celular = @celular,
                telefono_dom = @telefono_dom,
                departamento_dom = @departamento_dom,
                ciudad_dom = @ciudad_dom,
                direccion_dom = @direccion_dom,
                tipo_casa = @tipo_casa,
                cuenta_banco = @cuenta_banco,
                banco = @banco,
                no_cuenta = @no_cuenta,
                pasaporte = @pasaporte,
                e_civil = @e_civil
            WHERE candidato_id = @exist_id;
            
            SET @candidato_id = @exist_id;
        END
        ELSE
        BEGIN
            -- INSERT CANDIDATO
            INSERT INTO tbl_candidatos (
                cedula, pnombre, snombre, papellido, sapellido, fecha_nac, lugar_nac,
                nacionalidad, inss, ruc, estatura, peso, licencia, cat_licencia,
                vehiculo, marca, ano_vehic, celular, telefono_dom, departamento_dom,
                ciudad_dom, direccion_dom, tipo_casa, cuenta_banco, banco, no_cuenta,
                pasaporte, e_civil
            ) VALUES (
                @cedula, @pnombre, @snombre, @papellido, @sapellido, @fecha_nac, @lugar_nac,
                @nacionalidad, @inss, @ruc, @estatura, @peso, @licencia, @cat_licencia,
                @vehiculo, @marca, @ano_vehic, @celular, @telefono_dom, @departamento_dom,
                @ciudad_dom, @direccion_dom, @tipo_casa, @cuenta_banco, @banco, @no_cuenta,
                @pasaporte, @e_civil
            );
            
            SET @candidato_id = SCOPE_IDENTITY();
        END
        
        -- Guardar/Actualizar Salud y Deportes
        IF EXISTS (SELECT 1 FROM tbl_candidatos_salud_deportes WHERE candidato_id = @candidato_id)
        BEGIN
            UPDATE tbl_candidatos_salud_deportes
            SET penfermedad = @penfermedad,
                enfermedad = @enfermedad,
                palergia = @palergia,
                alergia = @alergia,
                tsangre = @tsangre,
                p_deporte = @p_deporte,
                t_tarjeta = @t_tarjeta
            WHERE candidato_id = @candidato_id;
        END
        ELSE
        BEGIN
            INSERT INTO tbl_candidatos_salud_deportes (candidato_id, penfermedad, enfermedad, palergia, alergia, tsangre, p_deporte, t_tarjeta)
            VALUES (@candidato_id, @penfermedad, @enfermedad, @palergia, @alergia, @tsangre, @p_deporte, @t_tarjeta);
        END
        
        -- Guardar/Actualizar Puesto Solicitado
        IF EXISTS (SELECT 1 FROM tbl_candidatos_puesto WHERE candidato_id = @candidato_id)
        BEGIN
            UPDATE tbl_candidatos_puesto
            SET puesto = @puesto,
                salario_max = @salario_max,
                salario_min = @salario_min,
                turno = @turno,
                obs_horario = @obs_horario,
                experiencia = @experiencia
            WHERE candidato_id = @candidato_id;
        END
        ELSE
        BEGIN
            INSERT INTO tbl_candidatos_puesto (candidato_id, puesto, salario_max, salario_min, turno, obs_horario, experiencia)
            VALUES (@candidato_id, @puesto, @salario_max, @salario_min, @turno, @obs_horario, @experiencia);
        END
        
        -- Guardar/Actualizar Contacto de Emergencia
        IF EXISTS (SELECT 1 FROM tbl_candidatos_emergencia WHERE candidato_id = @candidato_id)
        BEGIN
            UPDATE tbl_candidatos_emergencia
            SET contacto_emer = @contacto_emer,
                parentesco_cont = @parentesco_cont,
                tel_contacto = @tel_contacto
            WHERE candidato_id = @candidato_id;
        END
        ELSE
        BEGIN
            INSERT INTO tbl_candidatos_emergencia (candidato_id, contacto_emer, parentesco_cont, tel_contacto)
            VALUES (@candidato_id, @contacto_emer, @parentesco_cont, @tel_contacto);
        END
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO


-- 2. OBTENER DETALLE COMPLETO DE CANDIDATO (RETORNA MÚLTIPLES RESULT SETS)
CREATE OR ALTER PROCEDURE sp_ObtenerCandidatoCompleto (
    @cedula VARCHAR(20)
)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @candidato_id INT = NULL;
    SELECT @candidato_id = candidato_id FROM tbl_candidatos WHERE cedula = @cedula;
    
    IF @candidato_id IS NULL
    BEGIN
        RAISERROR('El candidato con la cédula provista no existe.', 16, 1);
        RETURN;
    END
    
    -- ResultSet 1: Datos Generales
    SELECT * FROM tbl_candidatos WHERE candidato_id = @candidato_id;
    
    -- ResultSet 2: Datos de Salud y Deportes
    SELECT * FROM tbl_candidatos_salud_deportes WHERE candidato_id = @candidato_id;
    
    -- ResultSet 3: Puesto Solicitado
    SELECT * FROM tbl_candidatos_puesto WHERE candidato_id = @candidato_id;
    
    -- ResultSet 4: Contacto de Emergencia
    SELECT * FROM tbl_candidatos_emergencia WHERE candidato_id = @candidato_id;
    
    -- ResultSet 5: Familiares
    SELECT * FROM tbl_datos_familiares WHERE candidato_id = @candidato_id;
    
    -- ResultSet 6: Datos Académicos
    SELECT * FROM tbl_datos_academicos WHERE candidato_id = @candidato_id;
    
    -- ResultSet 7: Experiencia Profesional
    SELECT * FROM tbl_experiencia_profesional WHERE candidato_id = @candidato_id;
    
    -- ResultSet 8: Referencias
    SELECT * FROM tbl_referencias WHERE candidato_id = @candidato_id;
    
    -- ResultSet 9: Idiomas (con su detalle del catálogo)
    SELECT ci.*, i.descripcion AS idioma_descripcion
    FROM tbl_candidato_idiomas ci
    JOIN tbl_idiomas i ON ci.cod_idioma = i.cod_idioma
    WHERE ci.candidato_id = @candidato_id;
END;
GO


-- 3. BUSCAR CANDIDATOS PAGINADO
CREATE OR ALTER PROCEDURE sp_BuscarCandidatos (
    @filtro VARCHAR(100) = NULL, -- Puede ser nombre, apellido o cédula
    @page INT = 1,
    @pageSize INT = 10,
    @totalRecords INT OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@page - 1) * @pageSize;
    
    -- 1. Calcular el total de registros que coinciden con el filtro
    SELECT @totalRecords = COUNT(DISTINCT c.candidato_id)
    FROM tbl_candidatos c
    LEFT JOIN tbl_candidatos_puesto cp ON c.candidato_id = cp.candidato_id
    WHERE (@filtro IS NULL OR @filtro = '')
       OR (c.cedula LIKE '%' + @filtro + '%')
       OR (c.pnombre + ' ' + ISNULL(c.snombre, '') + ' ' + c.papellido + ' ' + ISNULL(c.sapellido, '') LIKE '%' + @filtro + '%')
       OR (cp.puesto LIKE '%' + @filtro + '%');
       
    -- 2. Retornar la página de resultados
    SELECT c.candidato_id,
           c.cedula,
           c.pnombre,
           c.snombre,
           c.papellido,
           c.sapellido,
           c.celular,
           c.fecha_sol,
           cp.puesto,
           cp.salario_min,
           cp.salario_max
    FROM tbl_candidatos c
    LEFT JOIN tbl_candidatos_puesto cp ON c.candidato_id = cp.candidato_id
    WHERE (@filtro IS NULL OR @filtro = '')
       OR (c.cedula LIKE '%' + @filtro + '%')
       OR (c.pnombre + ' ' + ISNULL(c.snombre, '') + ' ' + c.papellido + ' ' + ISNULL(c.sapellido, '') LIKE '%' + @filtro + '%')
       OR (cp.puesto LIKE '%' + @filtro + '%')
    ORDER BY c.fecha_sol DESC
    OFFSET @Offset ROWS
    FETCH NEXT @pageSize ROWS ONLY;
END;
GO
