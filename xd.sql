CREATE TABLE estudiantes ( 
    id_estudiante INT PRIMARY KEY, 
    nombre VARCHAR(100), 
    fecha_inscripcion DATE, 
    id_persona INT, -- Relación indirecta con otra tabla 
    FOREIGN KEY (id_persona) REFERENCES personas(id_persona) );



-- Tabla personas: Almacena datos generales que pueden pertenecer a estudiantes, profesores y administrativos.

CREATE TABLE personas ( 
    id_persona INT PRIMARY KEY, 
    documento_identidad VARCHAR(20) UNIQUE, 
    tipo_persona ENUM('estudiante', 'profesor', 'administrativo') );

-- Tabla cursos: Cada curso tiene una asignatura y un profesor asignado.

CREATE TABLE cursos ( 
    id_curso INT PRIMARY KEY, 
    nombre_curso VARCHAR(100), 
    id_profesor INT, 
    FOREIGN KEY (id_profesor) REFERENCES personas(id_persona)) -- Relación indirecta con la tabla 'personas' );

-- Tabla inscripciones: Maneja la relación entre estudiantes y cursos, pero tiene una capa adicional de condición de vigencia.

CREATE TABLE inscripciones ( 
    id_inscripcion INT PRIMARY KEY, 
    id_estudiante INT, id_curso INT, 
    fecha_inscripcion DATE, 
    FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id_estudiante), 
    FOREIGN KEY (id_curso) REFERENCES cursos(id_curso) );

-- #########################################################################################################
-- Resuelto

-- 1. Esquema SQL que Define las Relaciones entre las Tablas

-- Tabla personas

CREATE TABLE personas ( 
    id_persona INT PRIMARY KEY, 
    documento_identidad VARCHAR(20) UNIQUE, 
    tipo_persona ENUM('estudiante', 'profesor', 'administrativo') 
);

-- Tabla estudiantes

CREATE TABLE estudiantes ( 
    id_estudiante INT PRIMARY KEY, 
    nombre VARCHAR(100), 
    fecha_inscripcion DATE, 
    id_persona INT, 
    FOREIGN KEY (id_persona) REFERENCES personas(id_persona) 
);

-- Tabla cursos

CREATE TABLE cursos ( 
    id_curso INT PRIMARY KEY, 
    nombre_curso VARCHAR(100), 
    id_profesor INT, 
    FOREIGN KEY (id_profesor) REFERENCES personas(id_persona) 
);

-- Tabla inscripciones

CREATE TABLE inscripciones ( 
    id_inscripcion INT PRIMARY KEY, 
    id_estudiante INT, 
    id_curso INT, 
    fecha_inscripcion DATE, 
    FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id_estudiante), 
    FOREIGN KEY (id_curso) REFERENCES cursos(id_curso) 
);

-- 2. Consulta para Obtener Estudiantes Inscritos en un Curso

SELECT estudiantes.nombre, cursos.nombre_curso 
FROM inscripciones 
JOIN estudiantes ON inscripciones.id_estudiante = estudiantes.id_estudiante
JOIN cursos ON inscripciones.id_curso = cursos.id_curso
WHERE cursos.id_curso = [ID_DEL_CURSO];

-- 3. Consecuencias de Eliminar un Estudiante con Inscripciones Vigentes

Problema:

Si se intenta eliminar un estudiante que tiene inscripciones vigentes,
se generará un error de violación de clave foránea, ya que las inscripciones dependen de la existencia
del estudiante en la tabla estudiantes.

Solución:

Para evitar este problema, se pueden implementar las siguientes estrategias:
Restricción de eliminación: No permitir la eliminación de estudiantes que tengan inscripciones vigentes.
Eliminación en cascada: Modificar la relación de la tabla inscripciones para que, al eliminar un estudiante, 
se eliminen automáticamente las inscripciones asociadas. Esto se puede hacer añadiendo ON DELETE CASCADE 
en la definición de la clave foránea en la tabla inscripciones.


-- 4. Estructura de Tabla para Almacenar Profesores con Más de 3 Cursos

Para almacenar solo aquellos profesores que tienen más de 3 cursos,
 se puede crear una vista o una tabla adicional que filtre a los profesores.

CREATE VIEW profesores_con_mas_de_tres_cursos AS
SELECT personas.id_persona, personas.documento_identidad, COUNT(cursos.id_curso) AS total_cursos
FROM personas 
JOIN cursos ON personas.id_persona = cursos.id_profesor
WHERE personas.tipo_persona = 'profesor'
GROUP BY personas.id_persona
HAVING COUNT(cursos.id_curso) > 3;


-- {
--   "version": 2,
--   "builds": [
--     {
--       "src": "frontend/package.json",
--       "use": "@vercel/static-build",
--       // ESTO RESUELVE EL 404: Indica la carpeta de salida (dist) de tu build de Vite.
--       "config": {
--         "outputDirectory": "dist"
--       }
--     },
--     {
--       "src": "backend/src/index.js",
--       "use": "@vercel/node"
--     }
--   ],
--   "routes": [
--     {
--       "src": "/api/(.*)",
--       "dest": "/backend/src/index.js"
--     },
--     // Esta regla genérica sirve cualquier archivo (incluyendo index.html, favicon.ico)
--     // que esté dentro de la carpeta 'dist'.
--     {
--       "src": "/(.*)",
--       "dest": "/frontend/dist/$1"
--     }
--   ],
--   "env": {
--     "NODE_ENV": "production"
--   }
-- }

-- importante
-- {
--   "name": "curso-vite",
--   "private": true,
--   "version": "0.0.0",
--   "type": "module",
--   "scripts": {
--     "dev": "vite",
--     "build": "vite build",
--     "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
--     "preview": "vite preview",
--     "start": "serve -s dist"
--   },
--   "dependencies": {
--     "@react-pdf/renderer": "^3.4.5",
--     "axios": "^1.7.8",
--     "js-cookie": "^3.0.5",
--     "react": "^18.3.1",
--     "react-dom": "^18.3.1",
--     "react-hook-form": "^7.54.2",
--     "react-router": "^7.6.3",
--     "react-router-dom": "^6.30.1",
--     "serve": "^14.2.4"
--   },
--   "devDependencies": {
--     "@types/react": "^18.3.3",
--     "@types/react-dom": "^18.3.0",
--     "@vitejs/plugin-react-swc": "^3.5.0",
--     "eslint": "^8.57.0",
--     "eslint-plugin-react": "^7.34.3",
--     "eslint-plugin-react-hooks": "^4.6.2",
--     "eslint-plugin-react-refresh": "^0.4.7",
--     "vite": "^5.3.4"
--   }
-- }
