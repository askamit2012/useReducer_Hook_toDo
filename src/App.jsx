import React, {useState, useReducer, useRef, useEffect} from 'react'
import './App.css'

const initialState = {
  taskList: []
}

function reducerFn(state= initialState, action ) {

  let taskList = [...state.taskList];
  let myList = [];

  if(action.type === 'ADD_TASK') {
    myList = [...taskList];
    myList.push(action.payload);
    return {
      ...state,
      taskList: myList,
    }
  }

  if(action.type === 'CHECK_TASK') {
    myList = [...taskList];
    let index = action.index;
    myList[index] = {
      ...myList[index],
      isChecked: !myList[index].isChecked
    }
    return {
      ...state,
      taskList: myList,
    }
  }

  if(action.type === 'DELETE_TASK') {
    myList = [...taskList];
    myList.splice(action.index, 1);
    return {
      ...state,
      taskList: myList,
    }
  }

  if(action.type === 'EDIT_TASK') {
    myList = [...taskList];
    let index = action.index;
    myList[index] = {
      ...myList[index],
      isEditable: !myList[index].isEditable
    }
    return {
      ...state,
      taskList: myList,
    }
  }

  if(action.type === 'MODIFY_TASK') {
    myList = [...taskList];
    myList[action.index] = action.payload;
    return {
      ...state,
      taskList: myList,
    }
  }

  if(action.type === 'CANCEL_TASK') {
    myList = [...taskList];
    myList[action.index] = {
      ...myList[action.index],
      isEditable: false,
    }
    return {
      ...state,
      taskList: myList,
    }
  }

  return state;
}

function App() {
  const [taskVal, setTaskVal] = useState('');
  const [newTaskVal, setNewTaskVal] = useState('');
  const [state, dispatch] = useReducer(reducerFn, initialState);
  const taskInputRef = useRef(null);

  useEffect(() => {
    taskInputRef.current.focus()
  }, [])
  
  function addTaskBtnHandler() {
    dispatch({
      type: 'ADD_TASK',
      payload: {
        task: taskVal,
        isChecked: false,
        isEditable: false,
        id: new Date().getTime().toString(),
      }
    })
    setTaskVal('')
  }
  
  function cbHandler(index) {
    dispatch({
      type: 'CHECK_TASK',
      index
    })
  }

  function deleteBtnHandler(index) {
    dispatch({
      type: 'DELETE_TASK',
      index
    })
  }

  function editBtnHandler(index) {
    dispatch({
      type: 'EDIT_TASK',
      index
    })
  }

  function modifyBtnHandler(index) {
    dispatch({
      type: 'MODIFY_TASK',
      index,
      payload: {
        task: newTaskVal,
        isChecked: false,
        isEditable: false,
        id: new Date().getTime().toString()
      }
    })
  }

  function cancelBtnHandler(index) {
    dispatch({
      type: 'CANCEL_TASK',
      index
    })
  }

  return (
    <div className="App">
      <h4>toDo using useReducer Hook</h4>
      <input onChange={e => setTaskVal(e.target.value)} value={taskVal} placeholder="Add a Task .....!" ref={taskInputRef} />
      <button onClick={addTaskBtnHandler}>Add Task</button>
      {
        state.taskList.map((task, index) => task.isEditable ?
        <div key={task.id}>
          <input placeholder={task.task} onChange={e => setNewTaskVal(e.target.value)} />
          <button onClick= {() => modifyBtnHandler(index)}>Modify</button>
          <button onClick={() => cancelBtnHandler(index)}>Cancel</button>
        </div>
        : task.isChecked 
        ?
        <div key={task.id} style={{textDecoration: 'line-through'}}>
          <input type="checkbox" onChange={() => cbHandler(index)} />
          <span>{task.task}</span>
          <button onClick={() => deleteBtnHandler(index)}>Delete</button>
        </div>
        : 
        <div key={task.id}>
          <input type="checkbox" onChange={() => cbHandler(index)}/>
          <span>{task.task}</span>
          <button onClick={() => editBtnHandler(index)}>Edit</button>
          <button onClick={() => deleteBtnHandler(index)}>Delete</button>
        </div>)
      }
    </div>
  )
}

export default App
