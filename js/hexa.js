// Initialize session and API URL
let session = new Session();
let session_id = session.getSession();
let api_url = "https://659c3020d565feee2dac9c63.mockapi.io";
const DEFAULT_PROFILE_IMAGE_URL =
  "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg";

// Populate user data function
async function populateUserData() {
  let user = new User();
  user = await user.get(session_id);

  document.querySelector("#username").textContent = user.username;
  document.querySelector("#email").textContent = user.email;

  const profileImage = document.querySelector(".profile");
  const profileImageUrl = user.profileImageUrl
    ? user.profileImageUrl.trim()
    : DEFAULT_PROFILE_IMAGE_URL;

  const img = new Image();
  img.onload = function () {
    profileImage.setAttribute(
      "src",
      profileImageUrl || DEFAULT_PROFILE_IMAGE_URL
    );
  };
  img.onerror = function () {
    profileImage.setAttribute("src", DEFAULT_PROFILE_IMAGE_URL);
  };
  img.src = profileImageUrl;
  img.alt = "Profile Picture";

  document.querySelector("#korisnicko_ime").value = user.username;
  document.querySelector("#edit_email").value = user.email;
  document.querySelector("#profileImageUrlInput").value =
    profileImageUrl || DEFAULT_PROFILE_IMAGE_URL;
}

// Check if session is active and populate user data
if (session_id !== "") {
  populateUserData();
} else {
  window.location.href = "/";
}

// Event listener for logout button
document.querySelector("#logout").addEventListener("click", function (e) {
  e.preventDefault();
  let session = new Session();
  session.destroySession();
  window.location.href = "/";
});

// Event listener for edit account button
document.querySelector("#editAccount").addEventListener("click", function (e) {
  e.preventDefault();
  document.querySelector(".edit-acc-modal").style.display = "block";
});

// Event listener for close modal button
document
  .querySelector("#close-acc-modal")
  .addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(".edit-acc-modal").style.display = "none";
  });

// Event listener for edit form submission
document.querySelector("#editForm").addEventListener("submit", function (e) {
  e.preventDefault();
  let user = new User();
  user.username = document.querySelector("#korisnicko_ime").value;
  user.email = document.querySelector("#edit_email").value;
  user.profileImageUrl = document.getElementById("profileImageUrlInput").value;
  user.edit();
  document.querySelector(".profile").src = user.profileImageUrl;
});

// Event listener for delete profile button
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

