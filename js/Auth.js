

// Sign up function
function signUpUser() {
    var email = document.getElementById("register_email").value; // Updated ID
    var password = document.getElementById("register_password").value; // Updated ID


    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        alert('You have successfully signed up!'); // Success message
        var user = userCredential.user;
        // Redirect user or show success message
        window.location.href = './hexa.html'; // Redirect to homepage
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // Display the error message to the user
        alert(errorMessage); // Or update an error message element in your HTML
    });
}

// Link this function to the signup form
var signupFormElement = document.getElementById('signupForm');
if (signupFormElement) {
    signupFormElement.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way
        signUpUser();
    });
}

function loginUser() {
    var email = document.getElementById("login_email").value;
    var password = document.getElementById("login_password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Redirect on successful login
        window.location.href = './hexa.html';
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // Display error message
        alert(errorMessage);
    });
}

function googleSignIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then((result) => {
        // This gives you a Google Access Token.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // Redirect to hexa.html or other page
        window.location.href = './hexa.html';
    }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error("Error signing in with Google: ", errorMessage);
        // ...
    });
}


var loginFormElement = document.getElementById('loginForm');
if (loginFormElement) {
    loginFormElement.addEventListener('submit', function(event) {
        event.preventDefault();
        loginUser();
    });
}




function signOutUser() {
    firebase.auth().signOut().then(() => {
        window.location.href = './index.html';
    }).catch((error) => {
        console.log(error);
    });
}
