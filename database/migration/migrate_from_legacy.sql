-- ================================================================================
-- SCRIPT DE MIGRACIÓN DE DATOS (LEGACY → NORMALIZADO)
-- Sistema: Solicitud de Empleo
-- DBMS: SQL Server
-- Fecha: 08/06/2026
--
-- NOTA: Este script asume que las tablas legacy han sido renombradas temporalmente
-- con el sufijo "_legacy" en la misma base de datos (e.g. tbl_DGenerales_legacy)
-- para permitir la inserción hacia las nuevas tablas normalizadas.
-- ================================================================================

USE Sol_Empleo;
GO

PRINT 'Iniciando migración de datos legacy a esquema normalizado...';

-- Desactivar temporalmente restricciones si es necesario
BEGIN TRANSACTION;
BEGIN TRY

    -- ============================================================================
    -- 1. MIGRAR TABLA PRINCIPAL: tbl_candidatos
    -- ============================================================================
    PRINT 'Migrando datos generales a tbl_candidatos...';
    
    INSERT INTO tbl_candidatos (
        cedula, pnombre, snombre, papellido, sapellido, fecha_nac, lugar_nac,
        nacionalidad, inss, ruc, estatura, peso, licencia, cat_licencia,
        vehiculo, marca, ano_vehic, celular, telefono_dom, departamento_dom,
        ciudad_dom, direccion_dom, tipo_casa, cuenta_banco, banco, no_cuenta,
        pasaporte, e_civil, fecha_sol, activo
    )
    SELECT 
        RTRIM(LTRIM(cedula)),
        ISNULL(pnombre, 'PENDIENTE'),
        snombre,
        ISNULL(papellido, 'PENDIENTE'),
        sapellido,
        ISNULL(fecha_nac, '1900-01-01'),
        lugar_nac,
        ISNULL(nacionalidad, 'Nicaragüense'), -- Fallback estándar
        inss,
        ruc,
        TRY_CAST(estatura AS DECIMAL(5,2)),
        TRY_CAST(peso AS DECIMAL(5,2)),
        CASE WHEN licencia = 'Y' OR licencia = 'S' THEN 'S' ELSE 'N' END,
        cat_licencia,
        CASE WHEN vehiculo = 'Y' OR vehiculo = 'S' THEN 'S' ELSE 'N' END,
        marca,
        TRY_CAST(ano_vehic AS INT),
        celular,
        telefono_dom,
        departamento_dom,
        ciudad_dom,
        direccion_dom,
        tipo_casa,
        CASE WHEN cuenta_banco = 'Y' OR cuenta_banco = 'S' THEN 'S' ELSE 'N' END,
        banco,
        no_cuenta,
        pasaporte,
        -- Mapear estado civil legacy ('S', 'C', 'V', 'D', 'A')
        CASE WHEN e_civil IN ('S', 'C', 'V', 'D', 'A') THEN e_civil ELSE 'S' END,
        ISNULL(fecha_sol, GETDATE()),
        1 -- Activo por defecto
    FROM tbl_DGenerales_legacy;

    -- ============================================================================
    -- 2. MIGRAR TABLA: tbl_candidatos_salud_deportes
    -- ============================================================================
    PRINT 'Migrando datos de salud y deportes...';
    
    INSERT INTO tbl_candidatos_salud_deportes (candidato_id, penfermedad, enfermedad, palergia, alergia, tsangre, p_deporte, t_tarjeta)
    SELECT 
        c.candidato_id,
        CASE WHEN l.penfermedad = 'Y' OR l.penfermedad = 'S' THEN 'S' ELSE 'N' END,
        l.enfermedad,
        CASE WHEN l.palergia = 'Y' OR l.palergia = 'S' THEN 'S' ELSE 'N' END,
        l.alergia,
        l.tsangre,
        l.p_deporte,
        CASE WHEN l.t_tarjeta = 'Y' OR l.t_tarjeta = 'S' THEN 'S' ELSE 'N' END
    FROM tbl_DGenerales_legacy l
    JOIN tbl_candidatos c ON RTRIM(LTRIM(l.cedula)) = c.cedula;

    -- ============================================================================
    -- 3. MIGRAR TABLA: tbl_candidatos_puesto
    -- ============================================================================
    PRINT 'Migrando datos del puesto solicitado...';
    
    INSERT INTO tbl_candidatos_puesto (candidato_id, puesto, salario_max, salario_min, turno, obs_horario, experiencia)
    SELECT 
        c.candidato_id,
        ISNULL(l.puesto, 'No especificado'),
        TRY_CAST(l.salario_max AS DECIMAL(12,2)),
        TRY_CAST(l.salario_min AS DECIMAL(12,2)),
        l.turno,
        l.obs_horario,
        l.experiencia
    FROM tbl_DGenerales_legacy l
    JOIN tbl_candidatos c ON RTRIM(LTRIM(l.cedula)) = c.cedula;

    -- ============================================================================
    -- 4. MIGRAR TABLA: tbl_candidatos_emergencia
    -- ============================================================================
    PRINT 'Migrando contactos de emergencia...';
    
    INSERT INTO tbl_candidatos_emergencia (candidato_id, contacto_emer, parentesco_cont, tel_contacto)
    SELECT 
        c.candidato_id,
        ISNULL(l.contacto_emer, 'PENDIENTE'),
        ISNULL(l.parentesco_cont, 'PENDIENTE'),
        ISNULL(l.tel_contacto, '00000000')
    FROM tbl_DGenerales_legacy l
    JOIN tbl_candidatos c ON RTRIM(LTRIM(l.cedula)) = c.cedula;


    -- ============================================================================
    -- 5. MIGRAR TABLA: tbl_datos_familiares
    -- ============================================================================
    PRINT 'Migrando datos familiares...';
    
    INSERT INTO tbl_datos_familiares (candidato_id, nombre, parentesco, l_trabajo, direccion)
    SELECT 
        c.candidato_id,
        ISNULL(lf.nombre, 'PENDIENTE'),
        ISNULL(lf.parentesco, 'PENDIENTE'),
        lf.l_trabajo,
        lf.direccion
    FROM tbl_dfamiliares_legacy lf
    JOIN tbl_candidatos c ON RTRIM(LTRIM(lf.cedula)) = c.cedula;


    -- ============================================================================
    -- 6. MIGRAR TABLA: tbl_datos_academicos
    -- ============================================================================
    PRINT 'Migrando datos académicos...';
    
    INSERT INTO tbl_datos_academicos (candidato_id, nivel_academico, titulo, estado, ult_ano_aprob, institucion, duracion)
    SELECT 
        c.candidato_id,
        -- Mapeo de niveles académicos con fallback seguro
        CASE 
            WHEN lf.nivel_academico IN ('P', 'S', 'T', 'U', 'Pg', 'M', 'D') THEN lf.nivel_academico
            ELSE 'U' 
        END,
        ISNULL(lf.titulo, 'PENDIENTE'),
        CASE 
            WHEN lf.estado = 'Graduado' OR lf.estado = 'Cursando' OR lf.estado = 'Incompleto' THEN lf.estado
            -- Mapeo de estados legacy si venían codificados
            WHEN lf.estado = '10' THEN 'Cursando'
            WHEN lf.estado = '20' THEN 'Graduado'
            ELSE 'Graduado'
        END,
        TRY_CAST(lf.ult_ano_aprob AS INT),
        ISNULL(lf.institucion, 'PENDIENTE'),
        lf.duracion
    FROM tbl_dacademicos_legacy lf
    JOIN tbl_candidatos c ON RTRIM(LTRIM(lf.cedula)) = c.cedula;


    -- ============================================================================
    -- 7. MIGRAR TABLA: tbl_experiencia_profesional
    -- ============================================================================
    PRINT 'Migrando experiencia profesional...';
    
    INSERT INTO tbl_experiencia_profesional (candidato_id, empresa, giro, cargo, jefe_inmediato, f_ingreso, f_salida, motivo_salida)
    SELECT 
        c.candidato_id,
        ISNULL(le.empresa, 'PENDIENTE'),
        le.giro,
        ISNULL(le.cargo, 'PENDIENTE'),
        le.jefe_inmediato,
        TRY_CAST(le.f_ingreso AS DATE),
        TRY_CAST(le.f_salida AS DATE),
        le.motivo_salida
    FROM tbl_eprofesional_legacy le
    JOIN tbl_candidatos c ON RTRIM(LTRIM(le.cedula)) = c.cedula;


    -- ============================================================================
    -- 8. MIGRAR TABLA: tbl_referencias
    -- ============================================================================
    PRINT 'Migrando referencias...';
    
    INSERT INTO tbl_referencias (candidato_id, nombre_completo, direccion, empresa, edad, telefono, tipo_relacion, interno)
    SELECT 
        c.candidato_id,
        ISNULL(lr.nombre_completo, 'PENDIENTE'),
        lr.direccion,
        lr.empresa,
        TRY_CAST(lr.edad AS INT),
        lr.telefono,
        CASE 
            WHEN lr.tipo_relacion IN ('Personal', 'Laboral') THEN lr.tipo_relacion 
            ELSE 'Personal' 
        END,
        CASE WHEN lr.interno = 'Y' OR lr.interno = 'S' THEN 'S' ELSE 'N' END
    FROM tbl_referencias_legacy lr
    JOIN tbl_candidatos c ON RTRIM(LTRIM(lr.cedula)) = c.cedula;


    -- ============================================================================
    -- 9. MIGRAR TABLA INTERMEDIA: tbl_candidato_idiomas
    -- ============================================================================
    PRINT 'Migrando idiomas de candidatos...';
    
    -- Se asume que tbl_candidato_idioma_legacy tiene (cedula, idioma, n_lectura, n_escritura, n_conversacion)
    -- E idioma mapea con la descripción o código en la tabla vieja
    INSERT INTO tbl_candidato_idiomas (candidato_id, cod_idioma, n_lectura, n_escritura, n_conversacion)
    SELECT 
        c.candidato_id,
        COALESCE(i.cod_idioma, 2), -- Fallback a Inglés (2) si no encuentra coincidencia
        ISNULL(TRY_CAST(li.n_lectura AS INT), 0),
        ISNULL(TRY_CAST(li.n_escritura AS INT), 0),
        ISNULL(TRY_CAST(li.n_conversacion AS INT), 0)
    FROM tbl_candidato_idioma_legacy li
    JOIN tbl_candidatos c ON RTRIM(LTRIM(li.cedula)) = c.cedula
    LEFT JOIN tbl_idiomas i ON i.descripcion LIKE '%' + LTRIM(RTRIM(li.idioma)) + '%';

    COMMIT TRANSACTION;
    PRINT '¡Migración de datos completada exitosamente!';
    
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
        
    PRINT 'OCURRIÓ UN ERROR DURANTE LA MIGRACIÓN:';
    PRINT ERROR_MESSAGE();
END CATCH;
GO
