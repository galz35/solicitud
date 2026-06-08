import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, FileText } from 'lucide-react';
import { StepWizard } from '../../components/wizard/StepWizard';
import { FormField } from '../../components/ui/FormField';
import { Modal } from '../../components/ui/Modal';
import { Toast, ToastType } from '../../components/ui/Toast';
import { apiService } from '../../services/api.service';
import { datosGeneralesSchema, familiarSchema, academicoSchema, experienciaSchema, referenciaSchema, puestoSchema } from '../../schemas/solicitud.schema';
import { departamentos, getMunicipios } from '../../data/nicaragua';

export const SolicitudWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [cedula, setCedula] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Notificaciones
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Estados de datos
  const [datosGenerales, setDatosGenerales] = useState<any>({
    cedula: '', pnombre: '', snombre: '', papellido: '', sapellido: '', fecha_nac: '',
    lugar_nac: '', nacionalidad: 'Nicaragüense', inss: '', ruc: '', estatura: '', peso: '',
    licencia: 'N', cat_licencia: '', vehiculo: 'N', marca: '', ano_vehic: '',
    celular: '', telefono_dom: '', departamento_dom: '', ciudad_dom: '', direccion_dom: '',
    tipo_casa: '', cuenta_banco: 'N', banco: '', no_cuenta: '', pasaporte: '', e_civil: 'S',
    penfermedad: 'N', enfermedad: '', palergia: 'N', alergia: '', tsangre: 'O+', p_deporte: '', t_tarjeta: 'N',
    contacto_emer: '', parentesco_cont: '', tel_contacto: ''
  });

  const [familiares, setFamiliares] = useState<any[]>([]);
  const [academicos, setAcademicos] = useState<any[]>([]);
  const [experiencias, setExperiencias] = useState<any[]>([]);
  const [referencias, setReferencias] = useState<any[]>([]);
  const [idiomasCandidato, setIdiomasCandidato] = useState<any[]>([]);

  // Puesto
  const [puesto, setPuesto] = useState<any>({
    puesto: '', salario_max: '', salario_min: '', turno: 'Diurno', obs_horario: '', experiencia: ''
  });

  // Estados de los Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState<'familiar' | 'academico' | 'experiencia' | 'referencia' | 'idioma' | null>(null);
  
  // Data temporal para formularios dentro de modales
  const [tempFamiliar, setTempFamiliar] = useState<any>({ nombre: '', parentesco: '', l_trabajo: '', direccion: '' });
  const [tempAcademico, setTempAcademico] = useState<any>({ nivel_academico: 'U', titulo: '', estado: 'Graduado', ult_ano_aprob: '', institucion: '', duracion: '' });
  const [tempExperiencia, setTempExperiencia] = useState<any>({ empresa: '', giro: '', cargo: '', jefe_inmediato: '', f_ingreso: '', f_salida: '', motivo_salida: '' });
  const [tempReferencia, setTempReferencia] = useState<any>({ nombre_completo: '', direccion: '', empresa: '', edad: '', telefono: '', tipo_relacion: 'Personal', interno: 'N' });
  const [tempIdioma, setTempIdioma] = useState<any>({ cod_idioma: 2, n_lectura: 50, n_escritura: 50, n_conversacion: 50 });
  const [catalogoIdiomas, setCatalogoIdiomas] = useState<any[]>([]);

  // Errores locales de formulario
  const [formErrors, setFormErrors] = useState<any>({});

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  // 1. CARGAR DATOS
  useEffect(() => {
    const user = apiService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    
    setCedula(user.cedula);
    
    const fetchData = async () => {
      try {
        // Cargar catálogo de idiomas
        const idms = await apiService.getIdiomas();
        setCatalogoIdiomas(idms);

        if (user.existe) {
          // Obtener datos del candidato de la API
          const data = await apiService.getCandidato(user.cedula);
          
          if (data.candidato) {
            // Unificar generales, salud, emergencia
            setDatosGenerales({
              ...data.candidato,
              ...data.saludDeportes,
              ...data.emergencia,
              // formatear fecha a yyyy-MM-dd
              fecha_nac: data.candidato.fecha_nac ? data.candidato.fecha_nac.split('T')[0] : ''
            });
          }
          if (data.puesto) {
            setPuesto(data.puesto);
          }
          setFamiliares(data.familiares || []);
          setAcademicos(data.academicos || []);
          setExperiencias(data.experiencia || []);
          setReferencias(data.referencias || []);
          setIdiomasCandidato(data.idiomas || []);
        } else {
          // Inicializar cédula en el estado
          setDatosGenerales((prev: any) => ({ ...prev, cedula: user.cedula }));
        }
      } catch (err) {
        showToast('Error al cargar la información del servidor.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: 'var(--text-secondary)' }}>Cargando tu solicitud...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // PASOS WIZARD
  const steps = [
    { id: 1, label: 'Datos Personales', description: 'Completá tus datos generales, dirección, salud y contacto de emergencia' },
    { id: 2, label: 'Familiares', description: 'Agregá los datos de tus familiares (padres, hermanos, cónyuge, hijos)' },
    { id: 3, label: 'Educación', description: 'Registrá tu formación académica: primaria, secundaria, técnica o universitaria' },
    { id: 4, label: 'Idiomas', description: 'Indicá qué idiomas hablás y tu nivel de lectura, escritura y conversación' },
    { id: 5, label: 'Experiencia', description: 'Contanos tu experiencia laboral previa (empresas, cargos, fechas)' },
    { id: 6, label: 'Puesto', description: 'Decinos qué puesto te interesa, tus expectativas salariales y disponibilidad' },
    { id: 7, label: 'Referencias', description: 'Agregá referencias personales o laborales que puedan dar fe de tu trayectoria' },
    { id: 8, label: 'Resumen', description: 'Revisá toda tu información antes de finalizar. Podés editar cada sección' },
  ];

  // MANEJO DE NAVEGACIÓN
  const handleNext = async () => {
    setFormErrors({});

    // Si es el último paso, finalizar
    if (currentStep === steps.length) {
      handleFinalizar();
      return;
    }

    if (currentStep === 1) {
      // Validar datos generales con Zod
      const valResult = datosGeneralesSchema.safeParse(datosGenerales);
      if (!valResult.success) {
        const errors: any = {};
        valResult.error.errors.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
        setFormErrors(errors);
        showToast('Corrige los errores del formulario para continuar.', 'warning');
        return;
      }
      
      try {
        await apiService.guardarCandidato(datosGenerales);
        showToast('Datos generales guardados temporalmente.', 'success');
      } catch (err) {
        showToast('Error al guardar datos en el servidor.', 'error');
        return;
      }
    }

    if (currentStep === 6) {
      // Validar puesto solicitado
      const valResult = puestoSchema.safeParse(puesto);
      if (!valResult.success) {
        const errors: any = {};
        valResult.error.errors.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
        setFormErrors(errors);
        showToast('Corrige los errores de aspiración de puesto.', 'warning');
        return;
      }
      
      try {
        // El guardado del candidato en backend también actualiza el puesto si se envía
        await apiService.guardarCandidato({ ...datosGenerales, ...puesto });
        showToast('Datos del puesto guardados.', 'success');
      } catch (err) {
        showToast('Error al guardar datos del puesto.', 'error');
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // MANEJO DE MODALES E INSERCIONES CRUD INLINE
  const openModalFor = (type: 'familiar' | 'academico' | 'experiencia' | 'referencia' | 'idioma') => {
    setModalType(type);
    setFormErrors({});
    if (type === 'familiar') {
      setTempFamiliar({ nombre: '', parentesco: 'Padre', l_trabajo: '', direccion: '' });
      setModalTitle('Añadir Familiar');
    } else if (type === 'academico') {
      setTempAcademico({ nivel_academico: 'U', titulo: '', estado: 'Graduado', ult_ano_aprob: '', institucion: '', duracion: '' });
      setModalTitle('Añadir Educación');
    } else if (type === 'experiencia') {
      setTempExperiencia({ empresa: '', giro: '', cargo: '', jefe_inmediato: '', f_ingreso: '', f_salida: '', motivo_salida: '' });
      setModalTitle('Añadir Experiencia Laboral');
    } else if (type === 'referencia') {
      setTempReferencia({ nombre_completo: '', direccion: '', empresa: '', edad: '', telefono: '', tipo_relacion: 'Personal', interno: 'N' });
      setModalTitle('Añadir Referencia');
    } else if (type === 'idioma') {
      setTempIdioma({ cod_idioma: catalogoIdiomas[0]?.cod_idioma || 2, n_lectura: 50, n_escritura: 50, n_conversacion: 50 });
      setModalTitle('Añadir Idioma');
    }
    setIsModalOpen(true);
  };

  const handleAddDetail = async () => {
    setFormErrors({});
    try {
      if (modalType === 'familiar') {
        const val = familiarSchema.safeParse(tempFamiliar);
        if (!val.success) {
          const errors: any = {};
          val.error.errors.forEach((e) => errors[e.path[0]] = e.message);
          setFormErrors(errors);
          return;
        }
        const res = await apiService.guardarFamiliar(cedula, tempFamiliar);
        setFamiliares([...familiares, { ...tempFamiliar, id_df: res.id_df }]);
        showToast('Familiar agregado.', 'success');
      } 
      
      else if (modalType === 'academico') {
        const val = academicoSchema.safeParse(tempAcademico);
        if (!val.success) {
          const errors: any = {};
          val.error.errors.forEach((e) => errors[e.path[0]] = e.message);
          setFormErrors(errors);
          return;
        }
        const res = await apiService.guardarAcademico(cedula, tempAcademico);
        setAcademicos([...academicos, { ...tempAcademico, id_da: res.id_da }]);
        showToast('Educación agregada.', 'success');
      } 
      
      else if (modalType === 'experiencia') {
        const val = experienciaSchema.safeParse(tempExperiencia);
        if (!val.success) {
          const errors: any = {};
          val.error.errors.forEach((e) => errors[e.path[0]] = e.message);
          setFormErrors(errors);
          return;
        }
        const res = await apiService.guardarExperiencia(cedula, tempExperiencia);
        setExperiencias([...experiencias, { ...tempExperiencia, id_ep: res.id_ep }]);
        showToast('Experiencia agregada.', 'success');
      } 
      
      else if (modalType === 'referencia') {
        const val = referenciaSchema.safeParse(tempReferencia);
        if (!val.success) {
          const errors: any = {};
          val.error.errors.forEach((e) => errors[e.path[0]] = e.message);
          setFormErrors(errors);
          return;
        }
        const res = await apiService.guardarReferencia(cedula, tempReferencia);
        setReferencias([...referencias, { ...tempReferencia, id_ref: res.id_ref }]);
        showToast('Referencia agregada.', 'success');
      } 
      
      else if (modalType === 'idioma') {
        // Guardar idioma
        await apiService.guardarIdioma(cedula, tempIdioma);
        const desc = catalogoIdiomas.find(i => i.cod_idioma === Number(tempIdioma.cod_idioma))?.descripcion || 'Inglés';
        // Recargar idiomas
        setIdiomasCandidato([...idiomasCandidato.filter(i => i.cod_idioma !== Number(tempIdioma.cod_idioma)), { ...tempIdioma, idioma_descripcion: desc }]);
        showToast('Idioma guardado.', 'success');
      }

      setIsModalOpen(false);
    } catch (err) {
      showToast('Error al guardar el registro.', 'error');
    }
  };

  const handleRemoveFamiliar = async (id: number) => {
    try {
      await apiService.eliminarFamiliar(cedula, id);
      setFamiliares(familiares.filter((f) => f.id_df !== id));
      showToast('Registro eliminado.', 'info');
    } catch (err) {
      showToast('Error al eliminar.', 'error');
    }
  };

  const handleRemoveAcademico = async (id: number) => {
    try {
      await apiService.eliminarAcademico(cedula, id);
      setAcademicos(academicos.filter((a) => a.id_da !== id));
      showToast('Registro eliminado.', 'info');
    } catch (err) {
      showToast('Error al eliminar.', 'error');
    }
  };

  const handleRemoveExperiencia = async (id: number) => {
    try {
      await apiService.eliminarExperiencia(cedula, id);
      setExperiencias(experiencias.filter((e) => e.id_ep !== id));
      showToast('Registro eliminado.', 'info');
    } catch (err) {
      showToast('Error al eliminar.', 'error');
    }
  };

  const handleRemoveReferencia = async (id: number) => {
    try {
      await apiService.eliminarReferencia(cedula, id);
      setReferencias(referencias.filter((r) => r.id_ref !== id));
      showToast('Registro eliminado.', 'info');
    } catch (err) {
      showToast('Error al eliminar.', 'error');
    }
  };

  const handleRemoveIdioma = async (codIdioma: number) => {
    try {
      await apiService.eliminarIdioma(cedula, codIdioma);
      setIdiomasCandidato(idiomasCandidato.filter((i) => i.cod_idioma !== codIdioma));
      showToast('Idioma eliminado.', 'info');
    } catch (err) {
      showToast('Error al eliminar.', 'error');
    }
  };

  const handleFinalizar = () => {
    // Actualizar bandera de usuario y navegar al visor de impresión
    const user = apiService.getCurrentUser();
    if (user) {
      user.existe = true;
      localStorage.setItem('candidato', JSON.stringify(user));
    }
    navigate(`/imprimir/${cedula}`);
  };

  return (
    <div style={{ minHeight: '85vh', position: 'relative' }}>
      <StepWizard
        currentStep={currentStep}
        steps={steps}
        onStepChange={setCurrentStep}
        onNext={handleNext}
        onBack={handleBack}
        isFirst={currentStep === 1}
        isLast={currentStep === 8}
      >
        
        {/* ========================================================== */}
        {/* PASO 1: DATOS GENERALES */}
        {/* ========================================================== */}
        {currentStep === 1 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Datos Generales y Personales
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <FormField 
                label="Cédula Identidad" 
                id="cedula" 
                value={datosGenerales.cedula} 
                disabled 
                required 
              />
              <FormField 
                label="Primer Nombre" 
                id="pnombre" 
                value={datosGenerales.pnombre} 
                onChange={(e) => setDatosGenerales({ ...datosGenerales, pnombre: e.target.value })} 
                error={formErrors.pnombre}
                required 
              />
              <FormField 
                label="Segundo Nombre" 
                id="snombre" 
                value={datosGenerales.snombre || ''} 
                onChange={(e) => setDatosGenerales({ ...datosGenerales, snombre: e.target.value })} 
              />
              <FormField 
                label="Primer Apellido" 
                id="papellido" 
                value={datosGenerales.papellido} 
                onChange={(e) => setDatosGenerales({ ...datosGenerales, papellido: e.target.value })} 
                error={formErrors.papellido}
                required 
              />
              <FormField 
                label="Segundo Apellido" 
                id="sapellido" 
                value={datosGenerales.sapellido || ''} 
                onChange={(e) => setDatosGenerales({ ...datosGenerales, sapellido: e.target.value })} 
              />
              <FormField 
                label="Fecha Nacimiento" 
                id="fecha_nac" 
                type="date"
                value={datosGenerales.fecha_nac} 
                onChange={(e) => setDatosGenerales({ ...datosGenerales, fecha_nac: e.target.value })} 
                error={formErrors.fecha_nac}
                required 
              />
              <FormField 
                label="Lugar Nacimiento" 
                id="lugar_nac" 
                value={datosGenerales.lugar_nac || ''} 
                onChange={(e) => setDatosGenerales({ ...datosGenerales, lugar_nac: e.target.value })} 
                error={formErrors.lugar_nac}
                required 
              />
              <FormField 
                label="Estado Civil" 
                id="e_civil" 
                as="select"
                value={datosGenerales.e_civil}
                onChange={(e) => setDatosGenerales({ ...datosGenerales, e_civil: e.target.value })}
                required
              >
                <option value="S">Soltero(a)</option>
                <option value="C">Casado(a)</option>
                <option value="V">Viudo(a)</option>
                <option value="D">Divorciado(a)</option>
                <option value="A">Acompañado(a)</option>
              </FormField>

              <FormField 
                label="Nacionalidad" 
                id="nacionalidad" 
                value={datosGenerales.nacionalidad} 
                onChange={(e) => setDatosGenerales({ ...datosGenerales, nacionalidad: e.target.value })} 
                error={formErrors.nacionalidad}
                required 
              />
              <FormField 
                label="Celular" 
                id="celular" 
                value={datosGenerales.celular || ''} 
                onChange={(e) => setDatosGenerales({ ...datosGenerales, celular: e.target.value })} 
                error={formErrors.celular}
                placeholder="Ej: 88889999"
                required 
              />
              <FormField 
                label="Teléfono Domicilio" 
                id="telefono_dom" 
                value={datosGenerales.telefono_dom || ''} 
                onChange={(e) => setDatosGenerales({ ...datosGenerales, telefono_dom: e.target.value })} 
              />
              <FormField 
                label="No. INSS" 
                id="inss" 
                value={datosGenerales.inss || ''} 
                onChange={(e) => setDatosGenerales({ ...datosGenerales, inss: e.target.value })} 
              />
              <FormField 
                label="No. RUC" 
                id="ruc" 
                value={datosGenerales.ruc || ''} 
                onChange={(e) => setDatosGenerales({ ...datosGenerales, ruc: e.target.value })} 
              />
              <FormField 
                label="Estatura (metros)" 
                id="estatura" 
                type="number"
                step="0.01"
                value={datosGenerales.estatura || ''} 
                onChange={(e) => setDatosGenerales({ ...datosGenerales, estatura: e.target.value })} 
                error={formErrors.estatura}
              />
              <FormField 
                label="Peso (lbs)" 
                id="peso" 
                type="number"
                value={datosGenerales.peso || ''} 
                onChange={(e) => setDatosGenerales({ ...datosGenerales, peso: e.target.value })} 
                error={formErrors.peso}
              />
              <FormField 
                label="Tipo Sangre" 
                id="tsangre" 
                as="select"
                value={datosGenerales.tsangre || 'O+'}
                onChange={(e) => setDatosGenerales({ ...datosGenerales, tsangre: e.target.value })}
                required
              >
                <option value="O+">O Rh Positivo (O+)</option>
                <option value="O-">O Rh Negativo (O-)</option>
                <option value="A+">A Rh Positivo (A+)</option>
                <option value="A-">A Rh Negativo (A-)</option>
                <option value="B+">B Rh Positivo (B+)</option>
                <option value="B-">B Rh Negativo (B-)</option>
                <option value="AB+">AB Rh Positivo (AB+)</option>
                <option value="AB-">AB Rh Negativo (AB-)</option>
                <option value="No Sabe">No Sabe</option>
              </FormField>
            </div>

            <h3 style={{ fontSize: '1.1rem', margin: '1.5rem 0 1rem 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
              Dirección y Vivienda
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <FormField label="Departamento" id="departamento_dom" as="select"
                value={datosGenerales.departamento_dom || ''}
                onChange={(e: any) => {
                  setDatosGenerales({ ...datosGenerales, departamento_dom: e.target.value, ciudad_dom: '' });
                }}
                error={formErrors.departamento_dom} required>
                <option value="">-- Seleccione --</option>
                {departamentos.map(d => (
                  <option key={d.id} value={d.nombre}>{d.nombre}</option>
                ))}
              </FormField>
              <FormField label="Municipio / Ciudad" id="ciudad_dom" as="select"
                value={datosGenerales.ciudad_dom || ''}
                onChange={(e: any) => setDatosGenerales({ ...datosGenerales, ciudad_dom: e.target.value })}
                error={formErrors.ciudad_dom} required>
                <option value="">-- Seleccione --</option>
                {getMunicipios(
                  departamentos.find(d => d.nombre === datosGenerales.departamento_dom)?.id || ''
                ).map(m => (
                  <option key={m.id} value={m.nombre}>{m.nombre}</option>
                ))}
              </FormField>
              <FormField 
                label="Tipo de Casa" 
                id="tipo_casa" 
                as="select"
                value={datosGenerales.tipo_casa || ''}
                onChange={(e) => setDatosGenerales({ ...datosGenerales, tipo_casa: e.target.value })}
                error={formErrors.tipo_casa}
                required
              >
                <option value="">-- Seleccione --</option>
                <option value="Propia">Propia</option>
                <option value="Familiar">Familiar / Padres</option>
                <option value="Alquilada">Alquilada</option>
                <option value="Pagándose">Pagándose</option>
              </FormField>
            </div>
            <FormField 
              label="Dirección Domiciliar Exacta" 
              id="direccion_dom" 
              as="textarea"
              rows={2}
              value={datosGenerales.direccion_dom || ''} 
              onChange={(e) => setDatosGenerales({ ...datosGenerales, direccion_dom: e.target.value })} 
              error={formErrors.direccion_dom}
              required 
            />

            <h3 style={{ fontSize: '1.1rem', margin: '1.5rem 0 1rem 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
              Otros Datos
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <FormField 
                label="¿Tiene Licencia de Conducir?" 
                id="licencia" 
                as="select"
                value={datosGenerales.licencia}
                onChange={(e) => setDatosGenerales({ ...datosGenerales, licencia: e.target.value })}
              >
                <option value="N">No</option>
                <option value="S">Sí</option>
              </FormField>
              {datosGenerales.licencia === 'S' && (
                <FormField 
                  label="Categorías" 
                  id="cat_licencia" 
                  value={datosGenerales.cat_licencia || ''} 
                  onChange={(e) => setDatosGenerales({ ...datosGenerales, cat_licencia: e.target.value })} 
                  placeholder="Ej: 1, 2, 3"
                />
              )}
              <FormField 
                label="¿Posee Vehículo Propio?" 
                id="vehiculo" 
                as="select"
                value={datosGenerales.vehiculo}
                onChange={(e) => setDatosGenerales({ ...datosGenerales, vehiculo: e.target.value })}
              >
                <option value="N">No</option>
                <option value="S">Sí</option>
              </FormField>
              {datosGenerales.vehiculo === 'S' && (
                <>
                  <FormField 
                    label="Marca / Estilo" 
                    id="marca" 
                    value={datosGenerales.marca || ''} 
                    onChange={(e) => setDatosGenerales({ ...datosGenerales, marca: e.target.value })} 
                  />
                  <FormField 
                    label="Año Vehículo" 
                    id="ano_vehic" 
                    type="number"
                    value={datosGenerales.ano_vehic || ''} 
                    onChange={(e) => setDatosGenerales({ ...datosGenerales, ano_vehic: e.target.value })} 
                    error={formErrors.ano_vehic}
                  />
                </>
              )}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
              <FormField 
                label="¿Tiene Cuenta Bancaria?" 
                id="cuenta_banco" 
                as="select"
                value={datosGenerales.cuenta_banco}
                onChange={(e) => setDatosGenerales({ ...datosGenerales, cuenta_banco: e.target.value })}
              >
                <option value="N">No</option>
                <option value="S">Sí</option>
              </FormField>
              {datosGenerales.cuenta_banco === 'S' && (
                <>
                  <FormField 
                    label="Banco" 
                    id="banco" 
                    value={datosGenerales.banco || ''} 
                    onChange={(e) => setDatosGenerales({ ...datosGenerales, banco: e.target.value })} 
                  />
                  <FormField 
                    label="No. Cuenta" 
                    id="no_cuenta" 
                    value={datosGenerales.no_cuenta || ''} 
                    onChange={(e) => setDatosGenerales({ ...datosGenerales, no_cuenta: e.target.value })} 
                  />
                </>
              )}
            </div>

            <h3 style={{ fontSize: '1.1rem', margin: '1.5rem 0 1rem 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
              Salud, Deportes y Hobbies
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormField 
                label="¿Sufre de alguna Enfermedad?" 
                id="penfermedad" 
                as="select"
                value={datosGenerales.penfermedad}
                onChange={(e) => setDatosGenerales({ ...datosGenerales, penfermedad: e.target.value })}
              >
                <option value="N">No</option>
                <option value="S">Sí</option>
              </FormField>
              {datosGenerales.penfermedad === 'S' && (
                <FormField 
                  label="Describa la enfermedad" 
                  id="enfermedad" 
                  value={datosGenerales.enfermedad || ''} 
                  onChange={(e) => setDatosGenerales({ ...datosGenerales, enfermedad: e.target.value })} 
                />
              )}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormField 
                label="¿Padece de Alergias?" 
                id="palergia" 
                as="select"
                value={datosGenerales.palergia}
                onChange={(e) => setDatosGenerales({ ...datosGenerales, palergia: e.target.value })}
              >
                <option value="N">No</option>
                <option value="S">Sí</option>
              </FormField>
              {datosGenerales.palergia === 'S' && (
                <FormField 
                  label="Describa a qué es alérgico(a)" 
                  id="alergia" 
                  value={datosGenerales.alergia || ''} 
                  onChange={(e) => setDatosGenerales({ ...datosGenerales, alergia: e.target.value })} 
                />
              )}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormField 
                label="¿Practica Deportes? (Describa)" 
                id="p_deporte" 
                value={datosGenerales.p_deporte || ''} 
                onChange={(e) => setDatosGenerales({ ...datosGenerales, p_deporte: e.target.value })} 
              />
              <FormField 
                label="¿Posee Tarjeta de Crédito?" 
                id="t_tarjeta" 
                as="select"
                value={datosGenerales.t_tarjeta}
                onChange={(e) => setDatosGenerales({ ...datosGenerales, t_tarjeta: e.target.value })}
              >
                <option value="N">No</option>
                <option value="S">Sí</option>
              </FormField>
            </div>

            <h3 style={{ fontSize: '1.1rem', margin: '1.5rem 0 1rem 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
              Contacto de Emergencia
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <FormField 
                label="Nombre Contacto" 
                id="contacto_emer" 
                value={datosGenerales.contacto_emer} 
                onChange={(e) => setDatosGenerales({ ...datosGenerales, contacto_emer: e.target.value })} 
                error={formErrors.contacto_emer}
                required 
              />
              <FormField 
                label="Parentesco" 
                id="parentesco_cont" 
                value={datosGenerales.parentesco_cont} 
                onChange={(e) => setDatosGenerales({ ...datosGenerales, parentesco_cont: e.target.value })} 
                error={formErrors.parentesco_cont}
                required 
              />
              <FormField 
                label="Teléfono / Celular de Emergencia" 
                id="tel_contacto" 
                value={datosGenerales.tel_contacto} 
                onChange={(e) => setDatosGenerales({ ...datosGenerales, tel_contacto: e.target.value })} 
                error={formErrors.tel_contacto}
                required 
              />
            </div>

          </div>
        )}

        {/* ========================================================== */}
        {/* PASO 2: DATOS FAMILIARES */}
        {/* ========================================================== */}
        {currentStep === 2 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Estructura Familiar</h3>
              <button onClick={() => openModalFor('familiar')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem', fontSize: '0.875rem' }}>
                <Plus size={16} /> Agregar Familiar
              </button>
            </div>

            {familiares.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No has agregado ningún familiar. Presiona "Agregar Familiar" para ingresar tus datos.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Nombre</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Parentesco</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Lugar Trabajo</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Dirección</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {familiares.map((fam) => (
                      <tr key={fam.id_df} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{fam.nombre}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{fam.parentesco}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{fam.l_trabajo || 'N/A'}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{fam.direccion || 'N/A'}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                          <button onClick={() => handleRemoveFamiliar(fam.id_df)} style={{ background: 'transparent', color: 'var(--color-error)', cursor: 'pointer' }}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================== */}
        {/* PASO 3: EDUCACIÓN / DATOS ACADÉMICOS */}
        {/* ========================================================== */}
        {currentStep === 3 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Historial Académico</h3>
              <button onClick={() => openModalFor('academico')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem', fontSize: '0.875rem' }}>
                <Plus size={16} /> Agregar Estudio
              </button>
            </div>

            {academicos.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No has registrado ningún estudio. Registra tu educación.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Título</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Nivel</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Institución</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Estado</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {academicos.map((acad) => (
                      <tr key={acad.id_da} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{acad.titulo}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{acad.nivel_academico}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{acad.institucion}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            padding: '0.125rem 0.5rem', 
                            borderRadius: 'var(--radius-full)', 
                            fontWeight: 600,
                            backgroundColor: acad.estado === 'Graduado' ? 'var(--color-success-light)' : 'var(--color-warning-light)',
                            color: acad.estado === 'Graduado' ? 'var(--color-success)' : 'var(--color-warning)'
                          }}>
                            {acad.estado}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                          <button onClick={() => handleRemoveAcademico(acad.id_da)} style={{ background: 'transparent', color: 'var(--color-error)', cursor: 'pointer' }}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================== */}
        {/* PASO 4: IDIOMAS */}
        {/* ========================================================== */}
        {currentStep === 4 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Dominio de Idiomas</h3>
              <button onClick={() => openModalFor('idioma')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem', fontSize: '0.875rem' }}>
                <Plus size={16} /> Registrar Idioma
              </button>
            </div>

            {idiomasCandidato.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No has registrado idiomas. Presiona "Registrar Idioma" para registrar los idiomas que hablas.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Idioma</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Lectura</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Escritura</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Conversación</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {idiomasCandidato.map((idm) => (
                      <tr key={idm.cod_idioma} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{idm.idioma_descripcion}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{idm.n_lectura}%</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{idm.n_escritura}%</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{idm.n_conversacion}%</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                          <button onClick={() => handleRemoveIdioma(idm.cod_idioma)} style={{ background: 'transparent', color: 'var(--color-error)', cursor: 'pointer' }}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================== */}
        {/* PASO 5: EXPERIENCIA LABORAL */}
        {/* ========================================================== */}
        {currentStep === 5 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Historial de Trabajos</h3>
              <button onClick={() => openModalFor('experiencia')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem', fontSize: '0.875rem' }}>
                <Plus size={16} /> Agregar Trabajo
              </button>
            </div>

            {experiencias.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No has agregado ningún historial de trabajo. Registra tu experiencia laboral.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Empresa</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Cargo</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Ingreso</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Salida</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {experiencias.map((exp) => (
                      <tr key={exp.id_ep} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{exp.empresa}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{exp.cargo}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{exp.f_ingreso ? exp.f_ingreso.split('T')[0] : 'N/A'}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{exp.f_salida ? exp.f_salida.split('T')[0] : 'Trabaja aquí'}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                          <button onClick={() => handleRemoveExperiencia(exp.id_ep)} style={{ background: 'transparent', color: 'var(--color-error)', cursor: 'pointer' }}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================== */}
        {/* PASO 6: PUESTO SOLICITADO */}
        {/* ========================================================== */}
        {currentStep === 6 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Puesto al que Aspira
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <FormField 
                label="Puesto Solicitado" 
                id="puesto" 
                value={puesto.puesto} 
                onChange={(e) => setPuesto({ ...puesto, puesto: e.target.value })} 
                error={formErrors.puesto}
                placeholder="Ej: Analista Programador, Asistente RH"
                required 
              />
              <FormField 
                label="Turno de Preferencia" 
                id="turno" 
                as="select"
                value={puesto.turno}
                onChange={(e) => setPuesto({ ...puesto, turno: e.target.value })}
                error={formErrors.turno}
                required
              >
                <option value="Diurno">Diurno</option>
                <option value="Nocturno">Nocturno</option>
                <option value="Mixto">Mixto / Rotativo</option>
              </FormField>
              <FormField 
                label="Salario Mínimo Aceptable" 
                id="salario_min" 
                type="number"
                value={puesto.salario_min || ''} 
                onChange={(e) => setPuesto({ ...puesto, salario_min: e.target.value })} 
                error={formErrors.salario_min}
              />
              <FormField 
                label="Salario Máximo Pretendido" 
                id="salario_max" 
                type="number"
                value={puesto.salario_max || ''} 
                onChange={(e) => setPuesto({ ...puesto, salario_max: e.target.value })} 
                error={formErrors.salario_max}
              />
            </div>
            
            <FormField 
              label="Observaciones sobre Horario" 
              id="obs_horario" 
              value={puesto.obs_horario || ''} 
              onChange={(e) => setPuesto({ ...puesto, obs_horario: e.target.value })} 
            />
            
            <FormField 
              label="Resumen General de Experiencia Laboral" 
              id="experiencia" 
              as="textarea"
              rows={4}
              value={puesto.experiencia || ''} 
              onChange={(e) => setPuesto({ ...puesto, experiencia: e.target.value })} 
              placeholder="Describa brevemente su trayectoria o habilidades relevantes..."
            />
          </div>
        )}

        {/* ========================================================== */}
        {/* PASO 7: REFERENCIAS */}
        {/* ========================================================== */}
        {currentStep === 7 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Referencias Personales y Laborales</h3>
              <button onClick={() => openModalFor('referencia')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem', fontSize: '0.875rem' }}>
                <Plus size={16} /> Agregar Referencia
              </button>
            </div>

            {referencias.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No has agregado referencias. Ingresa al menos dos referencias.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Nombre</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Teléfono</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Tipo</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Empresa</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referencias.map((ref) => (
                      <tr key={ref.id_ref} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{ref.nombre_completo}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{ref.telefono || 'N/A'}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{ref.tipo_relacion} ({ref.interno === 'S' ? 'Interna' : 'Externa'})</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{ref.empresa || 'N/A'}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                          <button onClick={() => handleRemoveReferencia(ref.id_ref)} style={{ background: 'transparent', color: 'var(--color-error)', cursor: 'pointer' }}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================== */}
        {/* PASO 8: RESUMEN Y CONFIRMACIÓN */}
        {/* ========================================================== */}
        {currentStep === 8 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Revisión General de tu Solicitud
            </h3>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Por favor revisa la información resumida a continuación antes de realizar el envío definitivo.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Bloque Datos Personales */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', backgroundColor: 'var(--bg-primary)' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Candidato</h4>
                <p style={{ fontWeight: 600, fontSize: '1.05rem' }}>{datosGenerales.pnombre} {datosGenerales.snombre || ''} {datosGenerales.papellido} {datosGenerales.sapellido || ''}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Cédula: {datosGenerales.cedula} | Celular: {datosGenerales.celular}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Dirección: {datosGenerales.direccion_dom}, {datosGenerales.ciudad_dom}, {datosGenerales.departamento_dom}</p>
              </div>

              {/* Bloque Puesto */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', backgroundColor: 'var(--bg-primary)' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Aspiración</h4>
                <p style={{ fontWeight: 600 }}>Puesto: {puesto.puesto || 'No especificado'}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Turno: {puesto.turno} | Salario Mínimo Aceptable: {puesto.salario_min ? `C$ ${puesto.salario_min}` : 'No especificado'}</p>
              </div>

              {/* Contadores */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', display: 'block' }}>{familiares.length}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Familiares</span>
                </div>
                <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', display: 'block' }}>{academicos.length}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Estudios</span>
                </div>
                <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', display: 'block' }}>{experiencias.length}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Trabajos</span>
                </div>
                <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', display: 'block' }}>{referencias.length}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Referencias</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </StepWizard>

      {/* ========================================================== */}
      {/* TOAST SYSTEM */}
      {/* ========================================================== */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* ========================================================== */}
      {/* MODAL PARA AGREGAR REGISTROS (CRUD INLINE) */}
      {/* ========================================================== */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
        {/* Formulario Familiar */}
        {modalType === 'familiar' && (
          <div>
            <FormField label="Nombre Completo" id="nombre" value={tempFamiliar.nombre} onChange={(e) => setTempFamiliar({ ...tempFamiliar, nombre: e.target.value })} error={formErrors.nombre} required />
            <FormField label="Parentesco" id="parentesco" as="select" value={tempFamiliar.parentesco} onChange={(e) => setTempFamiliar({ ...tempFamiliar, parentesco: e.target.value })} error={formErrors.parentesco} required>
              <option value="Padre">Padre</option>
              <option value="Madre">Madre</option>
              <option value="Hermano(a)">Hermano(a)</option>
              <option value="Hijo(a)">Hijo(a)</option>
              <option value="Cónyuge">Cónyuge / Pareja</option>
              <option value="Otro">Otro Familiar</option>
            </FormField>
            <FormField label="Lugar de Trabajo" id="l_trabajo" value={tempFamiliar.l_trabajo} onChange={(e) => setTempFamiliar({ ...tempFamiliar, l_trabajo: e.target.value })} />
            <FormField label="Dirección Habitual" id="direccion" value={tempFamiliar.direccion} onChange={(e) => setTempFamiliar({ ...tempFamiliar, direccion: e.target.value })} />
          </div>
        )}

        {/* Formulario Educación */}
        {modalType === 'academico' && (
          <div>
            <FormField label="Título Obtenido / Curso" id="titulo" value={tempAcademico.titulo} onChange={(e) => setTempAcademico({ ...tempAcademico, titulo: e.target.value })} error={formErrors.titulo} required />
            <FormField label="Nivel Académico" id="nivel_academico" as="select" value={tempAcademico.nivel_academico} onChange={(e) => setTempAcademico({ ...tempAcademico, nivel_academico: e.target.value })} required>
              <option value="P">Primaria</option>
              <option value="S">Secundaria</option>
              <option value="T">Técnico Medio/Superior</option>
              <option value="U">Universidad</option>
              <option value="Pg">Postgrado</option>
              <option value="M">Maestría</option>
              <option value="D">Doctorado</option>
            </FormField>
            <FormField label="Institución / Centro Educativo" id="institucion" value={tempAcademico.institucion} onChange={(e) => setTempAcademico({ ...tempAcademico, institucion: e.target.value })} error={formErrors.institucion} required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormField label="Estado" id="estado" as="select" value={tempAcademico.estado} onChange={(e) => setTempAcademico({ ...tempAcademico, estado: e.target.value })} required>
                <option value="Graduado">Graduado</option>
                <option value="Cursando">Cursando</option>
                <option value="Incompleto">Incompleto</option>
              </FormField>
              <FormField label="Último Año Aprobado" id="ult_ano_aprob" type="number" value={tempAcademico.ult_ano_aprob} onChange={(e) => setTempAcademico({ ...tempAcademico, ult_ano_aprob: e.target.value })} error={formErrors.ult_ano_aprob} />
            </div>
            <FormField label="Duración (Ej: 5 años, 6 meses)" id="duracion" value={tempAcademico.duracion} onChange={(e) => setTempAcademico({ ...tempAcademico, duracion: e.target.value })} />
          </div>
        )}

        {/* Formulario Experiencia */}
        {modalType === 'experiencia' && (
          <div>
            <FormField label="Nombre de la Empresa" id="empresa" value={tempExperiencia.empresa} onChange={(e) => setTempExperiencia({ ...tempExperiencia, empresa: e.target.value })} error={formErrors.empresa} required />
            <FormField label="Giro / Actividad Empresa" id="giro" value={tempExperiencia.giro} onChange={(e) => setTempExperiencia({ ...tempExperiencia, giro: e.target.value })} />
            <FormField label="Cargo Desempeñado" id="cargo" value={tempExperiencia.cargo} onChange={(e) => setTempExperiencia({ ...tempExperiencia, cargo: e.target.value })} error={formErrors.cargo} required />
            <FormField label="Jefe Inmediato Superior" id="jefe_inmediato" value={tempExperiencia.jefe_inmediato} onChange={(e) => setTempExperiencia({ ...tempExperiencia, jefe_inmediato: e.target.value })} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormField label="Fecha Ingreso" id="f_ingreso" type="date" value={tempExperiencia.f_ingreso} onChange={(e) => setTempExperiencia({ ...tempExperiencia, f_ingreso: e.target.value })} error={formErrors.f_ingreso} required />
              <FormField label="Fecha Salida (vacío si labora)" id="f_salida" type="date" value={tempExperiencia.f_salida} onChange={(e) => setTempExperiencia({ ...tempExperiencia, f_salida: e.target.value })} error={formErrors.f_salida} />
            </div>
            <FormField label="Motivo de Salida" id="motivo_salida" value={tempExperiencia.motivo_salida} onChange={(e) => setTempExperiencia({ ...tempExperiencia, motivo_salida: e.target.value })} />
          </div>
        )}

        {/* Formulario Referencia */}
        {modalType === 'referencia' && (
          <div>
            <FormField label="Nombre Completo" id="nombre_completo" value={tempReferencia.nombre_completo} onChange={(e) => setTempReferencia({ ...tempReferencia, nombre_completo: e.target.value })} error={formErrors.nombre_completo} required />
            <FormField label="Teléfono / Celular" id="telefono" value={tempReferencia.telefono} onChange={(e) => setTempReferencia({ ...tempReferencia, telefono: e.target.value })} error={formErrors.telefono} required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormField label="Tipo de Referencia" id="tipo_relacion" as="select" value={tempReferencia.tipo_relacion} onChange={(e) => setTempReferencia({ ...tempReferencia, tipo_relacion: e.target.value })} required>
                <option value="Personal">Personal</option>
                <option value="Laboral">Laboral</option>
              </FormField>
              <FormField label="¿Es Referencia Interna?" id="interno" as="select" value={tempReferencia.interno} onChange={(e) => setTempReferencia({ ...tempReferencia, interno: e.target.value })} required>
                <option value="N">No (Externa)</option>
                <option value="S">Sí (Trabaja en la empresa)</option>
              </FormField>
            </div>
            <FormField label="Empresa donde Labora" id="empresa" value={tempReferencia.empresa} onChange={(e) => setTempReferencia({ ...tempReferencia, empresa: e.target.value })} />
            <FormField label="Edad" id="edad" type="number" value={tempReferencia.edad} onChange={(e) => setTempReferencia({ ...tempReferencia, edad: e.target.value })} error={formErrors.edad} />
            <FormField label="Dirección Referencia" id="direccion" value={tempReferencia.direccion} onChange={(e) => setTempReferencia({ ...tempReferencia, direccion: e.target.value })} />
          </div>
        )}

        {/* Formulario Idioma */}
        {modalType === 'idioma' && (
          <div>
            <FormField label="Idioma" id="cod_idioma" as="select" value={tempIdioma.cod_idioma} onChange={(e) => setTempIdioma({ ...tempIdioma, cod_idioma: Number(e.target.value) })} required>
              {catalogoIdiomas.map((i) => (
                <option key={i.cod_idioma} value={i.cod_idioma}>{i.descripcion}</option>
              ))}
            </FormField>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Nivel de Lectura</span>
                  <span style={{ fontWeight: 700 }}>{tempIdioma.n_lectura}%</span>
                </label>
                <input type="range" min="0" max="100" value={tempIdioma.n_lectura} onChange={(e) => setTempIdioma({ ...tempIdioma, n_lectura: Number(e.target.value) })} style={{ width: '100%', accentColor: 'var(--primary)' }} />
              </div>
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Nivel de Escritura</span>
                  <span style={{ fontWeight: 700 }}>{tempIdioma.n_escritura}%</span>
                </label>
                <input type="range" min="0" max="100" value={tempIdioma.n_escritura} onChange={(e) => setTempIdioma({ ...tempIdioma, n_escritura: Number(e.target.value) })} style={{ width: '100%', accentColor: 'var(--primary)' }} />
              </div>
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Nivel de Conversación</span>
                  <span style={{ fontWeight: 700 }}>{tempIdioma.n_conversacion}%</span>
                </label>
                <input type="range" min="0" max="100" value={tempIdioma.n_conversacion} onChange={(e) => setTempIdioma({ ...tempIdioma, n_conversacion: Number(e.target.value) })} style={{ width: '100%', accentColor: 'var(--primary)' }} />
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <button onClick={() => setIsModalOpen(false)} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            Cancelar
          </button>
          <button onClick={handleAddDetail} className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Save size={16} /> Guardar
          </button>
        </div>
      </Modal>
    </div>
  );
};
