class Post {
  post_id = "";
  post_content = "";
  user_id = "";
  likes = "";
  created_at = "";
  api_url = "https://659c3020d565feee2dac9c63.mockapi.io";

  constructor() {
    this.likes = []; // Initialize likes as an empty array
  }

  async get(postId) {
    const response = await fetch(`${this.api_url}/posts/${postId}`);
    const postData = await response.json();
    return postData;
  }

  async create() {
    let session = new Session();
    let user_id = session.getSession();

    let data = {
      content: this.post_content,
      user_id: user_id,
      likes: 0,
    };

    this.created_at = new Date();

    data = JSON.stringify(data);

    let response = await fetch(this.api_url + "/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    data = await response.json();
    return data;
  }

  async getAllPosts() {
    let response = await fetch(this.api_url + "/posts");
    let data = await response.json();
    return data;
  }

  async like(postId, userId, liked) {
    let post = await this.get(postId);

    // Ensure that post.likes is an array
    if (!Array.isArray(post.likes)) {
      post.likes = [];
    }

    if (liked) {
      // Add user ID to the likes array if not already present
      if (!post.likes.includes(userId)) {
        post.likes.push(userId);
      }
    } else {
      // Remove user ID from the likes array
      post.likes = post.likes.filter((id) => id !== userId);
    }

    // Update the post with the new like status
    const response = await fetch(`${this.api_url}/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });

    const updatedPost = await response.json();
    return updatedPost;
  }

  delete(post_id) {
    fetch(this.api_url + "/posts/" + post_id, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        alert("post obrisan");
      });
  }
}
