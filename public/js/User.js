import { auth, db } from './firebaseConfig';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { setDoc } from 'firebase/firestore';
class User {
  constructor() {
    this.user_id = "";
    this.username = "";
    this.email = "";
    this.password = "";
    this.profileImageUrl = "";
  }

  async create() {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
      const user = userCredential.user;
      this.user_id = user.uid;
      await setDoc(doc(getFirestore(), 'users', this.user_id), {
        username: this.username,
        email: this.email,
        profileImageUrl: this.profileImageUrl
      });
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  async getAll() {
    try {
      const snapshot = await firebase.firestore().collection('users').get();
      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error("Error getting users:", error);
      throw error;
    }
  }

  async get(user_id) {
    try {
      const doc = await firebase.firestore().collection('users').doc(user_id).get();
      if (doc.exists) {
        return doc.data();
      } else {
        throw new Error('No such user!');
      }
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  async edit() {
    try {
      await firebase.firestore().collection('users').doc(this.user_id).update({
        username: this.username,
        email: this.email,
        profileImageUrl: this.profileImageUrl
      });
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async login() {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(this.email, this.password);
      return userCredential.user;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  async delete() {
    try {
      await firebase.firestore().collection('users').doc(this.user_id).delete();
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}

export default User;