let session = new Session();
session_id = session.getSession();
api_url = "https://659c3020d565feee2dac9c63.mockapi.io";

const DEFAULT_PROFILE_IMAGE_URL =
    "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg";

async function populateUserData() {
  let user = new User();
  user = await user.get(session_id);

  document.querySelector("#username").textContent = user.username;
  document.querySelector("#email").textContent = user.email;

  const profileImage = document.querySelector(".profile");
  const profileImageUrl = user.profileImageUrl.trim(); // Trim any leading/trailing spaces

  // Create a new Image element
  const img = new Image();
  img.onload = function () {
    // Set the profile image source once it's loaded
    profileImage.src = profileImageUrl || DEFAULT_PROFILE_IMAGE_URL;
  };
  img.onerror = function () {
    // If the image fails to load, set a default image
    profileImage.src = DEFAULT_PROFILE_IMAGE_URL;
  };
  img.src = profileImageUrl; // Set the src attribute of the Image element
  img.alt = "Profile Picture"; // Set alt attribute for accessibility

  document.querySelector("#korisnicko_ime").value = user.username;
  document.querySelector("#edit_email").value = user.email;
  document.querySelector("#profileImageUrlInput").value =
      profileImageUrl || DEFAULT_PROFILE_IMAGE_URL; // Set the default value for the profile image URL input
}

if (session_id !== "") {
  populateUserData(); // Call populateUserData function
} else {
  window.location.href = "/";
}

document.querySelector("#logout").addEventListener("click", function (e) {
  e.preventDefault();
  let session = new Session();
  session.destroySession();
  window.location.href = "/";
});

document.querySelector("#editAccount").addEventListener("click", function (e) {
  e.preventDefault();
  document.querySelector(".edit-acc-modal").style.display = "block";
});

document
    .querySelector("#close-acc-modal")
    .addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(".edit-acc-modal").style.display = "none";
    });

document.querySelector("#editForm").addEventListener("submit", function (e) {
  e.preventDefault();
  let user = new User();
  user.username = document.querySelector("#korisnicko_ime").value;
  user.email = document.querySelector("#edit_email").value;
  user.profileImageUrl = document.getElementById("profileImageUrlInput").value; // Get the new image URL from the form
  user.edit();

  // Replace the profile image src with the new image URL
  document.querySelector(".profile").src = user.profileImageUrl;
});

document
    .querySelector("#deleteProfile")
    .addEventListener("click", function (e) {
      e.preventDefault();

      let text = "Da li ste sigurni da želite da obrišete profil?";

      if (confirm(text)) {
        let user = new User(session_id);
        user.delete();
      }
    });

document.querySelector("#postForm").addEventListener("submit", function (e) {
  e.preventDefault();

  async function createPost() {

    let content = document.querySelector("#postContent").value;
    document.querySelector("#postContent").value = "";
    let post = new Post();
    post.post_content = content;
    post = await post.create();

    sessionStorage.removeItem(`likedPost_${post.id}`);


    let current_user = new User();
    current_user = await current_user.get(session_id);

    let html = document.querySelector("#allPostsWrapper").innerHTML;

    let delete_post_html = "";
    if (session_id == post.user_id) {
      delete_post_html = `<button class="remove-btn" onclick="RemoveMyPost(this)">Remove</button>`;
    }

    document.querySelector("#allPostsWrapper").innerHTML =
        `<div class="single-post" data-post_id="${post.id}">
         <div class="post-content">${post.content}</div>

         <div class="post-actions">
         <p><b>Autor:</b> ${current_user.username}</p>
         <img src="${current_user.profileImageUrl}" alt="Profile Image" class="profile-image">
         <div>
         <button onclick="likePost(this)" class="likePostJS like-btn"><span>${post.likes}</span> Likes</button>
         <button class="comment-btn" onclick="commentPost(this)">Comments</button>
             ${delete_post_html}
         </div>
     </div>


         <div class="post-comments">
         <form>
           <input placeholder="Napisi Komentar..." type="text">
           <button onclick="commentPostSubmit(event)">Comment</button>
         </form>
      </div>
        </div>

        ` + html;
  }

  createPost();
});

// Fetch all users and comments at once
const fetchAllUsersAndComments = async () => {
  const users = await new User().getAll();
  const comments = await new Comment().getAll();

  // Convert the arrays to objects for faster lookup
  const usersById = users.reduce((obj, user) => ({ ...obj, [user.id]: user }), {});
  const commentsByPostId = comments.reduce((obj, comment) => {
    if (!obj[comment.post_id]) {
      obj[comment.post_id] = [];
    }
    obj[comment.post_id].push(comment);
    return obj;
  }, {});

  return { usersById, commentsByPostId };
};

// Fetch all posts at once
const fetchAllPosts = async () => {
  const posts = await new Post().getAll();
  return posts;
};

// Use event delegation to handle like and delete comment events
document.querySelector("#allPostsWrapper").addEventListener("click", async function(e) {
  // Handle like event
  if (e.target.matches(".like-btn")) {
    const btn = e.target;
    likePost(btn);
  }

  // Handle delete comment event
  if (e.target.matches(".delete-comment-btn")) {
    const commentId = e.target.getAttribute("data-comment-id");
    const deleted = await deleteComment(commentId);
    if (deleted) {
      e.target.closest(".single-comment").remove();
    } else {
      console.error("Failed to delete comment.");
    }
  }
});

