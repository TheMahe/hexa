let session = new Session();
session_id = session.getSession();

if(session_id !== "") {
    

    async function populateUserData() {
        let user = new User();
        user =  await user.get(session_id);

        document.querySelector('#username').innerHTML = user.username;
        document.querySelector('#email').innerHTML = user.email;

        document.querySelector('#korisnicko_ime').value = user.username;
        document.querySelector('#edit_email').value = user.email;
    }

    populateUserData()


} else {
    window.location.href = '/';
}

document.querySelector('#logout').addEventListener('click', function(e) {
    e.preventDefault();
    let session = new Session();
    session.destroySession();
    window.location.href = '/';
})

document.querySelector('#editAccount').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('.edit-acc-modal').style.display = 'block';
})

document.querySelector('#close-acc-modal').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('.edit-acc-modal').style.display = 'none';
})

document.querySelector('#editForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let user = new User();
    user.username = document.querySelector('#korisnicko_ime').value;
    user.email = document.querySelector('#edit_email').value;
    user.edit();
})

document.querySelector('#deleteProfile').addEventListener('click', function(e) {
    e.preventDefault();
    
    let text = 'Da li ste sigurni da želite da obrišete profil?';

    if(confirm(text)) {
        let user = new User(session_id);
        user.delete();
    }
})

document.querySelector('#postForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    async function createPost() {
        let content = document.querySelector('#postContent').value;
        document.querySelector('#postContent').value = "";
        let post = new Post();
        post.post_content = content;
        post = await post.create();
        
        let current_user = new User();
        current_user = await current_user.get(session_id);

        let html = document.querySelector('#allPostsWrapper').innerHTML;

        let delete_post_html = '';
        if(session_id == post.user_id) { 
          delete_post_html = `<button class="remove-btn" onclick="RemoveMyPost(this)">Remove</button>`;
        }

        document.querySelector('#allPostsWrapper').innerHTML = `<div class="single-post" data-post_id="${post.id}">
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
})

async function getAllPosts() {
    let all_posts = new Post();
    all_posts = await all_posts.getAllPosts();

    // Create a new array of promises for the user and comments fetching
    let promises = all_posts.map(async (post) => {
        let user = await new User().get(post.user_id);
        let comments = await new Comment().get(post.id);
        return { post, user, comments }; // Return an object with all the data needed
    });

    // Resolve all the promises before proceeding
    let postsWithUsersAndComments = await Promise.all(promises);

    // Now you can sort the posts after all promises have been resolved
    postsWithUsersAndComments.sort((a, b) => {
        // Assuming post object has a created_at date in ISO format
        return new Date(b.post.created_at) - new Date(a.post.created_at);
    });

    // Now that we have all data and it's sorted, we can render the posts
    postsWithUsersAndComments.forEach(({ post, user, comments }) => {
        let delete_post_html = '';
        if (session_id == post.user_id) {
            delete_post_html = `<button class="remove-btn" onclick="RemoveMyPost(this)">Remove</button>`;
        }

        // Construct comments HTML
        let comments_html = comments.map(comment => `<div class="single-comment">${comment.content}</div>`).join('');

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
                ${comments_html}
            </div>
        </div>`;

        let postWrapper = document.querySelector('#allPostsWrapper');
        postWrapper.insertAdjacentHTML('afterbegin', newPostHtml);
    });
}



document.addEventListener('DOMContentLoaded', function() {
    // This code will run after the document is fully loaded
    getAllPosts();
});


const commentPostSubmit = e => {
   e.preventDefault();

   let btn = e.target;
   btn.setAttribute('disabled', 'true');

   let main_post_el = btn.closest('.single-post');
   let post_id = main_post_el.getAttribute('data-post_id');


    let comment_value = main_post_el.querySelector('input').value;

    main_post_el.querySelector('input').value = "";

    main_post_el.querySelector('.post-comments').innerHTML += `<div class="single-comment">${comment_value}</div>`
    
    let comment = new Comment();
    comment.content = comment_value;
    comment.user_id = session_id;
    comment.post_id = post_id;
    comment.create();
}

const RemoveMyPost = btn => {
   let post_id = btn.closest('.single-post').getAttribute('data-post_id');

    btn.closest('.single-post').remove();

    let post = new Post();
    post.delete(post_id);

}

const likePost = btn => {
    let main_post_el = btn.closest('.single-post');
    let post_id = btn.closest('.single-post').getAttribute('data-post_id');

    let number_of_likes = parseInt(btn.querySelector('span').innerText);

    btn.querySelector('span').innerText = number_of_likes + 1;
    btn.setAttribute('disabled', 'true');

    let post = new Post();
    post.like(post_id, number_of_likes + 1);
    }

const commentPost = btn => {
        let main_post_el = btn.closest('.single-post');
        let post_id = main_post_el.getAttribute('data-post_id');

        main_post_el.querySelector('.post-comments').style.display = 'block';
 }    