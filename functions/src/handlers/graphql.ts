import { ApolloServer, gql } from 'apollo-server-cloud-functions';
import * as functions from 'firebase-functions';
import { items } from '../resolvers';

const typeDefs = gql`
  type Query {
    items(location: String): [RealPriceItem]
  }
  type RealPriceItem {
    CASE_T: String
    DISTRICT: String
    CASE_F: String
    LOCATION: String
    LANDA: String
    LANDA_Z: String
    SDATE: String
    SCNT: String
    SBUILD: String
    TBUILD: String
    BUITYPE: String
    PBUILD: String
    MBUILD: String
    FDATE: String
    FAREA: String
    BUILD_R: String
    BUILD_L: String
    BUILD_B: String
    BUILD_P: String
    RULE: String
    BUILD_C: String
    TPRICE: String
    UPRICE: String
    UPNOTE: String
    PARKTYPE: String
    PAREA: String
    PPRICE: String
    RMNOTE: String
  }
`;

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
