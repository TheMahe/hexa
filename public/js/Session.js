import { auth } from './firebaseConfig';
import { getAuth } from 'firebase/auth';


class Session {
  user_id = "";

  startSession(user_id) {
    this.user_id = user_id;
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, set the user_id
        this.user_id = user.uid;
      } else {
        // No user is signed in, clear the user_id
        this.user_id = "";
      }
    });
  }

  getSession() {
    return new Promise((resolve, reject) => {
      getAuth().onAuthStateChanged((user) => {
        // Use getAuth() to access the auth instance
        if (user) {
          resolve(user.uid);
        } else {
          resolve("");
        }
      });
    });
  }

  destroySession() {
    firebase.auth().signOut().then(() => {
      // Sign-out successful, clear the user_id
      this.user_id = "";
    }).catch((error) => {
      // An error happened during sign-out
      console.error("Error signing out:", error);
    });
  }
}

export default Session;