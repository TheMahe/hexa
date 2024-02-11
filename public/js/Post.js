import { db, storage } from './firebaseConfig';

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
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(this.email, this.password);
      const user = userCredential.user;
      this.user_id = user.uid;
      await firebase.firestore().collection('users').doc(this.user_id).set({
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
      console.error("Error getting all users:", error);
      throw error;
    }
  }

  async get(user_id) {
    try {
      const doc = await firebase.firestore().collection('users').doc(user_id).get();
      if (doc.exists) {
        return doc.data();
      } else {
        throw new Error("No such user!");
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
      console.error("Error editing user:", error);
      throw error;
    }
  }

  async login() {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(this.email, this.password);
      const user = userCredential.user;
      this.user_id = user.uid;
      return user;
    } catch (error) {
      console.error("Error logging in user:", error);
      throw error;
    }
  }

  async delete() {
    try {
      await firebase.firestore().collection('users').doc(this.user_id).delete();
      const user = firebase.auth().currentUser;
      await user.delete();
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}

export default User;