

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXkMQGpefk72Sh3PEJ59P_Fxrseun7vi0",
  authDomain: "social-network-37c5b.firebaseapp.com",
  projectId: "social-network-37c5b",
  storageBucket: "social-network-37c5b.appspot.com",
  messagingSenderId: "348604648783",
  appId: "1:348604648783:web:c145a4186b1ee8a447893a",
  measurementId: "G-S0MKBKZNCS"
};
firebase.initializeApp(firebaseConfig);

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .catch((error) => {
        console.error("Firebase auth persistence error:", error);
    });

    

    document.getElementById('postForm').addEventListener('submit', function(e) {
      e.preventDefault();
      // ... (Handling post
      var user = firebase.auth().currentUser;
      if (user) {
        var postContent = document.getElementById('postContent').value;
    
        firebase.firestore().collection('posts').add({
          userId: user.uid,
          content: postContent,
          // other post details
        }).then(() => {
          console.log('Post created!');
          document.getElementById('postContent').value = ''; // Clear the box after posting
          fetchAndDisplayPosts(); // This is like saying, "Show all the pictures on the wall again!"
        });
      }
    });
    
   // ... other parts of your code ...

   function fetchAndDisplayPosts() {
    firebase.firestore().collection('posts').orderBy('timestamp', 'desc').get().then((querySnapshot) => {
      let postsHtml = '';
      querySnapshot.forEach((doc) => {
        let post = doc.data();
        let postId = doc.id;
        let usernamePromise = fetchUsername(post.userId);
  
        usernamePromise.then(username => {
          postsHtml += `<div id="post-${postId}">
                          ${post.content} - Posted by ${username}
                          <button onclick="deletePost('${postId}')">Delete</button>
                          <button onclick="likePost('${postId}', '${post.userId}')">Like</button>
                          <span id="likes-${postId}">Likes: ${post.likes || 0}</span>
                          <form onsubmit="commentOnPost('${postId}', event)">
                            <input type="text" id="comment-${postId}" placeholder="Add a comment">
                            <button type="submit">Comment</button>
                          </form>
                        </div>`;
          document.getElementById('postsContainer').innerHTML = postsHtml;
        });
      });
    });
  }// ... other parts of your code ...

    
    
    
    fetchAndDisplayPosts();

    function deletePost(postId) {
      firebase.firestore().collection('posts').doc(postId).delete().then(() => {
        console.log('Post deleted!');
        fetchAndDisplayPosts(); // Refresh the posts
      }).catch((error) => {
        console.error('Error removing post: ', error);
      });
    }

    function likePost(postId) {
      var postRef = firebase.firestore().collection('posts').doc(postId);
    
      postRef.update({
        likes: firebase.firestore.FieldValue.increment(1)
      }).then(() => {
        postRef.get().then((doc) => {
          if (doc.exists) {
            var updatedPost = doc.data();
            var likesCount = updatedPost.likes || 0;
            document.getElementById(`likes-${postId}`).innerText = `Likes: ${likesCount}`;
          }
        });
      }).catch((error) => {
        console.error('Error liking post: ', error);
      });
    }
    
    
    function commentOnPost(postId, event) {
      event.preventDefault();
      var commentContent = document.getElementById(`comment-${postId}`).value;
      firebase.firestore().collection('comments').add({
        postId: postId,
        userId: firebase.auth().currentUser.uid,
        content: commentContent,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
    
    
    
    
    
    

    function initializePostForm() {
      var postForm = document.getElementById('postForm');
      if (postForm) {
        postForm.addEventListener('submit', function() {
  
          var user = firebase.auth().currentUser;
          if (user) {
              var postContent = document.getElementById('postContent').value;
  
              firebase.firestore().collection('posts').add({
                  userId: user.uid,
                  content: postContent,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                  likes: 0
              }).then(() => {
                  console.log('Post created!');
                  document.getElementById('postContent').value = '';
                  fetchAndDisplayPosts(); // Fetch posts again to show the new post
              }).catch((error) => {
                  console.error('Error writing document: ', error);
              });
          } else {
              console.error('No user signed in.');
          }
      });
  }
}



   
    

    

    


let config = {
    'username': {
      required: true,
      minlength: 5,
      maxlength: 50
    },

    'register_email': {
        required: true,
        email: true,
        minlength: 5,
        maxlength: 50
        },
     'register_password': {
        required: true,
        minlength: 7,
        maxlength: 25,
        matching: 'confirm_password'
     },
     
     'confirm_password': {
        required: true,
        minlength: 7,
        maxlength: 25,
        matching: 'register_password'
         }, 
        }



let validator = new Validator(config, '#signupForm');
// Initialize Firebase

