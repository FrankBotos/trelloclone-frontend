import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/usercontext';
import DashBoard from './dashboard';

export default function Login(){

	const { userC, setUserC } = useContext(UserContext);

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

					var tempContext = {//saving some of this info in context, for later use throughout app
						id: token,
						name: userCred.displayName
					}
					setUserC(tempContext);

				});
			} else {
				setAuth(false);
				window.localStorage.setItem('auth', 'false');
				var tempContext = {//saving some of this info in context, for later use throughout app
					id: null,
					name: null,
					mykanbans: []
				}
				setUserC(tempContext);
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

		
		<div>
			{auth ? (

				<div>
				<DashBoard token={token}/>
				<button className="text-xl bg-slate-200 rounded-xl p-4 m-4" onClick={logoutWithGoogle}>Log Out</button>
				</div>

			) : (
				<div className='w-4/5 mx-auto my-16 p-16 bg-slate-50 shadow-lg rounded-xl'>
				<div className="text-3xl p-8">Welcome to TrelloClone! Please Log In to get started!</div>
				<button className="text-xl bg-slate-200 rounded-xl p-4" onClick={loginWithGoogle}>Log In with Google</button>
				</div>
			)}
		</div>
		

	);


}