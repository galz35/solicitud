import request from 'supertest';
import app from '../app';

describe('Pruebas unitarias de la API - Solicitud Empleo', () => {
  
  // Test de ping
  it('Debe responder 200 en GET /ping', async () => {
    const res = await request(app).get('/ping');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  // Test de validación de login (cédula incorrecta)
  it('Debe fallar (400) en POST /api/auth/login con formato de cédula incorrecto', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ cedula: '123-ABC' }); // formato incorrecto

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('status', 'fail');
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors[0]).toHaveProperty('field', 'cedula');
  });

  // Test de login correcto (cédula admin)
  it('Debe iniciar sesión (200) con la cédula del Administrador', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ cedula: '0000000000000A' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.candidato).toHaveProperty('rol', 'admin');
    expect(res.body.candidato).toHaveProperty('existe', true);
  });
});
