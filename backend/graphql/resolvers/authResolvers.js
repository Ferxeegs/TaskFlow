const bcrypt = require('bcryptjs');
const jwt = require('../../utils/jwt');
const db = require('../../config/db');

module.exports = {
  Mutation: {
    login: async (_, { email, password }) => {
      try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
          throw new Error('User not found');
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          throw new Error('Invalid credentials');
        }

        const token = jwt.signToken({ id: user.id, email: user.email });

        return {
          token,
          user: {
            id: user.id.toString(),
            name: user.name,
            email: user.email
          }
        };
      } catch (err) {
        throw new Error(err.message || 'Login failed');
      }
    },

    register: async (_, { name, email, password }) => {
      try {
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
          throw new Error('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
          [name, email, hashedPassword]
        );

        const newUser = {
          id: result.insertId.toString(),
          name,
          email
        };

        const token = jwt.signToken({ id: newUser.id, email: newUser.email });

        return {
          token,
          user: newUser
        };
      } catch (err) {
        throw new Error(err.message || 'Registration failed');
      }
    }
  }
};
