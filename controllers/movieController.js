const pool = require('../db');

exports.getAllMovies = async (req, res) => {
  const { page = 1, limit = 6 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query('SELECT * FROM movies LIMIT $1 OFFSET $2', [limit, offset]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMovieCount = async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM movies');
    res.json({ count: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchMovies = async (req, res) => {
  const { query } = req.query;

  try {
    const result = await pool.query('SELECT * FROM movies WHERE title ILIKE $1', [`%${query}%`]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMoviePlatforms = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT platforms.* FROM platforms
      JOIN movie_platforms ON platforms.id = movie_platforms.platform_id
      WHERE movie_platforms.movie_id = $1
    `, [id]);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
