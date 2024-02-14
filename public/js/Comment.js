
import { db } from './firebaseConfig';


class Comment {
  post_id = "";
  user_id = "";
  content = "";

  async create() {
    try {
      let data = {
        post_id: this.post_id,
        user_id: this.user_id,
        content: this.content,
      };

      const docRef = await firebase.firestore().collection('comments').add(data);
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  }

  async getAll() {
    try {
      const snapshot = await firebase.firestore().collection('comments').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching all comments:", error);
      throw error;
    }
  }

  async delete(commentId) {
    try {
      await firebase.firestore().collection('comments').doc(commentId).delete();
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  }

  async get(post_id) {
    try {
      const snapshot = await firebase.firestore().collection('comments').where('post_id', '==', post_id).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error getting comments:", error);
      throw error;
    }
  }
}

export default Comment;