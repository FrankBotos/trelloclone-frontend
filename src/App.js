import './App.css';
import Login from './components/login';
import { UserProvider } from './context/usercontext';

function App() {


	return (

		<UserProvider>
		<div className="App">
			<Login/>
		</div>
		</UserProvider>

	);
}


export default App;
