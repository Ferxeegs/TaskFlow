const bcrypt = require('bcryptjs');
const jwt = require('../../utils/jwt');
const db = require('../../db');

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
    }
  }
};
