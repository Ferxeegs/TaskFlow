const { gql } = require('graphql-tag');

module.exports = gql`
  type AuthPayload {
    token: String!
    user: User!
  }

  extend type Mutation {
    login(email: String!, password: String!): AuthPayload
  }
`;
