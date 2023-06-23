import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";

// create context
const AuthContext = React.createContext();

// returns context values
export function useAuth() {
  return useContext(AuthContext);
}

// a function that returns the defined context's provider
// the provider is where we define the context values that will be passed down to child components
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  // true by default because on page load, we're waiting for verification of whether a user is logged in or not
  const [loading, setLoading] = useState(true);
  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // these signup and login functions are the only ones that need to be modified when working with services other than firebase
  function signup(email, password) {
    // this is a firebase specific function which returns a promise based on whether user creation was successful or not
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email) {
    return auth.currentUser.updateEmail(email)
  }

  function updatePassword(password){
    return auth.currentUser.updatePassword(password)
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // only run once when component is mounted
  useEffect(() => {
    // returns a method that when called, unsubscribes from the onAuthStateChanged function which is an observer of the user's log in state
    const unsubsrcibe = auth.onAuthStateChanged((user) => {
      // once we know the user is logged in:
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubsrcibe;
  }, []);

  console.log(children)

  return (
    <AuthContext.Provider value={value}>
      {/* if loading, don't render children */}
      {!loading && children}
    </AuthContext.Provider>
  );
}
