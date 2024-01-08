let session = new Session();
session_id = session.getSession();

if(session_id !== "") {
    

    async function populateUserData() {
        let user = new User();
        user =  await user.get(session_id);

        document.querySelector('#username').innerHTML = user.username;
        document.querySelector('#email').innerHTML = user.email;
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