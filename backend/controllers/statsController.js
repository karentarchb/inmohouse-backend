const db = require('../config/db');

exports.getSummary = async (req, res) => {
  try {
    const usersQuery = 'SELECT COUNT(*) FROM users';
    const totalUsersResult = await db.query(usersQuery);

    const agentsQuery = `
      SELECT COUNT(*)
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE r.name = 'agente'
    `;
    const totalAgentsResult = await db.query(agentsQuery);

    const propertiesQuery = 'SELECT COUNT(*) FROM properties';
    const totalPropertiesResult = await db.query(propertiesQuery);

    const totalActiveUsers = parseInt(totalUsersResult.rows[0].count);
    const totalActiveAgents = parseInt(totalAgentsResult.rows[0].count);
    const totalProperties = parseInt(totalPropertiesResult.rows[0].count);

    const summary = {
      totalActiveUsers,
      totalActiveAgents,
      totalProperties
    };

    res.status(200).json(summary);

  } catch (error) {
    console.error('Error al obtener el resumen de estadísticas:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};