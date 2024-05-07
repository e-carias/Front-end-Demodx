const SIGNUP_FORM = document.getElementById('signup-form');
const LOGIN_FORM = document.getElementById('login-form');

document.addEventListener('DOMContentLoaded', async () => {
    const JSON = await dataFetch(USER_API, 'readUsers');
    if (JSON.session) {
        location.href = 'main.html';
    } else if (JSON.status) {
        document.getElementById('login-container').classList.remove('d-none');
        sweetToast(4, JSON.message, null);
    }
});

LOGIN_FORM.addEventListener('submit', async (event) => {
    event.preventDefault();
    const FORM = new FormData(LOGIN_FORM);
    const JSON = await dataFetch(USER_API, 'login', FORM);
    if (JSON.status) {
        sweetAlert(1, JSON.message, 'main.html');
    } else {

        sweetAlert(2, JSON.exception, null);
    }
});