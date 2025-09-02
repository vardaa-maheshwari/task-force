document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email-input').value;
        const phone = document.getElementById('phone-input').value;

        if (email && phone) {
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userPhone', phone);
            window.location.href = 'index.html'; // Redirect to the main to-do list page
        }
    });
});