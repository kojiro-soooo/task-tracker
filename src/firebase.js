import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getDatabase, ref, child, set, get, onValue } from "firebase/database";
// const firebase = require('firebase');

const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
});

const database = getDatabase(app);

export const createTask = (task) => {
  const db = getDatabase(app);
  set(ref(db, "tasks/"), {
    task: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate,
  });
};

export const getTask = async () => {
  const db = getDatabase(app);
  const getAllTasks = ref(db, "tasks/");
  const response = await onValue(getAllTasks, (snapshot) => {
    const data =  snapshot.val();
    // return data;
    console.log(data);
  });
};

//   const dbRef = ref(getDatabase(app));
//   await get(child(dbRef, "tasks/"))
//     .then((snapshot) => {
//       if (snapshot.exists()) {
//         return snapshot.val();
//       } else {
//         console.log("no data available");
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

// createTask(userid, name, email, image);
// getTask();

// const post = async (object) => {
//   await database
//     .ref("https://auth-development-158de-default-rtdb.firebaseio.com/")
//     .set(object, function (error) {
//       if (error) {
//         console.log("Failed: " + error);
//       } else {
//         console.log("success");
//       }
//     });
// };

// post(test);

// const get = async () => {
//   await database
//     .ref("https://auth-development-158de-default-rtdb.firebaseio.com/")
//     .once("value")
//     .then(function (snapshot) {
//       console.og(snapshot.val());
//     });
// };

// get();

export const auth = app.auth();
export default app;
