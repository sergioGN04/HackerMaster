<h1 align="center">HackerMaster</h1>

<p align="center">
Plataforma de entrenamiento en ciberseguridad ofensiva basada en retos tipo CTF, inspirada en entornos como Hack The Box.
</p>

<p align="center">
  <img src="imgs/banner.png" alt="HackerMaster Banner">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-completed-green">
  <img src="https://img.shields.io/badge/project-TFG-blue">
  <img src="https://img.shields.io/badge/docker-enabled-blue">
</p>

---
## Descripción del proyecto

HackerMaster es una plataforma web orientada al aprendizaje práctico de ciberseguridad ofensiva mediante la resolución de máquinas vulnerables en formato CTF.

El proyecto permite a los usuarios interactuar con un entorno controlado donde pueden practicar técnicas de pentesting en escenarios realistas.

---
## Objetivos

- Desarrollar una plataforma de entrenamiento tipo CTF accesible para estudiantes.
- Permitir la ejecución de máquinas vulnerables mediante Docker.
- Implementar un sistema de subida y validación de retos por parte de usuarios.
- Fomentar el aprendizaje práctico de ciberseguridad ofensiva.

---
## Funcionalidades principales

- Sistema de autenticación con JWT
- Ejecución de máquinas vulnerables en Docker
- Resolución de retos tipo CTF (flags user/root)
- Subida y validación de máquinas por usuarios
- Sistema de ranking global
- Panel de administración

---
## Arquitectura del sistema

```text
sources/
 ├── backend/   → API REST (Node.js + Express)
 ├── frontend/  → Aplicación web (Angular)
 ├── docker/    → Máquinas vulnerables CTF
 └── despliegueAplicacion.yml → Orquestación con Docker Compose
```

---
## Tecnologías utilizadas

- Angular
- Node.js + Express
- MySQL + Sequelize
- Docker / Docker Compose
- JWT
- bcrypt

---
## Instalación y despliegue

Clona el repositorio y ejecuta el script de instalación:

```bash
git clone https://github.com/dryke48/HackerMaster
cd HackerMaster
chmod +x setup.sh
./setup.sh
```

---
## Acceso a la aplicación

### Backend
```
https://192.168.2.2:3000/api/estadisticas-actuales
```

### Frontend
```
https://192.168.2.3:4200
```

⚠️ Es necesario aceptar el certificado SSL autofirmado en el primer acceso.

---
## Usuarios de prueba

- Admin: `sgonzalez@hackermaster.com` / `12345678QA`
- User: `sergiogn@gmail.com` / `12345678QA`
- User: `laura.m@gmail.com` / `12345678QA`

---
## Aprendizajes del proyecto

- Diseño de arquitecturas web completas (frontend + backend)
- Gestión de autenticación y seguridad (JWT, bcrypt)
- Contenerización con Docker
- Desarrollo de entornos vulnerables controlados
- Integración de sistemas de ranking y administración

---

## 👨‍💻 Autor

Sergio González  
LinkedIn: https://www.linkedin.com/in/sergio-gonzalez-noria
