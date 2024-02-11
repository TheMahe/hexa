import { auth } from './firebaseConfig';

document.querySelector('#loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    let email = document.querySelector('#login_email').value;
    let password = document.querySelector('#login_lozinka').value;

    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        // Signed in
        const user = userCredential.user;
        // You can access the new user via user.user
        // Additional user info profile not available via:
        // user.additionalUserInfo.profile
        // You can check if new user via: user.additionalUserInfo.isNewUser
        console.log(user);
    } catch (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error(errorCode, errorMessage);
    }
});