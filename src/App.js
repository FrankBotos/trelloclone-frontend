import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import { useEffect, useState } from 'react';
import KanbanBoard from './components/kanbanboard';

function App() {
	const [auth, setAuth] = useState(
		false || window.localStorage.getItem('auth') === 'true'
	);
	const [token, setToken] = useState('');

	useEffect(() => {
		firebase.auth().onAuthStateChanged((userCred) => {
			if (userCred) {
				setAuth(true);
				window.localStorage.setItem('auth', 'true');
				userCred.getIdToken().then((token) => {
					setToken(token);
				});
			} else {
				setAuth(false);
				window.localStorage.setItem('auth', 'false');
			}
		});
	}, []);

	const loginWithGoogle = () => {
		firebase
			.auth()
			.signInWithPopup(new firebase.auth.GoogleAuthProvider())
			.then((userCred) => {
				if (userCred) {
					setAuth(true);
					window.localStorage.setItem('auth', 'true');
				}
			});
	};

	const logoutWithGoogle = () => {
		firebase
		.auth()
		.signOut()
		.then(() => {
			// Sign-out successful.
			console.log('Successfully logged out!')
		  }).catch((error) => {
			// An error happened.
		  });
	}

	return (
		<div className="App">
			{auth ? (

				<div>
				<KanbanBoard token={token} />
				<button onClick={logoutWithGoogle}>Log Out</button>
				</div>

			) : (
				<button onClick={loginWithGoogle}>Login with Google</button>
			)}
		</div>
	);
}


export default App;
