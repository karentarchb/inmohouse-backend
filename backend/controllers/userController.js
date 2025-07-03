const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getAgents = async (req, res) => {
  try {
    const query = `
      SELECT u.id, u.name, u.email, r.name as role 
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE r.name = 'agente'
    `;

    const agentsResult = await db.query(query);

    if (agentsResult.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron agentes en la base de datos.' });
    }

    res.status(200).json(agentsResult.rows);

  } catch (error) {
    console.error('Error al obtener agentes:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const query = `
      SELECT u.id, u.name, u.email, r.name as role 
      FROM users u 
      JOIN roles r ON u.role_id = r.id 
      ORDER BY u.id ASC
    `;
    const users = await db.query(query);
    res.status(200).json(users.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

exports.createUser = async (req, res) => {
  const { name, email, password, role_id } = req.body;

  try {
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await db.query(
      'INSERT INTO users (name, email, password_hash, role_id) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role_id',
      [name, email, password_hash, role_id]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, email, role, password } = req.body;

  try {
    const updateFields = [];
    const values = [];
    let queryParamIndex = 1;

    if (name) {
      updateFields.push(`name = $${queryParamIndex++}`);
      values.push(name);
    }
    if (email) {
      updateFields.push(`email = $${queryParamIndex++}`);
      values.push(email);
    }
    if (role) {

      const roleResult = await db.query('SELECT id FROM roles WHERE name = $1', [role]);

      if (roleResult.rows.length > 0) {
        const numericRoleId = roleResult.rows[0].id;
        updateFields.push(`role_id = $${queryParamIndex++}`);
        values.push(numericRoleId);
      } else {
        return res.status(400).json({ message: `El rol '${role}' no es válido.` });
      }
    }
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);
      updateFields.push(`password_hash = $${queryParamIndex++}`);
      values.push(password_hash);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron datos para actualizar.' });
    }

    const setClause = updateFields.join(', ');
    const query = `UPDATE users SET ${setClause} WHERE id = $${queryParamIndex} RETURNING id`;

    values.push(userId);

    await db.query(query, values);

    const updatedUserResult = await db.query(
      `SELECT u.id, u.name, u.email, r.name as role 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.id = $1`,
      [userId]
    );

    res.status(200).json(updatedUserResult.rows[0]);

  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const deleteResult = await db.query('DELETE FROM users WHERE id = $1', [userId]);

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.status(200).json({ message: 'Usuario eliminado con éxito.' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};