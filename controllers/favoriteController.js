const db = require('../db');

// Obtener la lista de favoritos de un usuario
exports.getFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    const [favorites] = await db.query(`
      SELECT movies.* FROM movies
      JOIN favorites ON movies.id = favorites.movie_id
      WHERE favorites.user_id = ?
    `, [userId]);
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Añadir una película a los favoritos
exports.addFavorite = async (req, res) => {
  const { userId, movieId } = req.body;

  try {
    await db.query('INSERT INTO favorites (user_id, movie_id) VALUES (?, ?)', [userId, movieId]);
    res.status(201).json({ message: 'Favorite added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una película de los favoritos
exports.removeFavorite = async (req, res) => {
  const { userId, movieId } = req.body;

  try {
    await db.query('DELETE FROM favorites WHERE user_id = ? AND movie_id = ?', [userId, movieId]);
    res.status(200).json({ message: 'Favorite removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
