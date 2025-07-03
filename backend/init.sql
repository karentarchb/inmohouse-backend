-- backend/init.sql

-- Crear la tabla de Roles si no existe.
-- Los roles son: administrador, agente, cliente [cite: 15]
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Crear la tabla de Usuarios si no existe.
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER NOT NULL REFERENCES roles(id), -- Esto conecta cada usuario con un rol.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear la tabla de Propiedades si no existe. [cite: 29]
CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    type VARCHAR(50), -- Ej: 'Apartamento', 'Casa', 'Oficina'
    -- Si un agente se borra, la propiedad no se borra, solo queda sin agente.
    agent_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar los roles básicos en la tabla de roles.
-- 'ON CONFLICT (name) DO NOTHING' evita que se inserten duplicados si ejecutamos el script varias veces.
INSERT INTO roles (name) VALUES ('administrador'), ('agente'), ('cliente') ON CONFLICT (name) DO NOTHING;