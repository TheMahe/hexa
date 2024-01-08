document.querySelector('#loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let user = new User();


    let email = document.querySelector('#login_email').value;
    let password = document.querySelector('#login_lozinka').value;

    user.email = email;
    user.password = password;
    user.login();
})