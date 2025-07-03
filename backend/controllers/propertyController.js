const db = require('../config/db');

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await db.query('SELECT * FROM properties ORDER BY created_at DESC');
    res.status(200).json(properties.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

exports.createProperty = async (req, res) => {
  const { title, description, price, address, city, type } = req.body;
  const agent_id = req.user.id;

  try {
    const newProperty = await db.query(
      'INSERT INTO properties (title, description, price, address, city, type, agent_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, price, address, city, type, agent_id]
    );
    res.status(201).json(newProperty.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

exports.updateProperty = async (req, res) => {
  const propertyId = req.params.id;
  const { title, description, price, address, city, type, agent_id } = req.body;

  try {
    const updatedProperty = await db.query(
      `UPDATE properties
       SET title = $1,
           description = $2,
           price = $3,
           address = $4,
           city = $5,
           type = $6,
           agent_id = $7
       WHERE id = $8
       RETURNING *`,
      [title, description, price, address, city, type, agent_id, propertyId]
    );

    if (updatedProperty.rows.length === 0) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    res.status(200).json(updatedProperty.rows[0]);
  } catch (error) {
    console.error('Error al actualizar la propiedad:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

exports.deleteProperty = async (req, res) => {
  const propertyId = req.params.id;
  try {
    const deleteResult = await db.query('DELETE FROM properties WHERE id = $1', [propertyId]);

    if (deleteResult.rowCount === 0) {
        return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    res.status(200).json({ message: 'Propiedad eliminada con éxito.' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};