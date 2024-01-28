class Comment {
  post_id = "";
  user_id = "";
  content = "";
  api_url = "https://659c3020d565feee2dac9c63.mockapi.io";

  async create() {
    try {
      let data = {
        post_id: this.post_id,
        user_id: this.user_id,
        content: this.content,
      };

      let response = await fetch(this.api_url + "/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create comment");
      }

      let createdComment = await response.json();

      // Assuming the API returns the created comment object with user_id
      return createdComment;
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  }

  async delete(commentId, userId) {
    try {
      const response = await fetch(`${this.api_url}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Add any required headers (e.g., authorization token) here
        },
      });

      if (!response.ok) {
        // Handle non-200 status codes
        const errorMessage = await response.text();
        console.error(
          `Failed to delete comment: ${response.status} - ${errorMessage}`
        );
        return false;
      }

      // Comment deleted successfully
      return true;
    } catch (error) {
      // Handle network errors or exceptions
      console.error("Error deleting comment:", error);
      return false;
    }
  }

  async get(post_id) {
    let api_url = this.api_url + "/comments";

    const response = await fetch(api_url);
    const data = await response.json();
    let post_comments = [];

    let i = 0;
    data.forEach((item) => {
      if (item.post_id == post_id) {
        post_comments[i] = item;
        i++;
      }
    });
    return post_comments;
  }

  async getUserInfo(userId) {
    try {
      const response = await fetch(`${this.api_url}/users/${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user with ID ${userId}`);
      }
      const user = await response.json();
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }
}
