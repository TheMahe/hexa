
import { auth, db, storage } from './firebaseConfig';



let session = new Session();
let session_id = session.getSession();
let form = document.querySelector('.comment-form');

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
      let user = new User();
      user.delete(session_id);
      let session = new Session();
      session.destroySession();
      window.location.href = "/";
    });

document.querySelector("#postForm").addEventListener("submit", function (e) {
  e.preventDefault();

  async function createPost() {
    let post = new Post();
    post.title = document.querySelector("#post_title").value;
    post.content = document.querySelector("#post_content").value;
    post.user_id = session_id;
    await post.create();
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
    const { postId } = comment;
    if (!obj[postId]) {
      obj[postId] = [];
    }
    obj[postId].push(comment);
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
    const postId = e.target.closest(".single-post").getAttribute("data-post_id");
    const post = new Post();
    await post.like(postId);
  }

  // Handle delete comment event
  if (e.target.matches(".delete-comment-btn")) {
    const commentId = e.target.closest(".comment").getAttribute("data-comment_id");
    const comment = new Comment();
    await comment.delete(commentId);
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
    const posts = await fetchAllPosts();

    // Render posts
    const allPostsWrapper = document.querySelector("#allPostsWrapper");
    allPostsWrapper.innerHTML = ""; // Clear the posts wrapper

    for (const post of posts) {
      const user = usersById[post.user_id];
      const comments = commentsByPostId[post.id] || [];

      // Render the post
      const postElement = document.createElement("div");
      postElement.classList.add("single-post");
      postElement.setAttribute("data-post_id", post.id);
      postElement.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.content}</p>
        <p>Posted by: ${user.username}</p>
        <button class="like-btn">Like</button>
        <div class="post-comments">
          ${comments.map(comment => `
            <div class="comment" data-comment_id="${comment.id}">
              <p>${comment.content}</p>
              <p>Commented by: ${usersById[comment.user_id].username}</p>
              <button class="delete-comment-btn">Delete Comment</button>
            </div>
          `).join("")}
        </div>
        <form class="comment-form">
          <input type="text" placeholder="Write a comment..." required>
          <button type="submit">Post Comment</button>
        </form>
      `;
      allPostsWrapper.appendChild(postElement);
    }
  } catch (error) {
    console.error("Error getting all posts:", error);
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
    const liked = sessionStorage.getItem(`liked-${postId}`);
    if (liked) {
      btn.textContent = "Unlike";
    } else {
      btn.textContent = "Like";
    }
  });

  form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const postId = e.target.closest(".single-post").getAttribute("data-post_id");
    const content = e.target.querySelector("input").value;

    const comment = new Comment();
    comment.post_id = postId;
    comment.user_id = session_id;
    comment.content = content;
    await comment.create();

    // Clear the input field
    e.target.querySelector("input").value = "";

    // Refresh the posts
    await getAllPosts();
  }) });