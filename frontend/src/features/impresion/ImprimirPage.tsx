import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ChevronLeft, Briefcase, GraduationCap, Users, Languages, Star, Phone } from 'lucide-react';
import { apiService } from '../../services/api.service';
import { Toast, ToastType } from '../../components/ui/Toast';

export const ImprimirPage: React.FC = () => {
  const { cedula } = useParams<{ cedula: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  useEffect(() => {
    const user = apiService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setIsAdmin(user.rol === 'admin');

    const loadCandidato = async () => {
      try {
        if (cedula) {
          const res = await apiService.getCandidato(cedula);
          setData(res);
        }
      } catch (err) {
        showToast('Error al cargar la ficha del candidato.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadCandidato();
  }, [cedula, navigate]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p>Cargando reporte de impresión...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!data || !data.candidato) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h3>Error al cargar los datos</h3>
        <p style={{ color: 'var(--text-secondary)' }}>El candidato solicitado no fue encontrado.</p>
        <button onClick={() => navigate(isAdmin ? '/buscar' : '/solicitud')} className="btn-primary" style={{ marginTop: '1rem' }}>
          Volver
        </button>
      </div>
    );
  }

  const { candidato, saludDeportes, puesto, emergencia, familiares, academicos, experiencia, referencias, idiomas } = data;
  const nombreCompleto = `${candidato.pnombre} ${candidato.snombre || ''} ${candidato.papellido} ${candidato.sapellido || ''}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '2rem 1.5rem', backgroundColor: '#ffffff', color: '#000000' }} className="print-container">
      
      {/* Barra de Acciones (Oculta en Impresión) */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <button 
          onClick={() => navigate(isAdmin ? '/buscar' : '/solicitud')}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
        >
          <ChevronLeft size={16} /> Volver a Edición
        </button>
        <button 
          onClick={handlePrint}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', backgroundColor: 'var(--color-success)' }}
        >
          <Printer size={16} /> Imprimir / PDF
        </button>
      </div>

      {/* REPORTE DE SOLICITUD (FORMATO A4/CURRÍCULUM LIMPIO) */}
      <div style={{ border: '2px solid #000000', padding: '2rem', fontFamily: 'serif' }}>
        
        {/* Cabecera Impresión */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000000', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>SOLICITUD DE EMPLEO</h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem' }}>Ficha de Datos Única de Candidatos</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontWeight: 700 }}>Fecha Solicitud: {candidato.fecha_sol ? new Date(candidato.fecha_sol).toLocaleDateString('es-NI') : 'N/A'}</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem' }}>Cédula: {candidato.cedula}</p>
          </div>
        </div>

        {/* 1. DATOS PERSONALES */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ borderBottom: '1px solid #000000', fontSize: '1.1rem', fontWeight: 700, paddingBottom: '2px', marginBottom: '0.5rem' }}>
            1. DATOS PERSONALES
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 2rem', fontSize: '0.9rem' }}>
            <div><strong>Nombre Completo:</strong> {nombreCompleto}</div>
            <div><strong>Cédula Identidad:</strong> {candidato.cedula}</div>
            <div><strong>Fecha Nacimiento:</strong> {candidato.fecha_nac ? new Date(candidato.fecha_nac).toLocaleDateString('es-NI') : 'N/A'}</div>
            <div><strong>Lugar Nacimiento:</strong> {candidato.lugar_nac || 'N/A'}</div>
            <div><strong>Nacionalidad:</strong> {candidato.nacionalidad}</div>
            <div><strong>Estado Civil:</strong> {candidato.e_civil === 'S' ? 'Soltero(a)' : candidato.e_civil === 'C' ? 'Casado(a)' : candidato.e_civil === 'V' ? 'Viudo(a)' : candidato.e_civil === 'D' ? 'Divorciado(a)' : 'Acompañado(a)'}</div>
            <div><strong>Celular:</strong> {candidato.celular || 'N/A'}</div>
            <div><strong>Teléfono Fijo:</strong> {candidato.telefono_dom || 'N/A'}</div>
            <div><strong>INSS:</strong> {candidato.inss || 'N/A'}</div>
            <div><strong>RUC:</strong> {candidato.ruc || 'N/A'}</div>
            <div><strong>Estatura / Peso:</strong> {candidato.estatura ? `${candidato.estatura} m` : 'N/A'} / {candidato.peso ? `${candidato.peso} lbs` : 'N/A'}</div>
            <div><strong>Pasaporte:</strong> {candidato.pasaporte || 'N/A'}</div>
            <div style={{ gridColumn: '1 / span 2' }}><strong>Dirección Domicilio:</strong> {candidato.direccion_dom}, {candidato.ciudad_dom}, {candidato.departamento_dom} ({candidato.tipo_casa})</div>
          </div>
        </div>

        {/* 2. SALUD Y OTROS DATOS */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ borderBottom: '1px solid #000000', fontSize: '1.1rem', fontWeight: 700, paddingBottom: '2px', marginBottom: '0.5rem' }}>
            2. DATOS DE SALUD Y OTROS
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 2rem', fontSize: '0.9rem' }}>
            <div><strong>Tipo Sangre:</strong> {saludDeportes?.tsangre || 'N/A'}</div>
            <div><strong>¿Padece Enfermedad?:</strong> {saludDeportes?.penfermedad === 'S' ? `Sí (${saludDeportes.enfermedad})` : 'No'}</div>
            <div><strong>¿Padece Alergias?:</strong> {saludDeportes?.palergia === 'S' ? `Sí (${saludDeportes.alergia})` : 'No'}</div>
            <div><strong>¿Deportes / Hobbies?:</strong> {saludDeportes?.p_deporte || 'No'}</div>
            <div><strong>Licencia Conducir:</strong> {candidato.licencia === 'S' ? `Sí (Cat: ${candidato.cat_licencia})` : 'No'}</div>
            <div><strong>Vehículo Propio:</strong> {candidato.vehiculo === 'S' ? `Sí (${candidato.marca} - ${candidato.ano_vehic})` : 'No'}</div>
          </div>
        </div>

        {/* 3. CONTACTO EMERGENCIA */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ borderBottom: '1px solid #000000', fontSize: '1.1rem', fontWeight: 700, paddingBottom: '2px', marginBottom: '0.5rem' }}>
            3. EN CASO DE EMERGENCIA NOTIFICAR A
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
            <div><strong>Nombre:</strong> {emergencia?.contacto_emer || 'N/A'}</div>
            <div><strong>Parentesco:</strong> {emergencia?.parentesco_cont || 'N/A'}</div>
            <div><strong>Teléfono Contacto:</strong> {emergencia?.tel_contacto || 'N/A'}</div>
          </div>
        </div>

        {/* 4. PUESTO SOLICITADO */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ borderBottom: '1px solid #000000', fontSize: '1.1rem', fontWeight: 700, paddingBottom: '2px', marginBottom: '0.5rem' }}>
            4. ASPIRACIÓN DE PUESTO
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            <div><strong>Puesto Solicitado:</strong> {puesto?.puesto || 'N/A'}</div>
            <div><strong>Turno Preferible:</strong> {puesto?.turno || 'N/A'}</div>
            <div><strong>Salario Mínimo Aceptable:</strong> {puesto?.salario_min ? `C$ ${puesto.salario_min}` : 'N/A'}</div>
          </div>
          {puesto?.experiencia && (
            <div style={{ fontSize: '0.9rem' }}>
              <strong>Resumen de Experiencia / Habilidades:</strong>
              <p style={{ margin: '4px 0 0 0', fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>{puesto.experiencia}</p>
            </div>
          )}
        </div>

        {/* 5. DATOS ACADÉMICOS */}
        {academicos.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ borderBottom: '1px solid #000000', fontSize: '1.1rem', fontWeight: 700, paddingBottom: '2px', marginBottom: '0.5rem' }}>
              5. HISTORIAL DE EDUCACIÓN
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #000000', textAlign: 'left', fontWeight: 'bold' }}>
                  <th style={{ padding: '4px 0' }}>Título / Nivel</th>
                  <th style={{ padding: '4px 0' }}>Institución</th>
                  <th style={{ padding: '4px 0' }}>Estado</th>
                  <th style={{ padding: '4px 0' }}>Duración</th>
                </tr>
              </thead>
              <tbody>
                {academicos.map((acad: any) => (
                  <tr key={acad.id_da} style={{ borderBottom: '1px dashed #cccccc' }}>
                    <td style={{ padding: '4px 0' }}>{acad.titulo} ({acad.nivel_academico})</td>
                    <td style={{ padding: '4px 0' }}>{acad.institucion}</td>
                    <td style={{ padding: '4px 0' }}>{acad.estado}</td>
                    <td style={{ padding: '4px 0' }}>{acad.duracion || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 6. EXPERIENCIA LABORAL */}
        {experiencia.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ borderBottom: '1px solid #000000', fontSize: '1.1rem', fontWeight: 700, paddingBottom: '2px', marginBottom: '0.5rem' }}>
              6. EXPERIENCIA LABORAL RECIENTE
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #000000', textAlign: 'left', fontWeight: 'bold' }}>
                  <th style={{ padding: '4px 0' }}>Empresa / Giro</th>
                  <th style={{ padding: '4px 0' }}>Cargo</th>
                  <th style={{ padding: '4px 0' }}>Fecha Ingreso</th>
                  <th style={{ padding: '4px 0' }}>Fecha Salida</th>
                  <th style={{ padding: '4px 0' }}>Motivo Retiro</th>
                </tr>
              </thead>
              <tbody>
                {experiencia.map((exp: any) => (
                  <tr key={exp.id_ep} style={{ borderBottom: '1px dashed #cccccc' }}>
                    <td style={{ padding: '4px 0' }}>{exp.empresa} {exp.giro ? `(${exp.giro})` : ''}</td>
                    <td style={{ padding: '4px 0' }}>{exp.cargo}</td>
                    <td style={{ padding: '4px 0' }}>{exp.f_ingreso ? new Date(exp.f_ingreso).toLocaleDateString('es-NI') : 'N/A'}</td>
                    <td style={{ padding: '4px 0' }}>{exp.f_salida ? new Date(exp.f_salida).toLocaleDateString('es-NI') : 'Trabaja aquí'}</td>
                    <td style={{ padding: '4px 0' }}>{exp.motivo_salida || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 7. ESTRUCTURA FAMILIAR */}
        {familiares.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ borderBottom: '1px solid #000000', fontSize: '1.1rem', fontWeight: 700, paddingBottom: '2px', marginBottom: '0.5rem' }}>
              7. ESTRUCTURA FAMILIAR
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #000000', textAlign: 'left', fontWeight: 'bold' }}>
                  <th style={{ padding: '4px 0' }}>Nombre Familiar</th>
                  <th style={{ padding: '4px 0' }}>Parentesco</th>
                  <th style={{ padding: '4px 0' }}>Lugar Trabajo</th>
                  <th style={{ padding: '4px 0' }}>Dirección Domicilio</th>
                </tr>
              </thead>
              <tbody>
                {familiares.map((fam: any) => (
                  <tr key={fam.id_df} style={{ borderBottom: '1px dashed #cccccc' }}>
                    <td style={{ padding: '4px 0' }}>{fam.nombre}</td>
                    <td style={{ padding: '4px 0' }}>{fam.parentesco}</td>
                    <td style={{ padding: '4px 0' }}>{fam.l_trabajo || 'N/A'}</td>
                    <td style={{ padding: '4px 0' }}>{fam.direccion || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 8. IDIOMAS */}
        {idiomas.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ borderBottom: '1px solid #000000', fontSize: '1.1rem', fontWeight: 700, paddingBottom: '2px', marginBottom: '0.5rem' }}>
              8. IDIOMAS DOMINADOS
            </h3>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {idiomas.map((idm: any) => (
                <div key={idm.cod_idioma} style={{ fontSize: '0.85rem', border: '1px solid #cccccc', padding: '6px 12px', borderRadius: '4px' }}>
                  <strong>{idm.idioma_descripcion}:</strong> Lectura: {idm.n_lectura}% | Escritura: {idm.n_escritura}% | Conversación: {idm.n_conversacion}%
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. REFERENCIAS */}
        {referencias.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ borderBottom: '1px solid #000000', fontSize: '1.1rem', fontWeight: 700, paddingBottom: '2px', marginBottom: '0.5rem' }}>
              9. REFERENCIAS PERSONALES / LABORALES
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #000000', textAlign: 'left', fontWeight: 'bold' }}>
                  <th style={{ padding: '4px 0' }}>Nombre Referente</th>
                  <th style={{ padding: '4px 0' }}>Teléfono</th>
                  <th style={{ padding: '4px 0' }}>Tipo</th>
                  <th style={{ padding: '4px 0' }}>Empresa</th>
                </tr>
              </thead>
              <tbody>
                {referencias.map((ref: any) => (
                  <tr key={ref.id_ref} style={{ borderBottom: '1px dashed #cccccc' }}>
                    <td style={{ padding: '4px 0' }}>{ref.nombre_completo}</td>
                    <td style={{ padding: '4px 0' }}>{ref.telefono || 'N/A'}</td>
                    <td style={{ padding: '4px 0' }}>{ref.tipo_relacion} ({ref.interno === 'S' ? 'Interna' : 'Externa'})</td>
                    <td style={{ padding: '4px 0' }}>{ref.empresa || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Firmas de Confirmación */}
        <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'space-around', fontSize: '0.9rem' }}>
          <div style={{ textAlign: 'center', width: '220px' }}>
            <div style={{ borderBottom: '1px solid #000000', height: '40px', marginBottom: '4px' }}></div>
            <p>Firma del Candidato</p>
          </div>
          <div style={{ textAlign: 'center', width: '220px' }}>
            <div style={{ borderBottom: '1px solid #000000', height: '40px', marginBottom: '4px' }}></div>
            <p>Reclutador / Analista de RH</p>
          </div>
        </div>

      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
};
export default ImprimirPage;
