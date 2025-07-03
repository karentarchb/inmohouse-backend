const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const clientRole = await db.query("SELECT id FROM roles WHERE name = 'cliente'");
    const role_id = clientRole.rows[0].id;

    const newUser = await db.query(
      'INSERT INTO users (name, email, password_hash, role_id) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role_id',
      [name, email, password_hash, role_id]
    );

    res.status(201).json({
      message: 'Usuario registrado con éxito.',
      user: newUser.rows[0],
    });

  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await db.query(
      'SELECT u.id, u.name, u.email, u.password_hash, r.name as role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      }
    );

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};