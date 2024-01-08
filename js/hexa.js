let session = new Session();
session_id = session.getSession();

if(session_id !== "") {
    let user = new User();
    user.get(session_id);
} else {
    window.location.href = '/';
}