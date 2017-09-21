import Firebase from 'firebase'

const config = {};

var firebaseApp, db, auth, provider;
if(!firebaseApp && !Firebase.apps.length) {
	firebaseApp = Firebase.initializeApp(config);
}else {
	firebaseApp = Firebase.apps[0];
}

db		= firebaseApp.database();
auth	= firebaseApp.auth();
provider= new Firebase.auth.GoogleAuthProvider();

export default {firebaseApp, db, auth, provider}