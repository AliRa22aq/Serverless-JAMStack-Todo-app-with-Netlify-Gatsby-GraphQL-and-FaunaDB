  
import React, {useState} from "react"
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import DeleteSharpIcon from '@material-ui/icons/DeleteSharp';
import UpdateSharpIcon from '@material-ui/icons/UpdateSharp';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import DoneIcon from '@material-ui/icons/Done';
import TextField from '@material-ui/core/TextField';
import './main.css'


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
      <div className="container">


        <h2>Todo App</h2>
        {loading && <p>Loading Client Side Querry...</p>}
        {error && <p>Error: ${error.message}</p>}



        <TextField fullWidth variant='outlined' onChange={(e) => {setAdd(e.target.value)}} />
        <Button variant="outlined" onClick={ () => {handleAdd(add)}}> Add </Button>
        < br />
        < br />
        < br />

        {
          !updateTask? 

          data && (data.todos.map((post, ind)=> {

            return (
                <div key={post.id}>

                  
        <Grid container spacing={2}> 
        <Grid item xs={1}>{ind + 1} </Grid>
        <Grid item xs={7}>{post.task} </Grid>
        <Grid item xs={1}><Button onClick={() => {handleCheck({task: post.task, id: post.id, status: post.status})}}> {post.status? <DoneIcon fontSize='small' />: <DoneIcon fontSize='small' color="secondary" />} </Button></Grid>
        <Grid item xs={1}><Button onClick={()=> {handleUpdateVal({task: post.task, id: post.id, status: post.status })}}> < UpdateSharpIcon fontSize='small'/> </Button></Grid>
        <Grid item xs={1}><Button onClick={() => {handleDelete(post.id)}}> < DeleteSharpIcon fontSize='small' />  </Button></Grid>
        
</Grid>
                {/* <span> {post.task} </span> 
                <Button onClick={() => {handleCheck({task: post.task, id: post.id, status: post.status})}}> {post.status? <DoneIcon fontSize='small' />: <DoneIcon fontSize='small' color="secondary" />} </Button>
                <Button onClick={()=> {handleUpdateVal({task: post.task, id: post.id, status: post.status })}}> < UpdateSharpIcon fontSize='small'/> </Button>
                <Button onClick={() => {handleDelete(post.id)}}> < DeleteSharpIcon fontSize='small' />  </Button> */}
                

                
                </div> 
          )

          })):
                <div>
                <TextField  value={updateTask} onChange={(e) => {setUpdateTask(e.target.value)}} />
                <div> <Button variant="outlined" onClick={() => {handleUpdate({ task: updateTask, id: updateVal.id, status: updateVal.status })}}> Done Update </Button> </div> 
                </div>


              }



      </div>
  );
    
}