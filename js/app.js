

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

