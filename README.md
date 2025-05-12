# HackerMaster

**HackerMaster** es una plataforma web orientada a quienes quieren aprender y practicar pentesting. Permite a los usuarios subir sus propias máquinas de entrenamiento en formato Docker y compartirlas con la comunidad.

Su objetivo es ofrecer un entorno accesible donde cualquier usuario pueda resolver retos, hacer seguimiento de su progreso y mejorar sus habilidades. Al mismo tiempo, los administradores disponen de un panel desde el que pueden revisar, aprobar o rechazar las máquinas enviadas, y gestionar el contenido general de la plataforma.

---

## Índice

- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Cómo usar la plataforma](#cómo-usar-la-plataforma)
  - [Funcionalidades destacadas](#funcionalidades-destacadas)
- [Usuarios por Defecto](#usuarios-por-defecto)
- [Pruebas del Proyecto](#pruebas-del-proyecto)
  - [Pruebas de Módulo (Unitarias) e Integración](#pruebas-de-módulo-unitarias-e-integración)
  - [Pruebas de Sistema (Carga)](#pruebas-de-sistema-carga)
- [Instalación y Despliegue](#instalación-y-despliegue)

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
      - **/logs**: Archivos de logs de la aplicación (peticiones)
      - **/middlewares**: Middlewares para la autenticación y validaciones
      - **/models**: Modelos de la base de datos (Sequelize)
      - **/routes**: Definición de las rutas de la API
      - **/ssl**: Certificados SSL para habilitar HTTPS
      - **/uploads**: Archivos subidos por los usuarios (logros, máquinas, notificaciones, usuarios)
      - **/utils**: Funciones como el envío de notificaciones al admin y la verificación de logros
      - **.env**: Variables de entorno (base de datos, puertos, etc.)
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
          - **/interceptors**: Interceptores HTTP, como el de gestión del código 429
          - **/pages**: Páginas de la plataforma (inicio, perfil, etc.)
          - **app.config.ts**: Configuración global de la app (rutas, HTTP, interceptores)
          - **app.routes.ts**: Configuración de las rutas del frontend
          - **style.css**: Estilo general de la plataforma
      - **/ssl**: Certificados SSL para habilitar HTTPS
  - **/despliegueAplicacion.yml**: Archivo de configuración de Docker Compose para la ejecución de contenedores
  - **/README.md**: Documentación principal del proyecto

---

## Cómo usar la plataforma

1. **Registro e inicio de sesión**:  
   Los usuarios pueden registrarse mediante el formulario de registro en la página principal. Una vez registrados, pueden iniciar sesión y acceder a su panel de usuario.

2. **Subir máquinas de entrenamiento**:  
   Los usuarios pueden subir sus propias máquinas de entrenamiento en formato Docker. Para ello, deben acceder al apartado **Máquinas** y rellenar el formulario correspondiente.

3. **Resolver máquinas**:  
   Los usuarios pueden navegar por las máquinas disponibles en el apartado **Máquinas** y comenzar a resolverlas, siguiendo el estilo **CTF (Capture The Flag)**. Cada máquina tiene dos flags: **usuario** y **root**.

4. **Ver progreso y competir en el ranking global**:  
   Los usuarios pueden seguir su progreso general y competir en un **ranking global**, donde se muestran las posiciones de los participantes según su puntuación.

### Funcionalidades destacadas

- **Máquinas de Entrenamiento Limitadas a 3 Horas**:  
  Las máquinas subidas a la plataforma se detendrán automáticamente después de 3 horas de haber sido desplegadas. Esto permite garantizar que los recursos del servidor se gestionen adecuadamente y evitar un uso excesivo.

- **Sistema de Notificaciones**:  
  Los usuarios reciben notificaciones sobre eventos importantes dentro de la plataforma, como la aprobación de nuevas máquinas.

- **Autenticación y Seguridad**:  
  La plataforma implementa varias medidas de seguridad para proteger la información y garantizar un entorno seguro para los usuarios. Entre ellas, se incluyen:

  - **Dotenv**: Utilizamos **dotenv** para gestionar de manera segura las variables de entorno (como credenciales de la base de datos y claves secretas) y evitar que se expongan en el código.
  
  - **CORS**: Se configura **CORS** (Cross-Origin Resource Sharing) para limitar qué dominios pueden hacer solicitudes a la API, previniendo ataques de origen cruzado.

  - **HTTPS**: La plataforma está configurada para utilizar **HTTPS**, garantizando que todas las comunicaciones entre el servidor y los usuarios estén cifradas y sean seguras.

  - **Helmet**: Se utiliza **Helmet** para proteger la plataforma contra vulnerabilidades comunes de seguridad en aplicaciones web, como **XSS (Cross-Site Scripting)**, mediante la configuración de encabezados HTTP seguros.

  - **Rate-Limit**: Se implementa un sistema de **rate-limiting** para prevenir ataques de **DDoS** (Distributed Denial of Service) y **fuerza bruta**, limitando la cantidad de solicitudes que un usuario puede hacer a la API en un período determinado.

  - **JWT (JSON Web Tokens)**: Se usa para la autenticación de usuarios, permitiendo validar credenciales y acceder a rutas protegidas sin necesidad de sesiones en el servidor.

  - **Sequelize**: Se utiliza **Sequelize**, un ORM que ayuda a prevenir ataques de **inyección SQL (SQLI)** al usar consultas preparadas y validación de las entradas de los usuarios.

  - **Bcrypt**: Las contraseñas de los usuarios se encriptan con **bcrypt** antes de almacenarse en la base de datos, asegurando que, incluso en caso de acceso no autorizado a la base de datos, las contraseñas no puedan ser obtenidas fácilmente.

  - **Morgan**: Se utiliza para generar logs detallados de todas las solicitudes realizadas a la plataforma, lo que ayuda en la auditoría y monitoreo de la actividad de la aplicación.

- **Panel de Administración**:  
  Los administradores tienen acceso a un panel donde pueden gestionar el contenido de la plataforma: administrar usuarios, gestionar máquinas (solicitadas o registradas) y administrar notificaciones de los usuarios.

---

## Usuarios por Defecto

Para facilitar las pruebas de la plataforma, se han creado los siguientes usuarios ya registrados:

- `test@test.com` / `12345678QA`  
- `test1@test.com` / `12345678QA`  
- `admin@test.com` / `12345678QA`  

> **Nota**: El usuario `admin@test.com` tiene permisos de administrador y puede acceder al panel de gestión de usuarios, máquinas y notificaciones.

Además, las máquinas actualmente visibles en la plataforma son **simulaciones** subidas con fines de demostración visual. Estas **no son máquinas reales desplegables**, sino ejemplos para ilustrar la estructura y funcionamiento de la interfaz.

---

## Pruebas del Proyecto

La plataforma permite realizar diferentes tipos de pruebas para asegurar su correcto funcionamiento. A continuación, se detallan los pasos para realizarlas.

### Pruebas de Módulo (Unitarias) e Integración

La plataforma cuenta con una serie de pruebas automáticas que permiten verificar tanto funcionalidades individuales (pruebas de módulo) como el correcto funcionamiento entre componentes (pruebas de integración). Se encuentran en **sources/backend/tests/**.

#### 1. Accede al directorio del backend:

```bash
cd sources/backend
```

#### 2. Ejecuta las pruebas:

```bash
npm test
```

> **Nota**: Los resultados de las pruebas se mostrarán directamente en la terminal, indicando si han pasado correctamente o si ha ocurrido algún fallo.

### Pruebas de Sistema (Carga)

Para comprobar el comportamiento de la plataforma bajo carga, se han definido pruebas con la herramienta **Artillery**, que simulan múltiples usuarios accediendo a la API de forma simultánea.

#### 1. Asegurarse de que la plataforma esté desplegada:

```bash
docker-compose -f despliegueAplicacion.yml up
```

> **Nota**: Este comando debe ejecutarse desde la raíz del proyecto, donde se encuentra el archivo despliegueAplicacion.yml.

#### 2. Accede al directorio del backend:

```bash
cd sources/backend
```

#### 3. Ejecuta la prueba de carga (permitiendo certificados autofirmados):

```bash
NODE_TLS_REJECT_UNAUTHORIZED='0' npx artillery run tests-artillery/sistema.test.yml
```

> **Nota**: Esta prueba simulará múltiples usuarios que acceden a distintas rutas de la API y proporcionará un informe detallado sobre el rendimiento del sistema (como tiempos de respuesta, número de errores, etc.).

---

## Instalación y Despliegue

### 1. Clonar el repositorio

Primero, clonamos el repositorio y accedemos a la carpeta principal del proyecto:

```bash
git clone https://github.com/sergioGN04/HackerMaster
cd HackerMaster
```

### 2. Ejecutar el Script de instalación y despliegue

Para simplificar el proceso, el proyecto incluye un script (**setup.sh**) que instala las dependencias necesarias del backend y despliega la aplicación.

Asegúrate de tener Docker y Docker Compose instalados en tu máquina. Luego, simplemente hay que dar permisos de ejecución y ejecutar dicho script:

```bash
chmod +x setup.sh
./setup.sh
```

### 4. Acceder a la plataforma

Una vez completado el despliegue, puedes acceder a la plataforma desde tu navegador web en la siguiente URL:

```bash
https://192.168.2.3:4200
```

> ⚠️ **Nota**: La plataforma utiliza HTTPS con un certificado autofirmado. Es posible que tu navegador te advierta sobre la conexión. Puedes continuar aceptando el riesgo temporalmente.
