import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { pool } from '../db.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

export async function register(req, res, next) {
  try {
    // Validate input
    const { email, password } = registerSchema.parse(req.body);

    // Check if user already exists
    const exists = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists!' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email`,
      [email, hashed]
    );

    return res.status(201).json({
      success: true,
      message: 'User created!',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    // Validate input
    const { email, password } = loginSchema.parse(req.body);

    // Get user from DB
    const result = await pool.query(
      `SELECT id, email, password FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "No record found with this email" });
    }

    const user = result.rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password doesn't match" });
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '5h', issuer: 'todo-api' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: token
    });
  } catch (err) {
    next(err);
  }
}

// Get current user
export function getMe(req, res) {
  return res.status(200).json({ success: true, data: req.user });
}
