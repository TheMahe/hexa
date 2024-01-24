let session = new Session();
session_id = session.getSession();
api_url = "https://659c3020d565feee2dac9c63.mockapi.io";

if (session_id !== "") {
  async function populateUserData() {
    let user = new User();
    user = await user.get(session_id);

    document.querySelector("#username").textContent = user.username;
    document.querySelector("#email").textContent = user.email;
    document.querySelector(".profile").src = user.profileImageUrl; // Set the profile image source

    document.querySelector("#korisnicko_ime").value = user.username;
    document.querySelector("#edit_email").value = user.email;
    document.querySelector("#profileImageUrlInput").value =
      user.profileImageUrl;
  }

  populateUserData();
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
        </div>
        
        ` + html;
  }

  createPost();
});

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
              <div class="post-comments">
                  <form>
                      <input placeholder="Napisi Komentar..." type="text">
                      <button onclick="commentPostSubmit(event)">Comment</button>
                  </form>
                  ${commentsHtml}
              </div>
          </div>`;

      let postWrapper = document.querySelector("#allPostsWrapper");
      postWrapper.insertAdjacentHTML("afterbegin", newPostHtml);

      const postElement = document.querySelector(`[data-post_id="${post.id}"]`); // Define postElement
      const likeBtn = postElement.querySelector(".like-btn");
      const hasLiked =
        sessionStorage.getItem(`likedPost_${post.id}`) === "liked";
      likeBtn.classList.toggle("liked", hasLiked);
    }
  } catch (error) {
    console.error("Error fetching and rendering posts:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // This code will run after the document is fully loaded
  getAllPosts();

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
    const userId = getUserId(); // Call getUserId to get the current user's ID

    // Fetch the post object
    const post = await fetchPostById(postId);

    // Check if the user has liked the post
    const liked = !hasUserLikedPost(post, userId);

    const updatedPost = await toggleLikeStatus(postId, userId, liked);

    // Update session storage with the new like status and count
    sessionStorage.setItem(`likedPost_${postId}`, liked ? "liked" : "");
    sessionStorage.setItem(`likeCount_${postId}`, updatedPost.likes.length);

    const postElement = document.querySelector(`[data-post_id="${postId}"]`);
    if (!postElement) {
      console.error("Post element not found.");
      return;
    }

    const likeBtn = postElement.querySelector(".like-btn");
    const likeCountSpan = likeBtn.querySelector("span");

    // Update the UI with the new like count and status
    likeCountSpan.innerText = updatedPost.likes.length;
    likeBtn.classList.toggle("liked", liked);
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
