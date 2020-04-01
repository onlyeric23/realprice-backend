import { ApolloServer, gql } from 'apollo-server-cloud-functions';
import * as functions from 'firebase-functions';
import { resolver as items, typeDef as itemsTypeDef } from '../resolvers/items';

const typeDefs = [itemsTypeDef];

const resolvers = {
  Query: {
    items,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
});

export const query = functions
  .region('asia-east2')
  .https.onRequest(server.createHandler());
