  
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

const UPDATE_TODO = gql`
mutation updateTodo($status: Boolean! , $id:ID!,$task: String!){
  updateTodo(status: $status id:$id task: $task){
    id    
    status
    task
}
}`

const CHECK_TODO = gql`
mutation updateCheck($status: Boolean! , $id:ID!,$task: String!){
  updateCheck(status: $status id:$id task: $task){
    id    
    status
    task
}
}`


export default function Home() {

  ////// Fetch todos

  const { loading, error, data } = useQuery(GET_TODO);
  

  ////// Add todo
  const [addTodo] = useMutation(ADD_TODO);
  const [add, setAdd] = useState()
  const handleAdd = (task) => {
    addTodo({
      variables: {
        task
      },
      refetchQueries: [{ query: GET_TODO }]
    })
  }

  ////// Delete todo

  const [deleteTodo] = useMutation(DELETE_TODOS);
  const handleDelete = (id) => {
    deleteTodo({
      variables: {
        id
      },
      refetchQueries: [{ query: GET_TODO }]
    })
  }

  ////// Update Todos

  const [updateTodo] = useMutation(UPDATE_TODO);
  const [updateTask, setUpdateTask] = useState()
  const [updateVal, setUpdateVal] = useState()

  const handleUpdateVal = (task) => {
    setUpdateVal(task)
    setUpdateTask(task.task)
  }


  const handleUpdate = (e) => {
    updateTodo({
      variables: {
        id: e.id,
        task: e.task,
        status: e.status
      },
      refetchQueries: [{ query: GET_TODO }]
    })
    setUpdateTask();
  }
  
  /////// Update Checks

  const [updateCheck] = useMutation(CHECK_TODO);
  const handleCheck = (e) => {
    if (e.status) {
      updateCheck({
        variables: {
          id: e.id,
          task: e.task,
          status: false
        },
        refetchQueries: [{ query: GET_TODO }]
      })
    } else {    
      updateCheck({
        variables: {
          id: e.id,
          task: e.task,
          status: true
        },
        refetchQueries: [{ query: GET_TODO }]
    })
  }
 
  }
  //const [check, setcheck] = useState(false);
  

  return (
      <div>
        <input  onChange={(e) => {setAdd(e.target.value)}} />
        <button onClick={ () => {handleAdd(add)}}> Add </button>

        <h2>Data Received from Apollo Client at runtime from Serverless Function:</h2>
        {loading && <p>Loading Client Side Querry...</p>}
        {error && <p>Error: ${error.message}</p>}

        {
          !updateTask?
          data && (data.todos.map((post)=> {
            return (
                <div key={post.id}>     
                
                <span> {post.task} </span> 
                <button onClick={() => {handleCheck({task: post.task, id: post.id, status: post.status})}}> {post.status? 'Check': 'Checked'} </button>
                <button onClick={()=> {handleUpdateVal({task: post.task, id: post.id, status: post.status })}}> Update </button>
                <button onClick={() => {handleDelete(post.id)}}> X </button>
                

                </div>
          )})):
                <div>
                <input  value={updateTask} onChange={(e) => {setUpdateTask(e.target.value)}} />
                <div> <button onClick={() => {handleUpdate({ task: updateTask, id: updateVal.id, status: updateVal.status })}}> done Update </button> </div> 
                </div>

              }

      </div>
  );
    
}