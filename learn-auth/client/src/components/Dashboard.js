import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import { Card, Button, Alert, Form } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContexts";
import { Link, useNavigate } from "react-router-dom";
// import { createTask, getTask } from "../firebase";
import { getDatabase, ref, child, set, get, onValue } from "firebase/database";
import app from "../firebase";

const Dashboard = () => {
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [task, setTask] = useState([]);
  const [taskId, setTaskId] = useState(1);
  const [allTasks, setAllTasks] = useState([]);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const database = getDatabase(app);
  console.log(taskId)


  const createTask = (task) => {
    const db = getDatabase(app);
    set(ref(db, "tasks/"+ taskId), {task: {
      task: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate,}
    });
    setTaskId((taskId) => {return(taskId+1)});
  };

  const getTask = () => {
    const db = getDatabase(app);
    const getAllTasks = ref(db, "tasks/");
    const response = onValue(getAllTasks, async (snapshot) => {
      const data = await snapshot.val();
      return data;
      // console.log(data);
    });
    return response;
  };

  const handleLogout = async () => {
    setError("");
    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Failed to log out");
    }
  };

  const handleSubmit = async (event) => {
    // event.preventDefault();
    const newTask = {
      title: title,
      description: description,
      status: status,
      dueDate: dueDate,
    };
    createTask(newTask);
    setTask(newTask);
  };

  useEffect(() => {
    const db = getDatabase(app);
    const getAllTasks = ref(db, "tasks/");
    onValue(getAllTasks, async (snapshot) => {
      setAllTasks(snapshot.val());
    });
  }, []);

  // useEffect(() => {
  //   const db = getDatabase(app);
  //   const getAllTasks = ref(db, "tasks/");
  //   onValue(getAllTasks, async (snapshot) => {
  //     setAllTasks([...allTasks, await snapshot.val()]);
  //   });
  // }, [allTasks]);

  // useEffect(() => {
  //   setAllTasks(getTask());
  // }, [task]);

  // useEffect(async () => {
  //   getTask();
  //   // console.log(getTask())
  //   // setAllTasks(getTask());
  // }, []);

  // console.log("alltasks", allTasks);

  return (
    <div className="container">
      <Card className="left">
        <Card.Body>
          <Card.Text>{allTasks.task}</Card.Text>
          <Card.Text>{allTasks.description}</Card.Text>
          <Card.Text>{allTasks.status}</Card.Text>
          <Card.Text>{allTasks.dueDate}</Card.Text>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                onChange={(event) => {
                  setTitle(event.target.value);
                }}
                type="text"
                placeholder="Work on lighthall challenge 2"
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
                type="text"
                placeholder="Implement user authentication"
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Check // prettier-ignore
                onChange={(event) => {
                  setStatus(event.target.value);
                }}
                type="radio"
                id={`default-radio`}
                label={`Incomplete`}
                name="group1"
                required
              />
              <Form.Check // prettier-ignore
                onChange={(event) => {
                  setStatus(event.target.value);
                }}
                type="radio"
                id={`default-radio`}
                label={`In Progress`}
                name="group1"
                required
              />
              <Form.Check // prettier-ignore
                onChange={(event) => {
                  setStatus(event.target.value);
                }}
                type="radio"
                id={`default-radio`}
                label={`Complete`}
                name="group1"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                onChange={(event) => {
                  setDueDate(event.target.value);
                }}
                type="date"
                placeholder=""
                required
              ></Form.Control>
            </Form.Group>
            <Button type="submit">Add Task</Button>
          </Form>
        </Card.Body>
        {/* <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong>
          {currentUser.email}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body> */}
        <div className="w-100 text-center mt-2">
          <Button variant="link" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
