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