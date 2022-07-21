import "./App.css";
import Login from "./components/logIn";
import { UserProvider } from "./context/userContext";

function App() {
  return (
    <UserProvider>
      <div className="App h-screen bg-gradient-to-r from-violet-400 to-pink-300">
        <Login/>
      </div>
    </UserProvider>
  );
}

export default App;
