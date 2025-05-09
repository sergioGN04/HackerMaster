const request = require('supertest');
const app = require('../app');

// Pruebas para el registro de usuario
describe('POST /api/register', () => {
    // Prueba para el registro con datos válidos
    it('Debería registrar un nuevo usuario', async () => {
        // Generamos un nombre de usuario único
        const nombreUsuario = `testuser${new Date().getTime()}`;
        
        const res = await request(app)
            .post('/api/register')
            .send({
                nombreUsuario,
                emailUsuario: `${nombreUsuario}@test.com`,
                passwordUsuario: '12345678QA',
                confirmarPassword: '12345678QA'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Usuario registrado correctamente.');
    });

    // Prueba para el registro con datos inválidos (email ya en uso)
    it('Debería rechazar un email duplicado', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({
                nombreUsuario: 'testuser1',
                emailUsuario: 'test@test.com',
                passwordUsuario: '12345678QA',
                confirmarPassword: '12345678QA'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('El correo ya está en uso.');
    });
});

// Pruebas para el login de usuario
describe('POST /api/login', () => {

    // Prueba para el login con credenciales válidas
    it('Debería hacer login con credenciales válidas', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({
                emailUsuario: 'test@test.com',
                password: '12345678QA'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    // Prueba para el login con credenciales inválidas (contraseña incorrecta)
    it('Debería rechazar login con contraseña incorrecta', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({
                emailUsuario: 'test@test.com',
                password: '123456'
            });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Contraseña incorrecta');
    });
});