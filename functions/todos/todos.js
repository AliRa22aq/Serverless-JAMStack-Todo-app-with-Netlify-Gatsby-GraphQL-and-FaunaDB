//https://github.com/apollographql/apollo-server/issues/1989

const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require('faunadb'),
  q = faunadb.query;


const typeDefs = gql`
  type Query {
    todos: [Todo!]
  }
  type Todo {
    id: ID!
    task: String!
    status: Boolean!
  }

  type Mutation {
    addTodo(task: String!): Todo
    deleteTodo(id: ID!): Todo
    updateTodo(status: Boolean! ,id:ID!,task:String!): Todo

  }
`;


//
const resolvers = {
  Query: {
    todos: async (parent, args, context) => {
      try {
        var client = new faunadb.Client({ secret: 'fnAEAo3H5NACCMfVfQwTQTU6Eud19BijlajOv0XR' });
        let result = await client.query
        (

          q.Map(
            q.Paginate(q.Documents(q.Collection("todos"))),
             q.Lambda(x => q.Get(x))
             )      

        );
       
        return result.data.map(post => {
          return {
            id: post.ref.id,
            task: post.data.task,
            status: post.data.status
          }
        })
      } catch (err) {
        return err.toString();
      }
    }
  },

  Mutation: {

    addTodo: async (_, { task }) => {
      console.log(task)
      try {
        var client = new faunadb.Client({ secret: 'fnAEAo3H5NACCMfVfQwTQTU6Eud19BijlajOv0XR' });
        let result = await client.query(
          q.Create(
            q.Collection('todos'),
            {
                data: { 
                  task: task,
                  status: true
              } 
            }
          )
        );
        return result.ref.data;
      } catch (err) {
        return err.toString();
      }
    },

    deleteTodo: async (_, { id }) => {
      try {
        var client = new faunadb.Client({ secret: 'fnAEAo3H5NACCMfVfQwTQTU6Eud19BijlajOv0XR' });
        let result = await client.query(
          q.Delete(
            q.Ref(q.Collection('todos'), id)
          )
        ); 
        return result.ref.data;
      } catch (err) {
        return err.toString();
      }
    },

    updateTodo: async (_, {id,task, status }) => {
      try {
        var client = new faunadb.Client({ secret: 'fnAEAo3H5NACCMfVfQwTQTU6Eud19BijlajOv0XR' });
        let result = await client.query(
          q.Replace(
            q.Ref(q.Collection('todos'), id),
            { data: { task:task, status: true } },
          )
        );
        return result.ref.data;
      } catch (err) {
        return err.toString();
      }
    },
  },
  
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true
});

exports.handler = server.createHandler();