// Clear sessionStorage when a new user logs in
if (session_id !== "" && session_id !== sessionStorage.getItem("lastSessionId")) {
  sessionStorage.clear();
  sessionStorage.setItem("lastSessionId", session_id);
}

// Optimize getAllPosts function
async function getAllPosts() {
  try {
    const { usersById, commentsByPostId } = await fetchAllUsersAndComments();
    const all_posts = await fetchAllPosts();

    let html = "";

    for (const post of all_posts) {
      const user = usersById[post.user_id];
      const comments = commentsByPostId[post.id] || [];

      // Fetch user info for each comment
      const commentsHtml = comments
        .map(
          (comment) =>
            `<div class="single-comment">
              <p><b>${usersById[comment.user_id].username}</b>: ${comment.content}</p>
              <button class="delete-comment-btn" data-comment-id="${comment.id}">Delete</button>
            </div>`
        )
        .join("");

      // Check if the current user has liked the post
      const hasLiked = Array.isArray(post.likes) && post.likes.includes(session_id);

      // Define main_post_el within the loop
      html += `<div class="single-post" data-post_id="${post.id}">
        <div class="post-content">${post.content}</div>
        <div class="post-actions">
          <p><b>Autor:</b> ${user.username}</p>
          <img src="${user.profileImageUrl}" alt="Profile Image" class="profile-image">
          <div>
            <button onclick="likePost(this)" class="likePostJS like-btn ${hasLiked ? 'liked' : ''}"><span>${post.likes.length}</span> Likes</button>
            <button class="comment-btn" onclick="commentPost(this)">Comments</button>
            ${session_id == post.user_id ? '<button class="remove-btn" onclick="RemoveMyPost(this)">Remove</button>' : ''}
          </div>
        </div>
        <div class="post-comments">
          <form>
            <input placeholder="Napisi Komentar..." type="text">
            <button onclick="commentPostSubmit(event)">Comment</button>
          </form>
          ${commentsHtml}
        </div>
      </div>`;
    }

    document.querySelector("#allPostsWrapper").innerHTML = html;
  } catch (error) {
    console.error("Error fetching and rendering posts:", error);
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  populateUserData();

  // This code will run after the document is fully loaded
  await getAllPosts();

  // Update like buttons based on stored liked status
  const likeBtns = document.querySelectorAll(".like-btn");
  likeBtns.forEach((btn) => {
    const postId = btn.closest(".single-post").getAttribute("data-post_id");
    const hasLiked = sessionStorage.getItem(`likedPost_${postId}`) === "liked";
    const likeCount = sessionStorage.getItem(`likeCount_${postId}`);

    btn.classList.toggle("liked", hasLiked);
    btn.querySelector("span").innerText = likeCount || 0; // Display the like count or default to 0
  });
});

const likePost = async (btn) => {
  try {
    const postId = btn.closest(".single-post").getAttribute("data-post_id");
    const userId = session_id; // Get the current user's ID

    // Fetch the post object
    const post = new Post();
    const postData = await post.get(postId);

    // Check if the user has liked the post
    const liked = Array.isArray(postData.likes) && postData.likes.includes(userId);

    // Toggle the like status
    const updatedPost = await post.like(postId, userId, !liked);

    // Update the UI with the new like count and status
    btn.querySelector("span").innerText = updatedPost.likes.length;
    btn.classList.toggle("liked", !liked);
  } catch (error) {
    console.error("Error liking post:", error);
  }
};

const commentPostSubmit = async (e) => {
  e.preventDefault();

  let btn = e.target;
  btn.setAttribute("disabled", "true");

  let main_post_el = btn.closest(".single-post");
  let post_id = main_post_el.getAttribute("data-post_id");

  let comment_value = main_post_el.querySelector("input").value;

  main_post_el.querySelector("input").value = "";

  let comment = new Comment();
  comment.content = comment_value;
  comment.user_id = session_id;
  comment.post_id = post_id;

  try {
    // Create the comment and get the comment object with user_id
    comment = await comment.create();

    if (!comment || !comment.user_id) {
      throw new Error("Failed to create comment or user_id is missing");
    }

    // Fetch the user information for the comment's user_id
    const user = await new User().get(comment.user_id);

    // Append the new comment to the post's comments section with user info
    main_post_el.querySelector(".post-comments").innerHTML += `
      <div class="single-comment">
        <b>${user.username}:</b> ${comment.content}
        <button class="delete-comment-btn" data-comment-id="${comment.id}">Delete</button>
      </div>
    `;
  } catch (error) {
    console.error("Error creating or displaying comment:", error);
  }
};

const RemoveMyPost = (btn) => {
  let post_id = btn.closest(".single-post").getAttribute("data-post_id");

  btn.closest(".single-post").remove();

  let post = new Post();
  post.delete(post_id);
};

const commentPost = (btn) => {
  let main_post_el = btn.closest(".single-post");
  let post_id = main_post_el.getAttribute("data-post_id");
  let commentsSection = main_post_el.querySelector(".post-comments");

  if (
      commentsSection.style.display === "none" ||
      commentsSection.style.display === ""
  ) {
    commentsSection.style.display = "block";
  } else {
    commentsSection.style.display = "none";
  }
};

// Modify the deleteComment function to handle deleting comments
const deleteComment = async (commentId) => {
  try {
    const comment = new Comment();
    const deleted = await comment.delete(commentId);
    return deleted; // Return true if deletion is successful
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error; // Throw an error if deletion fails
  }
};