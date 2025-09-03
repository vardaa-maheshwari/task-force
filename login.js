document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email-input');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userEmail = emailInput.value.trim();
            if (userEmail) {
                localStorage.setItem('userEmail', userEmail);
                window.location.href = 'index.html';
            }
        });
    }
});