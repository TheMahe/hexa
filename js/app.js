

document.querySelector('#signup').addEventListener('click', () => {
    document.querySelector('.custom-modal').style.display = 'block';

    document.querySelector('#closeModal').addEventListener('click', () => {
        document.querySelector('.custom-modal').style.display = 'none';
    })
});

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



let validator = new Validator(config, '#registrationForm');         

document.querySelector('#registrationForm').addEventListener('submit', e => {
    e.preventDefault();

    if(validator.validationPassed()) {
     

    } else {
        alert('the form is not filled out correctly');
    }
});

