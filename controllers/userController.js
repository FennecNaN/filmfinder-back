const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(sql, [name, email, hashedPassword], (err, results) => {
    if (err) {
      console.error('Error registering user:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'User registered successfully', user: { name, email } });
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log('Login request received:', { email, password });

  const sql = 'SELECT * FROM users WHERE email = ?';
  try {
    const [results] = await db.query(sql, [email]);
    console.log('Query executed. Results:', results);

    if (results.length === 0) {
      console.warn('Invalid email');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = results[0];
    console.log('User found:', user);

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password is valid:', isValidPassword);

    if (!isValidPassword) {
      console.warn('Invalid password');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    console.log('User logged in successfully:', { id: user.id, name: user.name, email: user.email });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Error processing login:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
