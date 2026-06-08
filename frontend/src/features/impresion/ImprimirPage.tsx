import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ChevronLeft } from 'lucide-react';
import { apiService } from '../../services/api.service';

const EM = { S: 'Soltero(a)', C: 'Casado(a)', V: 'Viudo(a)', D: 'Divorciado(a)', A: 'Acompañado(a)' } as any;
const NL = { P: 'Primaria', S: 'Secundaria', T: 'Técnico', U: 'Universidad', Pg: 'Postgrado', M: 'Maestría', D: 'Doctorado' } as any;

export const ImprimirPage: React.FC = () => {
  const { cedula } = useParams<{ cedula: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user = apiService.getCurrentUser();
  const isAdmin = user?.rol === 'admin';

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (!cedula) return;
    apiService.getCandidato(cedula)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [cedula, navigate]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f5f5' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid #e0e0e0', borderTopColor: '#0d9488', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <div style={{ color: '#888', fontSize: 14 }}>Cargando solicitud...</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (!data?.candidato) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f5f5' }}>
      <div style={{ textAlign: 'center', color: '#888' }}>Candidato no encontrado</div>
    </div>
  );

  const { candidato: c, saludDeportes: sd, puesto: p, emergencia: em, familiares, academicos, experiencia, referencias, idiomas } = data;
  const nombre = [c.pnombre, c.snombre, c.papellido, c.sapellido].filter(Boolean).join(' ');
  const fd = (d: string) => d ? new Date(d).toLocaleDateString('es-NI') : 'N/A';

  const Section = ({ title, icon, children }: any) => (
    <div style={{ marginBottom: 20, pageBreakInside: 'avoid' }}>
      <div style={{ background: '#0d9488', color: '#fff', padding: '6px 14px', fontSize: 13, fontWeight: 700, borderRadius: 4, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>{icon}</span> {title}
      </div>
      {children}
    </div>
  );

  const Row = ({ label, value, fullWidth }: any) => (
    <div style={{ display: 'flex', borderBottom: '1px solid #eee', padding: '5px 0', fontSize: 12, gridColumn: fullWidth ? '1 / -1' : undefined }}>
      <div style={{ width: 140, fontWeight: 600, color: '#555', flexShrink: 0 }}>{label}</div>
      <div style={{ color: '#222' }}>{value || 'N/A'}</div>
    </div>
  );

  const Grid = ({ cols = 2, children }: any) => (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '0 20px' }}>{children}</div>
  );

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px', background: '#fff' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }} className="no-print">
        <button onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')} style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
          <ChevronLeft size={14} /> Volver
        </button>
        <button onClick={() => window.print()} style={{ padding: '8px 16px', border: 'none', borderRadius: 6, background: '#0d9488', color: '#fff', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Printer size={14} /> Imprimir / PDF
        </button>
      </div>

      {/* Document */}
      <div style={{ border: '2px solid #0d9488', borderRadius: 8, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #0d9488, #059669)', color: '#fff', padding: '20px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 1 }}>SOLICITUD DE EMPLEO</div>
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>FICHA DE DATOS ÚNICA DEL CANDIDATO</div>
        </div>

        <div style={{ padding: '16px 20px' }}>
          {/* Info bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#666', marginBottom: 16, padding: '8px 12px', background: '#f0fdf4', borderRadius: 4 }}>
            <span><strong>Cédula:</strong> {c.cedula}</span>
            <span><strong>Registro:</strong> {fd(c.fecha_sol)}</span>
          </div>

          {/* 1. DATOS PERSONALES */}
          <Section title="Datos Personales" icon="👤">
            <Grid>
              <Row label="Nombre Completo" value={nombre} fullWidth />
              <Row label="Cédula" value={c.cedula} />
              <Row label="Fecha Nacimiento" value={fd(c.fecha_nac)} />
              <Row label="Lugar Nacimiento" value={c.lugar_nac} />
              <Row label="Nacionalidad" value={c.nacionalidad} />
              <Row label="Estado Civil" value={EM[c.e_civil] || c.e_civil} />
              <Row label="Celular" value={c.celular} />
              <Row label="Teléfono Domicilio" value={c.telefono_dom} />
              <Row label="INSS" value={c.inss} />
              <Row label="RUC" value={c.ruc} />
              <Row label="Pasaporte" value={c.pasaporte} />
              <Row label="Estatura/Peso" value={`${c.estatura ? c.estatura + ' m' : ''}${c.estatura && c.peso ? ' / ' : ''}${c.peso ? c.peso + ' lbs' : ''}`} />
              <Row label="Dirección" value={`${c.direccion_dom || ''}${c.ciudad_dom ? ', ' + c.ciudad_dom : ''}${c.departamento_dom ? ', ' + c.departamento_dom : ''} (${c.tipo_casa || 'N/A'})`} fullWidth />
              <Row label="Licencia" value={c.licencia === 'S' ? `Sí (${c.cat_licencia || 'N/A'})` : 'No'} />
              <Row label="Vehículo Propio" value={c.vehiculo === 'S' ? `Sí (${c.marca || ''} ${c.ano_vehic || ''})` : 'No'} />
              <Row label="Cuenta Bancaria" value={c.cuenta_banco === 'S' ? `Sí (${c.banco || ''} - ${c.no_cuenta || ''})` : 'No'} />
              <Row label="Tarjeta Crédito" value={c.t_tarjeta === 'S' ? 'Sí' : 'No'} />
            </Grid>
          </Section>

          {/* 2. SALUD */}
          <Section title="Salud y Deportes" icon="🏥">
            <Grid>
              <Row label="Tipo Sangre" value={sd?.tsangre} />
              <Row label="Enfermedades" value={sd?.penfermedad === 'S' ? sd.enfermedad : 'No'} />
              <Row label="Alergias" value={sd?.palergia === 'S' ? sd.alergia : 'No'} />
              <Row label="Deportes/Hobbies" value={sd?.p_deporte || 'N/A'} />
            </Grid>
          </Section>

          {/* 3. EMERGENCIA */}
          <Section title="Contacto de Emergencia" icon="🆘">
            <Grid cols={3}>
              <Row label="Nombre" value={em?.contacto_emer} />
              <Row label="Parentesco" value={em?.parentesco_cont} />
              <Row label="Teléfono" value={em?.tel_contacto} />
            </Grid>
          </Section>

          {/* 4. PUESTO */}
          <Section title="Aspiración de Puesto" icon="🎯">
            <Grid>
              <Row label="Puesto Solicitado" value={p?.puesto} />
              <Row label="Turno" value={p?.turno} />
              <Row label="Salario Mínimo" value={p?.salario_min ? `C$${Number(p.salario_min).toLocaleString()}` : ''} />
              <Row label="Salario Máximo" value={p?.salario_max ? `C$${Number(p.salario_max).toLocaleString()}` : ''} />
              <Row label="Observaciones" value={p?.obs_horario} fullWidth />
            </Grid>
            {p?.experiencia && (
              <div style={{ marginTop: 8, padding: 8, background: '#f8fafc', borderRadius: 4, fontSize: 12, fontStyle: 'italic', color: '#555' }}>
                <strong>Resumen de Experiencia:</strong><br />{p.experiencia}
              </div>
            )}
          </Section>

          {/* 5. EDUCACIÓN */}
          {academicos?.length > 0 && (
            <Section title="Formación Académica" icon="🎓">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#f0fdf4', borderBottom: '2px solid #0d9488' }}>
                    <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Título / Nivel</th>
                    <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Institución</th>
                    <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Estado</th>
                    <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Año</th>
                    <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Duración</th>
                  </tr>
                </thead>
                <tbody>
                  {academicos.map((a: any) => (
                    <tr key={a.id_da} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '5px 8px' }}>{a.titulo} <span style={{ color: '#999', fontSize: 11 }}>({NL[a.nivel_academico] || a.nivel_academico})</span></td>
                      <td style={{ padding: '5px 8px' }}>{a.institucion}</td>
                      <td style={{ padding: '5px 8px' }}>{a.estado}</td>
                      <td style={{ padding: '5px 8px' }}>{a.ult_ano_aprob || '-'}</td>
                      <td style={{ padding: '5px 8px' }}>{a.duracion || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          )}

          {/* 6. EXPERIENCIA */}
          {experiencia?.length > 0 && (
            <Section title="Experiencia Laboral" icon="💼">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#f0fdf4', borderBottom: '2px solid #0d9488' }}>
                    <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Empresa</th>
                    <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Cargo</th>
                    <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Ingreso</th>
                    <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Salida</th>
                    <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Motivo Retiro</th>
                  </tr>
                </thead>
                <tbody>
                  {experiencia.map((e: any) => (
                    <tr key={e.id_ep} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '5px 8px' }}>{e.empresa}{e.giro ? <span style={{ color: '#999' }}> ({e.giro})</span> : ''}</td>
                      <td style={{ padding: '5px 8px' }}>{e.cargo}</td>
                      <td style={{ padding: '5px 8px' }}>{fd(e.f_ingreso)}</td>
                      <td style={{ padding: '5px 8px' }}>{e.f_salida ? fd(e.f_salida) : 'Actual'}</td>
                      <td style={{ padding: '5px 8px' }}>{e.motivo_salida || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          )}

          {/* 7. FAMILIARES */}
          {familiares?.length > 0 && (
            <Section title="Estructura Familiar" icon="👨‍👩‍👧‍👦">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#f0fdf4', borderBottom: '2px solid #0d9488' }}>
                    <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Nombre</th>
                    <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Parentesco</th>
                    <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Trabajo</th>
                    <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Dirección</th>
                  </tr>
                </thead>
                <tbody>
                  {familiares.map((f: any) => (
                    <tr key={f.id_df} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '5px 8px' }}>{f.nombre}</td>
                      <td style={{ padding: '5px 8px' }}>{f.parentesco}</td>
                      <td style={{ padding: '5px 8px' }}>{f.l_trabajo || '-'}</td>
                      <td style={{ padding: '5px 8px' }}>{f.direccion || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          )}

          {/* 8. IDIOMAS */}
          {idiomas?.length > 0 && (
            <Section title="Idiomas" icon="🌐">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {idiomas.map((i: any) => (
                  <div key={i.cod_idioma} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, padding: '6px 12px', fontSize: 12 }}>
                    <strong style={{ color: '#0d9488' }}>{i.idioma_descripcion}</strong>
                    <div style={{ color: '#555', marginTop: 2 }}>Lectura: {i.n_lectura}% · Escritura: {i.n_escritura}% · Conversación: {i.n_conversacion}%</div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* 9. REFERENCIAS */}
          {referencias?.length > 0 && (
            <Section title="Referencias" icon="📋">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#f0fdf4', borderBottom: '2px solid #0d9488' }}>
                    <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Nombre</th>
                    <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Teléfono</th>
                    <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Tipo</th>
                    <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Empresa</th>
                  </tr>
                </thead>
                <tbody>
                  {referencias.map((r: any) => (
                    <tr key={r.id_ref} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '5px 8px' }}>{r.nombre_completo}</td>
                      <td style={{ padding: '5px 8px' }}>{r.telefono || '-'}</td>
                      <td style={{ padding: '5px 8px' }}>{r.tipo_relacion} ({r.interno === 'S' ? 'Interna' : 'Externa'})</td>
                      <td style={{ padding: '5px 8px' }}>{r.empresa || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          )}

          {/* Signatures */}
          <div style={{ marginTop: 30, display: 'flex', justifyContent: 'space-around', fontSize: 12 }}>
            <div style={{ textAlign: 'center', width: 200 }}>
              <div style={{ borderTop: '1px solid #333', paddingTop: 6, marginTop: 40 }}>Firma del Candidato</div>
            </div>
            <div style={{ textAlign: 'center', width: 200 }}>
              <div style={{ borderTop: '1px solid #333', paddingTop: 6, marginTop: 40 }}>Reclutador / RH</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
