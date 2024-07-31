const db = require('../db');

exports.getAllMovies = async (req, res) => {
    try {
      const [movies] = await db.query('SELECT * FROM movies');
      res.json(movies);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


exports.searchMovies = async (req, res) => {
  const { query } = req.query;

  try {
    const [movies] = await db.query('SELECT * FROM movies WHERE title LIKE ?', [`%${query}%`]);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMoviePlatforms = async (req, res) => {
  const { id } = req.params;

  try {
    const [platforms] = await db.query(`
      SELECT platforms.* FROM platforms
      JOIN movie_platforms ON platforms.id = movie_platforms.platform_id
      WHERE movie_platforms.movie_id = ?
    `, [id]);

    res.json(platforms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
