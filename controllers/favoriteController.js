const pool = require('../db');

exports.addFavorite = async (req, res) => {
  const { userId, movieId } = req.body;

  try {
    const result = await pool.query('INSERT INTO favorites (user_id, movie_id) VALUES ($1, $2) RETURNING *', [userId, movieId]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(`
      SELECT movies.* FROM movies
      JOIN favorites ON movies.id = favorites.movie_id
      WHERE favorites.user_id = $1
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFavorite = async (req, res) => {
  const { userId, movieId } = req.body;

  try {
    const result = await pool.query('DELETE FROM favorites WHERE user_id = $1 AND movie_id = $2 RETURNING *', [userId, movieId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.status(200).json({ message: 'Favorite removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
