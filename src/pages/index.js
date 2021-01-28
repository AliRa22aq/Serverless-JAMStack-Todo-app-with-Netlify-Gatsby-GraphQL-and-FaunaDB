  
import React, {useState} from "react"
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';


// This query is executed at run time by Apollo.
const GET_TODO = gql`
{
  todos  {
      id
      task
      status
    }
}
`;

const ADD_TODO = gql`
    mutation addTodo($task: String!){
        addTodo(task: $task){
            task
        }
    }`

const DELETE_TODOS = gql`
    mutation deleteTodo($id: ID!){
      deleteTodo(id: $id){
            id
        }
    }`

export default function Home() {
 // const [update, setInput] = useState("Ali")

  // console.log(input)


  const { loading, error, data } = useQuery(GET_TODO);
  
  const [addTodo] = useMutation(ADD_TODO);
  const [add, setAdd] = useState()


  const [deleteTodo] = useMutation(DELETE_TODOS);

  

  // console.log(data)

  const handleDelete = (id) => {
    console.log(id)
    deleteTodo({
      variables: {
        id
      },
      refetchQueries: [{ query: GET_TODO }]
    })
  }

  const handleAdd = (task) => {
    addTodo({
      variables: {
        task
      },
      refetchQueries: [{ query: GET_TODO }]
    })
  }

  return (
      <div>
        <input  onChange={(e) => {setAdd(e.target.value)}} />
        <button onClick={ () => {handleAdd(add)}}> Add </button>

        <h2>Data Received from Apollo Client at runtime from Serverless Function:</h2>
        {loading && <p>Loading Client Side Querry...</p>}
        {error && <p>Error: ${error.message}</p>}
        {data && (
          data.todos.map((post)=> {
            return(
              <div key={post.id}>{post.task} | <button onClick={() => {handleDelete(post.id)}}>X</button> </div>

            )
          })
        )}

      </div>
  );
    
}