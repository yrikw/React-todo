import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import { CSVLink } from "react-csv";

function App(props) {

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
      setTasks(tasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  function addTask(name) {
    const newTask = { id: "todo-" + nanoid(), name: name, completed: false };
    setTasks([...tasks, newTask]);
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map(task => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new object
        // whose `completed` prop has been inverted
        return { ...task, completed: !task.completed }
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  const FILTER_MAP = {
    All: () => true,
    Active: task => !task.completed,
    Done: task => task.completed
  };

  const FILTER_NAMES = Object.keys(FILTER_MAP);
  const [filter, setFilter] = useState('All');



  const filterList = FILTER_NAMES.map(name => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));


  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map(task => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));



  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task';
  const headingText = `Total ${taskList.length} ${tasksNoun}`;

  function deleteTask(id) {
    const remainingTasks = tasks.filter(task => id !== task.id);
    setTasks(remainingTasks);
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map(task => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        //
        return { ...task, name: newName }
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  const headers = [
    {label: 'Task', key: 'name' }
  ]

  const csvReport = {
    filename: "Report.csv",
    headers: headers,
    data: tasks
  };

  return (
    <div className="todoapp stack-large" >
      <h1>To Do List</h1>
      <Form addTask={addTask} />
      {filterList}
      <h2 id="list-heading">{headingText}</h2>
      <CSVLink {...csvReport} className="button">Export to CSV</CSVLink>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>

  );
}

export default App;