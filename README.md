# Proyecto InmoHouse - Backend
##  **Backend de InmoHouse**
API RESTful construida con Node.js, Express y PostgreSQL para la gestión de una plataforma inmobiliaria.
Explorar el código:
https://github.com/karentarchb/inmohouse-backend
API en vivo: https://inmohouse-backend.onrender.com

##  **1. Visión General del Proyecto**
Este repositorio contiene el código fuente del servidor backend para la aplicación InmoHouse. La API ha sido diseñada para ser robusta, segura y escalable, proveyendo todos los servicios necesarios para la gestión de usuarios, propiedades y autenticación.

El backend se encarga de toda la lógica de negocio, la interacción con la base de datos y la seguridad, exponiendo una serie de endpoints RESTful que son consumidos por el frontend de Angular.

##  **2. Decisiones de Arquitectura y Diseño**
Se tomaron decisiones clave para asegurar que el backend sea eficiente, mantenible y seguro, siguiendo las mejores prácticas de la industria.

##  **2.1. Stack Tecnológico**
- **Entorno de Ejecución: Node.js**
    - *Justificación:* Elegido por su modelo de I/O no bloqueante y su alto rendimiento, ideal para construir APIs rápidas y escalables. El uso de JavaScript en todo el stack (con Angular en el frontend) reduce la carga cognitiva.
- **Framework: Express.js**
    - *Justificación:* Un framework minimalista y flexible para Node.js que permite una organización clara de rutas, middlewares y controladores, sin añadir complejidad innecesaria.
- **Base de Datos: PostgreSQL**
    - *Justificación:* Se optó por una base de datos relacional (SQL) debido a la naturaleza estructurada y relacional de los datos (usuarios tienen roles, propiedades tienen agentes). PostgreSQL ofrece robustez, consistencia de datos y capacidades avanzadas.
- **Autenticación: JWT (JSON Web Tokens)**
    - *Justificación:* Estándar moderno y seguro para la autenticación en APIs. Permite crear sesiones stateless, donde el token auto-contenido lleva toda la información necesaria (ID de usuario, rol) para verificar la identidad y los permisos en cada petición.
- **Seguridad de Contraseñas: bcrypt.js**
    - *Justificación:* Librería estándar para el hashing de contraseñas. Asegura que las contraseñas nunca se almacenen en texto plano, utilizando un algoritmo de hash con "sal" para prevenir ataques de diccionario y rainbow tables.

##  **2.2. Estructura de Carpetas**
El código está organizado siguiendo un patrón de diseño orientado a funcionalidades para maximizar la escalabilidad y mantenibilidad.
```
/backend
├── /config/          # Archivos de configuración (ej. conexión a la base de datos en db.js).
├── /controllers/     # Contiene la lógica de negocio y la interacción con la base de datos.
├── /middleware/      # Funciones intermediarias que procesan las peticiones (ej. authMiddleware para seguridad).
├── /routes/          # Define las rutas de la API y las asocia con sus respectivos controladores.
├── .env              # (Local) Almacena variables de entorno sensibles como contraseñas y secretos.
├── index.js          # Punto de entrada principal del servidor Express.
└── package.json      # Define las dependencias del proyecto y los scripts.
```
##  **2.3. Estrategia de Seguridad**
La seguridad es un pilar fundamental de la API, implementada a través de un sistema de middlewares:

Middleware protect: Intercepta todas las peticiones a rutas protegidas. Verifica la presencia y validez del Bearer Token en el encabezado Authorization. Si el token es válido, decodifica el payload (que contiene el ID y rol del usuario) y adjunta la información del usuario al objeto req para los siguientes pasos. Si no es válido, rechaza la petición con un error 401 Unauthorized.

Middleware authorize(...roles): Se ejecuta después de protect. Recibe una lista de roles permitidos (ej. 'administrador', 'agente'). Compara el rol del usuario (obtenido del token) con la lista de roles permitidos. Si el usuario no tiene el rol adecuado, rechaza la petición con un error 403 Forbidden.

##  **3. Endpoints de la API**
A continuación se detallan los endpoints principales implementados.
### **Autenticación**

- **`POST /api/auth/register`**
    - **Descripción:** Registra un nuevo usuario con el rol de 'cliente'.
    - **Acceso:** Público.
- **`POST /api/auth/login`**
    - **Descripción:** Autentica un usuario y devuelve un JWT.
    - **Acceso:** Público.

### **Usuarios**

- **`GET /api/users`**
    - **Descripción:** Devuelve una lista de todos los usuarios del sistema.
    - **Acceso:** Administrador.
- **`POST /api/users`**
    - **Descripción:** Crea un nuevo usuario (con rol especificado).
    - **Acceso:** Administrador.
- **`PUT /api/users/:id`**
    - **Descripción:** Actualiza los datos de un usuario específico.
    - **Acceso:** Administrador.
- **`DELETE /api/users/:id`**
    - **Descripción:** Elimina un usuario específico.
    - **Acceso:** Administrador.
- **`GET /api/users/agents`**
    - **Descripción:** Devuelve una lista de todos los usuarios con rol 'agente'.
    - **Acceso:** Administrador, Agente.

### **Propiedades**

- **`GET /api/properties`**
    - **Descripción:** Devuelve una lista de todas las propiedades.
    - **Acceso:** Autenticado (Cualquier rol).
- **`POST /api/properties`**
    - **Descripción:** Crea una nueva propiedad.
    - **Acceso:** Administrador, Agente.
- **`PUT /api/properties/:id`**
    - **Descripción:** Actualiza una propiedad específica.
    - **Acceso:** Administrador, Agente.
- **`DELETE /api/properties/:id`**
    - **Descripción:** Elimina una propiedad específica.
    - **Acceso:** Administrador, Agente.

### **Estadísticas**

- **`GET /api/stats/summary`**
    - **Descripción:** Devuelve un resumen con totales de usuarios, agentes y propiedades.
    - **Acceso:** Administrador, Agente, Cliente.
##  **4. Guía de Instalación y Ejecución Local**
##  **4.1. Prerrequisitos**
Node.js (versión 18.x o superior)

Git

Docker Desktop (Recomendado para la base de datos local)

##  **4.2. Pasos para la Ejecución**
1 Clonar el Repositorio:
```
git clone https://github.com/karentarchb/inmohousebcl.git
cd inmohousebcl/backend
```
2 Instalar Dependencias:
```
npm install
```
3 Configurar Variables de Entorno:
Crea un archivo .env en la raíz de la carpeta /backend y añade las siguientes variables:
```
# Configuración de la Base de Datos Local (con Docker)
DB_USER=admin
DB_PASSWORD=postgres
DB_DATABASE=inmohouse
DB_HOST=127.0.0.1
DB_PORT=5435

# Secreto para JWT (puedes cambiarlo por cualquier cadena larga)
JWT_SECRET=un_secreto_muy_largo_y_dificil_de_adivinar_12345
```
4 Iniciar la Base de Datos (con Docker):
Desde la carpeta raíz del monorepo (inmohousebcl), ejecuta:
```
docker compose up -d
```
5 Iniciar el Servidor:
Desde la carpeta /backend, ejecuta:
```
node index.js
```
El servidor estará corriendo y escuchando en http://localhost:3000.
