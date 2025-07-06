const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { mergeTypeDefs } = require('@graphql-tools/merge');
const { mergeResolvers } = require('@graphql-tools/merge');

// Import schema
const todoTypeDefs = require('./graphql/schema/todoSchema');
const authTypeDefs = require('./graphql/schema/authSchema');

// Import resolver
const todoResolvers = require('./graphql/resolvers/todoResolvers');
const authResolvers = require('./graphql/resolvers/authResolvers');

// Gabungkan schema dan resolvers
const typeDefs = mergeTypeDefs([todoTypeDefs, authTypeDefs]);
const resolvers = mergeResolvers([todoResolvers, authResolvers]);

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

(async () => {
  await server.start();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(expressMiddleware(server));

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}/graphql`);
  });
})();
