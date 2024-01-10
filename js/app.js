let session = new Session();
session = session.getSession();

if(session !== "") {
    window.location.href = 'hexa.html';
}

burger = document.querySelector('.burger')
navbar = document.querySelector('nav')
menu = document.querySelector('.responsive_menu')

if (burger) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('change');
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        navbar.classList.toggle('mobile-menu');
    });
}


let config = {
    "korisnicko_ime": { 
        "required": true,
        "minlength": 5,
        "maxlength": 50
    },
    "register_email": {
        "required": true,
        "email": true,
        "minlength": 5,
        "maxlength": 50
    },
    "register_password": {
        "required": true,
        "minlength": 7,
        "maxlength": 25,
        "matching": "confirm_password"
    },
    "confirm_password": {
        "required": true,
        "minlength": 7,
        "maxlength": 25,
        "matching": "register_password"
    }

}

let validator = new Validator(config, '#registrationForm');

document.querySelector('#registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    if (validator.validationPassed()) {
        let user = new User();
        user.username = document.querySelector('#korisnicko_ime').value;
        user.email = document.querySelector('#register_email').value;
        user.password = document.querySelector('#register_password').value;
        user.create();
    } else {
        alert('Polja nisu dobro popunjena');
    }
})


