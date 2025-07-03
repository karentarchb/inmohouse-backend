// backend/setupDatabase.js
const fs = require('fs');
const path = require('path');
const db = require('./config/db');

const setup = async () => {
  try {
    console.log('Leyendo el archivo init.sql...');
    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf-8');

    console.log('Ejecutando script de inicialización en la base de datos...');
    await db.query(sql);

    console.log('✅ ¡Base de datos y tablas creadas con éxito!');
  } catch (error) {
    console.error('❌ Error al ejecutar el script de inicialización:', error);
  }
};

setup();