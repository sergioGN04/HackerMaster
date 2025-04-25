# HackerMaster

HackerMaster es una plataforma web pensada para quienes quieren aprender y practicar ciberseguridad. Permite a los usuarios subir sus propias máquinas de entrenamiento en formato Docker y compartirlas con la comunidad.

La idea es tener un espacio donde cualquiera pueda resolver retos, hacer seguimiento de su progreso y mejorar sus habilidades. Al mismo tiempo, los administradores pueden revisar, aprobar o rechazar las máquinas enviadas y gestionar todo el contenido fácilmente desde el panel.

---

## Tecnologías utilizadas

- **Frontend**: Angular + Bootstrap
- **Backend**: Node.js + Express (Arquitectura MVC)
- **Base de datos**: MySQL
- **ORM**: Sequelize

---

## Estructura del Proyecto

- **/HackerMaster**
  - **/sources**
    - **/backend**: Lógica del servidor (Node.js + Express)
      - **/config**: Configuración de las subidas de archivos y la base de datos
      - **/controllers**: Controladores para gestionar la lógica
      - **/middlewares**: Middlewares para la autenticación y validaciones
      - **/models**: Modelos de la base de datos (Sequelize)
      - **/routes**: Definición de las rutas de la API
      - **/uploads**: Archivos subidos por los usuarios (logros, máquinas, notificaciones, usuarios)
      - **.env**: Variables de entorno (base de datos, puerto, etc.)
      - **app.js**: Configuración principal de la aplicación
    - **/datos_mysql**: Archivos de la base de datos MySQL
    - **/frontend**: Implementación de las interfaces (Angular + Bootstrap)
      - **/src**
        - **/app**: Componentes y configuración de la aplicación
          - **/components**
            - **/shared**: Componentes comunes para todas las páginas
          - **/core**: Funcionalidades y servicios principales
            - **/auth**: Servicio de autenticación (maneja el login, registro, y tokens)
            - **/services**: Servicios para hacer diferentes solicitudes a la API
          - **/pages**: Páginas de la plataforma (inicio, perfil, etc.)
          - **app.routes.ts**: Configuración de las rutas del frontend
          - **style.css**: Estilo general de la plataforma
  - **/despliegueAplicacion.yml**: Archivo de configuración de Docker Compose para la ejecución de contenedores
  - **/README.md**: Documentación principal del proyecto

---

## Uso de la Plataforma

1. **Registro e inicio de sesión**:  
   Los usuarios pueden registrarse mediante el formulario de registro en la página principal. Una vez registrados, pueden iniciar sesión y acceder a su panel de usuario.

2. **Subir máquinas de entrenamiento**:  
   Los usuarios pueden subir sus propias máquinas de entrenamiento en formato Docker. Para ello, deben acceder al apartado **Máquinas** y rellenar el formulario correspondiente.

3. **Resolver máquinas**:  
   Los usuarios pueden navegar por las máquinas disponibles en el apartado **Máquinas** y comenzar a resolverlas, siguiendo el estilo **CTF (Capture The Flag)**. Cada máquina tiene dos flags: **usuario** y **root**.

4. **Ver progreso y competir en el ranking global**:  
   Los usuarios pueden seguir su progreso general y competir en un **ranking global**, donde se muestran las posiciones de los participantes según su puntuación.

### Características

- **Máquinas de Entrenamiento Limitadas a 3 Horas**:  
  Las máquinas subidas a la plataforma se detendrán automáticamente después de 3 horas de haber sido desplegadas. Esto permite garantizar que los recursos del servidor se gestionen adecuadamente y evitar un uso excesivo.

- **Sistema de Notificaciones**:  
  Los usuarios reciben notificaciones sobre eventos importantes dentro de la plataforma, como la aprobación de máquinas o actualizaciones en su progreso.

- **Autenticación y Seguridad**:  
  Los usuarios deben registrarse e iniciar sesión para acceder a sus paneles. La autenticación se realiza mediante un sistema basado en tokens JWT para garantizar la seguridad.

- **Panel de Administración**:  
  Los administradores tienen acceso a un panel donde pueden gestionar el contenido de la plataforma: administrar usuarios, gestionar máquinas (solicitadas o registradas) y administrar notificaciones de los usuarios.

---

## Instalación y Despliegue

### 1. Clonar el repositorio

Primero, clonamos el repositorio y accedemos a la carpeta principal del proyecto:

```bash
git clone https://github.com/sergioGN04/HackerMaster
cd HackerMaster
```

### 2. Instalar dependencias del backend

Para que el backend funcione correctamente, accedemos a dicha carpeta e instalamos las dependencias necesarias:

```bash
cd sources/backend
npm install
```

### 3. Iniciar/Desplegar la plataforma

El proyecto está configurado para ser desplegado utilizando Docker Compose, lo que simplifica el manejo de los contenedores para el frontend, el backend y la base de datos.

Asegúrate de tener Docker y Docker Compose instalados en tu máquina. Una vez que los tengas, navega al directorio raíz del proyecto y ejecuta el siguiente comando para levantar los contenedores:

```bash
cd ../..
docker-compose -f despliegueAplicacion.yml up
```

### 4. Acceder a la plataforma

Una vez que los contenedores estén en funcionamiento, puedes acceder a la plataforma desde tu navegador web en la siguiente URL:

```bash
http://192.168.2.3:4200
```

En esa dirección podrás acceder a la página de inicio de la plataforma, donde podrás registrarte, iniciar sesión y comenzar a usar la aplicación.
