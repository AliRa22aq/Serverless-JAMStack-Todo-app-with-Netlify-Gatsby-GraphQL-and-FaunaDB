//https://github.com/apollographql/apollo-server/issues/1989

const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require('faunadb'),
  q = faunadb.query;


const typeDefs = gql`
  type Query {
    message: String
  }
`;


//fnAEAo3H5NACCMfVfQwTQTU6Eud19BijlajOv0XR
const resolvers = {
  Query: {
    message: async (parent, args, context) => {
      try {
        var client = new faunadb.Client({ secret: 'fnAEAGLZuCACDc-_n2VXHLj2Bf-uPA_jq1I9F8jw' });
        let result = await client.query(

          q.Get(q.Ref(q.Collection('posts'), '288859574834823686'))
        );
       
        return result.data.detail;
      } catch (err) {
        return err.toString();
      }
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true
});

exports.handler = server.createHandler();