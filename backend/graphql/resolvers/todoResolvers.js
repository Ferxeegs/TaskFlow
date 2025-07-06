const db = require('../../config/db');

module.exports = {
  Query: {
    getTodos: async () => {
      try {
        const [rows] = await db.query('SELECT * FROM todos ORDER BY created_at DESC');
        console.log('Fetched todos:', rows);
        return rows.map(todo => ({ 
          ...todo, 
          completed: !!todo.completed,
          id: todo.id.toString() 
        }));
      } catch (error) {
        console.error('Error fetching todos:', error);
        throw new Error('Failed to fetch todos');
      }
    },
    
    getTodo: async (_, { id }) => {
      try {
        const [rows] = await db.query('SELECT * FROM todos WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        
        return { 
          ...rows[0], 
          completed: !!rows[0].completed,
          id: rows[0].id.toString()
        };
      } catch (error) {
        console.error('Error fetching todo:', error);
        throw new Error('Failed to fetch todo');
      }
    },
  },
  
  Mutation: {
    createTodo: async (_, { title, description, deadline, userId }) => {
      try {
        const [result] = await db.query(
          'INSERT INTO todos (title, description, deadline, completed, user_id, created_at, updated_at) VALUES (?, ?, ?, false, ?, NOW(), NOW())',
          [title, description, deadline, userId]
        );
        
        const [rows] = await db.query('SELECT * FROM todos WHERE id = ?', [result.insertId]);
        console.log('Created todo:', rows[0]); 
        
        return { 
          ...rows[0], 
          completed: !!rows[0].completed,
          id: rows[0].id.toString()
        };
      } catch (error) {
        console.error('Error creating todo:', error);
        throw new Error('Failed to create todo');
      }
    },

    updateTodo: async (_, { id, completed, title, description, deadline }) => {
      try {
        // Buat array dinamis untuk field yang dikirim
        const fields = [];
        const values = [];

        if (typeof completed !== 'undefined') {
          fields.push('completed = ?');
          values.push(completed);
        }

        if (typeof title !== 'undefined') {
          fields.push('title = ?');
          values.push(title);
        }

        if (typeof description !== 'undefined') {
          fields.push('description = ?');
          values.push(description);
        }

        if (typeof deadline !== 'undefined') {
          fields.push('deadline = ?');
          values.push(deadline);
        }

        if (fields.length === 0) {
          throw new Error('No fields to update');
        }

        fields.push('updated_at = NOW()');
        const sql = `UPDATE todos SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);

        const [updateResult] = await db.query(sql, values);
        
        if (updateResult.affectedRows === 0) {
          throw new Error('Todo not found');
        }

        const [rows] = await db.query('SELECT * FROM todos WHERE id = ?', [id]);
        console.log('Updated todo:', rows[0]); 
        
        return { 
          ...rows[0], 
          completed: !!rows[0].completed,
          id: rows[0].id.toString()
        };
      } catch (error) {
        console.error('Error updating todo:', error);
        throw new Error('Failed to update todo');
      }
    },

    deleteTodo: async (_, { id }) => {
      try {
        const [result] = await db.query('DELETE FROM todos WHERE id = ?', [id]);
        console.log('Delete result:', result); // Debug log
        return result.affectedRows > 0;
      } catch (error) {
        console.error('Error deleting todo:', error);
        throw new Error('Failed to delete todo');
      }
    },
  },

  Todo: {
    user: async (todo) => {
      try {
        if (!todo.user_id) return null;
        
        const [rows] = await db.query('SELECT id, name, email FROM users WHERE id = ?', [todo.user_id]);
        return rows[0] || null;
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    },
  },
};