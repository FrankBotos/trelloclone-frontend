import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/userContext";
import DashBoard from "./dashBoard";

export default function Login() {
  const { setUserC } = useContext(UserContext);

  const [auth, setAuth] = useState(
    false || window.localStorage.getItem("auth") === "true"
  );
  const [token, setToken] = useState("");

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userCred) => {
      if (userCred) {
        setAuth(true);
        window.localStorage.setItem("auth", "true");
        userCred.getIdToken().then((token) => {

          //Note: The google token refreshes after approximately 1 hour, meaning it cannot be reliably used to track kanban boards
          //Instead making use of the provider uid, and using that as a "token"
          //setToken(token);
          token = userCred._delegate.uid;
          setToken(userCred._delegate.uid);

          var tempContext = {
            //saving some of this info in context, for later use throughout app
            id: token,
            name: userCred.displayName,
          };
          setUserC(tempContext);
        });
      } else {
        setAuth(false);
        window.localStorage.setItem("auth", "false");
        var tempContext = {
          //saving some of this info in context, for later use throughout app
          id: null,
          name: null,
          mykanbans: [],
        };
        setUserC(tempContext);
      }
    });
  }, [setUserC]);

  const loginWithGoogle = () => {
    firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((userCred) => {
        if (userCred) {
          setAuth(true);
          window.localStorage.setItem("auth", "true");
        }
      });
  };

  const logoutWithGoogle = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        console.log("Successfully logged out!");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <div>
      {auth ? (
        <div>
          <DashBoard token={token} />
          <button
            className="text-xl bg-slate-200 hover:bg-slate-300 rounded-xl p-4 m-4"
            onClick={logoutWithGoogle}
          >
            Log Out
          </button>
        </div>
      ) : (
        <div className="w-3/5 mx-auto bg-slate-50 shadow-lg rounded-xl py-24">
          <div className="text-3xl p-8">
            Welcome to TrelloClone! Please Log In to get started!
          </div>
          <button
            className="text-xl bg-slate-200 hover:bg-slate-300 rounded-xl p-4"
            onClick={loginWithGoogle}
          >
            Log In with Google
          </button>
        </div>        
      )}
    </div>
  );
}
