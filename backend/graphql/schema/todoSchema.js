const gql = require('graphql-tag');

module.exports = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Todo {
    id: ID!
    title: String!
    description: String
    completed: Boolean!
    deadline: String       
    user_id: ID
    user: User
    created_at: String
    updated_at: String
  }

  type Query {
    getTodos: [Todo]
    getTodo(id: ID!): Todo
  }

  type Mutation {
    createTodo(title: String!, description: String, deadline: String, userId: ID!): Todo
    updateTodo(id: ID!, completed: Boolean, title: String, description: String, deadline: String): Todo
    deleteTodo(id: ID!): Boolean
  }
`;