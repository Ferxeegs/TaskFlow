const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const bodyParser = require('body-parser');
const typeDefs = require('./graphql/schema/todoSchema');
const resolvers = require('./graphql/resolvers/todoResolvers');

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

(async () => {
  await server.start();
  app.use(cors(), bodyParser.json(), expressMiddleware(server));
  app.listen(4000, () => {
    console.log('🚀 Server berjalan di http://localhost:4000/graphql');
  });
})();