// Event listener for post form submission
document.querySelector("#postForm").addEventListener("submit", function (e) {
  e.preventDefault();
  async function createPost() {
    let content = document.querySelector("#postContent").value;
    document.querySelector("#postContent").value = "";
    let post = new Post();
    post.post_content = content;
    post = await post.create();
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
    </div>` + html;
  }
  createPost();
});

// Function to fetch and render all posts
async function getAllPosts() {
  try {
    let all_posts = new Post();
    all_posts = await all_posts.getAllPosts();

    for (const post of all_posts) {
      let user = await new User().get(post.user_id);
      let comments = await new Comment().get(post.id);

      // Fetch user info for each comment
      const commentsWithUserInfo = await Promise.all(
        comments.map(async (comment) => {
          const userInfo = await new User().get(comment.user_id);
          return { comment, userInfo };
        })
      );

      let delete_post_html = "";
      if (session_id == post.user_id) {
        delete_post_html = `<button class="remove-btn" onclick="RemoveMyPost(this)">Remove</button>`;
      }

      // Construct comments HTML with user info
      const commentsHtml = commentsWithUserInfo
        .map(
          ({ comment, userInfo }) =>
            `<div class="single-comment">
            <b>${userInfo.username}:</b> ${comment.content}
           </div>`
        )
        .join("");

      // Construct the post HTML
      let newPostHtml = `<div class="single-post" data-post_id="${post.id}">
              <div class="post-content">${post.content}</div>
              <div class="post-actions">
                  <p><b>Autor:</b> ${user.username}</p>
                  <div>
                      <button onclick="likePost(this)" class="likePostJS like-btn"><span>${post.likes}</span> Likes</button>
                      <button class="comment-btn" onclick="commentPost(this)">Comments</button>
                      ${delete_post_html}
                  </div>
              </div>
              <div class="post-comments">${commentsHtml}</div>
          </div>`;

      document.querySelector("#allPostsWrapper").innerHTML += newPostHtml;
    }
  } catch (error) {
    console.error("Error fetching and rendering posts:", error);
  }
}

// Function to update like buttons based on stored liked status
function updateLikeButtons() {
  const likeButtons = document.querySelectorAll(".likePostJS");
  likeButtons.forEach(async (button) => {
    const postId = button.closest(".single-post").dataset.post_id;
    const isLiked = await isPostLiked(postId);
    if (isLiked) {
      button.classList.add("liked");
    }
  });
}

// Function to check if the user has liked a post
async function isPostLiked(postId) {
  try {
    const likedPosts = await new User().getLikedPosts(session_id);
    return likedPosts.includes(postId);
  } catch (error) {
    console.error("Error checking if post is liked:", error);
    return false;
  }
}

// Function to handle post likes
async function likePost(element) {
  try {
    const postId = element.closest(".single-post").dataset.post_id;
    const post = await new Post().get(postId);
    const isLiked = await isPostLiked(postId);

    if (isLiked) {
      // If already liked, unlike the post
      await post.unlike(session_id);
      element.classList.remove("liked");
      const likesSpan = element.querySelector("span");
      likesSpan.textContent = parseInt(likesSpan.textContent) - 1;
    } else {
      // If not liked, like the post
      await post.like(session_id);
      element.classList.add("liked");
      const likesSpan = element.querySelector("span");
      likesSpan.textContent = parseInt(likesSpan.textContent) + 1;
    }
  } catch (error) {
    console.error("Error liking post:", error);
  }
}

// Function to remove the user's own post
async function RemoveMyPost(element) {
  try {
    const postId = element.closest(".single-post").dataset.post_id;
    await new Post().remove(postId);
    element.closest(".single-post").remove();
  } catch (error) {
    console.error("Error removing post:", error);
  }
}

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
      </div>
    `;
  } catch (error) {
    console.error("Error creating or displaying comment:", error);
  }
};

window.onload = async function () {
  await getAllPosts();
  updateLikeButtons();
};

const toggleLikeStatus = async (postId, userId, liked) => {
  try {
    const post = new Post();
    const updatedPost = await post.like(postId, userId, liked);

    // Update the session's likedPosts array based on the like status
    const session = new Session();
    session.likedPosts = session.likedPosts || []; // Initialize session.likedPosts if it's undefined
    if (liked) {
      if (!session.likedPosts.includes(postId)) {
        session.likedPosts.push(postId);
      }
    } else {
      session.likedPosts = session.likedPosts.filter((id) => id !== postId);
    }

    // Store the updated likedPosts array back in the session
    sessionStorage.setItem("likedPosts", JSON.stringify(session.likedPosts));

    return updatedPost;
  } catch (error) {
    console.error("Error toggling like status:", error);
    throw error;
  }
};

const hasUserLikedPost = (post, userId) => {
  // Check if post.likes is defined and is an array before using includes
  return post.likes && Array.isArray(post.likes) && post.likes.includes(userId);
};

const getUserId = () => {
  const name = "user_id=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) == 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }

  return "";
};

// Define the fetchPostById function to handle fetching a post by ID
const fetchPostById = async (postId) => {
  try {
    console.log(`Fetching post with ID: ${postId}`);
    const response = await fetch(`${this.api_url}/posts/${postId}`);
    console.log(`Response status: ${response.status}`);
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(
        `Failed to fetch post: ${response.status} - ${errorMessage}`
      );
      throw new Error(
        `Failed to fetch post: ${response.status} - ${errorMessage}`
      );
    }
    const post = await response.json();
    console.log(`Fetched post:`, post);
    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

// Add event listeners for like buttons
document.querySelectorAll(".like-btn").forEach((btn) => {
  btn.addEventListener("click", () => likePost(btn));
});

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
