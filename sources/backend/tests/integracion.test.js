const request = require('supertest');
const app = require('../app');

// Antes de todas las pruebas, se hace login para obtener el token
let token;

beforeAll(async () => {
    const res = await request(app)
        .post('/api/login')
        .send({
            emailUsuario: 'test@test.com',
            password: '12345678QA'
        });

    token = res.body.token;
});

// Se ejecutan las pruebas de integración
describe('Pruebas de integración básicas', () => {

    // Prueba para obtener el dashboard del usuario
    it('Debería obtener el dashboard del usuario', async () => {
        const res = await request(app)
            .get('/api/dashboard-usuario')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
            expect.objectContaining({
                nombreUsuario: expect.any(String),
                fotoPerfil: expect.stringMatching(/^https:\/\/.*\/uploads\/usuarios\/.*$/),
                rango: expect.any(String),
                progreso: expect.any(Number),
                puntuacion: expect.any(Number),
                maquinasCompletadas: expect.any(Number),
                logrosCompletados: expect.any(Number)
            })
        );
    });

    // Prueba para obtener las máquinas recomendadas
    it('Debería obtener las máquinas recomendadas según el rango', async () => {
        const rango = 'Principiante';

        const res = await request(app)
            .get('/api/maquinas-recomendadas')
            .query({ rango })
            .set('Authorization', `Bearer ${token}`);

        if (res.statusCode === 404) {
            expect(res.body).toHaveProperty('message', 'No se encontraron máquinas recomendadas.');
        } else {
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            res.body.forEach(maquina => {
                expect(maquina).toEqual(expect.objectContaining({
                    idMaquina: expect.any(Number),
                    nombre: expect.any(String),
                    fotoMaquina: expect.stringMatching(/^https:\/\/.*\/uploads\/maquinas\/imagenes\/.*$/),
                    dificultad: expect.any(String),
                }));
            });
        }
    });

    // Prueba para obtener las notificaciones del usuario
    it('Debería obtener las notificaciones del usuario', async () => {
        const res = await request(app)
            .get('/api/notificaciones-usuario')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('username');
        expect(res.body).toHaveProperty('rol');
        expect(res.body).toHaveProperty('nuevasNotificaciones');
        expect(Array.isArray(res.body.nuevasNotificaciones)).toBe(true);

        res.body.nuevasNotificaciones.forEach(notif => {
            expect(notif).toEqual(expect.objectContaining({
                idNotificacion: expect.any(Number),
                fotoNotificacion: expect.stringMatching(/^https:\/\/.*\/uploads\/notificaciones\/.*$/),
                titulo: expect.any(String),
                descripcion: expect.any(String),
                fechaLimite: expect.any(String),
            }));
        });
    });

    // Prueba para obtener los logros del usuario
    it('Debería obtener todos los logros del usuario', async () => {
        const res = await request(app)
            .get('/api/logros-usuario')
            .query({ idUsuario: 1 })
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('logros');
        expect(Array.isArray(res.body.logros)).toBe(true);

        res.body.logros.forEach(logro => {
            expect(logro).toEqual(expect.objectContaining({
                idLogro: expect.any(Number),
                nombre: expect.any(String),
                descripcion: expect.any(String),
                fotoLogro: expect.stringMatching(/^https:\/\/.*\/uploads\/logros\/.*$/),
                puntuacion: expect.any(Number),
                UsuarioLogros: expect.arrayContaining([
                    expect.objectContaining({
                        nuevoLogro: expect.any(Boolean)
                    })
                ])
            }));
        });
    });
});