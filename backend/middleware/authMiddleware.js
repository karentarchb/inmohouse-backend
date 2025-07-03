const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userResult = await db.query(
        'SELECT u.id, u.name, u.email, r.name as role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = $1',
        [decoded.user.id]
      );

      req.user = userResult.rows[0];

      next();

    } catch (error) {
      console.error('Error de autenticación:', error);
      res.status(401).json({ message: 'No autorizado, el token falló.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no se encontró un token.' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `El rol de usuario '${req.user.role}' no tiene permiso para acceder a este recurso.` });
    }
    next();
  }
};