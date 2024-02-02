import { storage } from './firebase';


class User {
  constructor() {
    this.user_id = "";
    this.username = "";
    this.email = "";
    this.password = "";
    this.api_url = "https://659c3020d565feee2dac9c63.mockapi.io";
  }

  async create() {
    const data = {
      username: this.username,
      email: this.email,
      password: this.password,
      profileImageUrl:
        "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
    };

    try {
      const response = await fetch(`${this.api_url}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      const session = new Session();
      session.user_id = responseData.id;
      sessionStorage.removeItem("likedPosts");
      session.startSession();
      window.location.href = "hexa.html";
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

  async get(user_id) {
    const api_url = `${this.api_url}/users/${user_id}`;

    try {
      const response = await fetch(api_url);
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error getting user:", error);
    }
  }


  async edit() {
    try {
      const session = new Session();
      const session_id = session.getSession();

      // Get the file from the input field
      const imageFile = document.getElementById('profileImageInput').files[0];

      // Create a storage reference
      const storageRef = storage.ref();
      const imageRef = storageRef.child(`images/${imageFile.name}`);

      // Upload the image to Firebase
      const snapshot = await imageRef.put(imageFile);
      const downloadURL = await snapshot.ref.getDownloadURL();

      // Use the returned URL from Firebase as the profile image URL
      this.profileImageUrl = downloadURL;

      const data = {
        username: this.username,
        email: this.email,
        profileImageUrl: this.profileImageUrl,
      };

      const response = await fetch(`${this.api_url}/users/${session_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      window.location.href = 'hexa.html';
    } catch (error) {
      console.error('Error editing user:', error);
    }
  }

  async login() {
    try {
      const response = await fetch(`${this.api_url}/users`);
      const data = await response.json();

      let login_successful = false;

      data.forEach((db_user) => {
        if (
          db_user.email === this.email &&
          db_user.password === this.password
        ) {
          const session = new Session();
          session.user_id = db_user.id;
          session.startSession();
          login_successful = true;
          window.location.href = "hexa.html";
        }
      });

      if (!login_successful) {
        alert("Pogresan email ili lozinka");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  }

  async delete() {
    try {
      const session = new Session();
      const session_id = session.getSession();

      await fetch(`${this.api_url}/users/${session_id}`, {
        method: "DELETE",
      });

      session.destroySession();
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
}
