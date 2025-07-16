
function switchTab(tabName) {
    
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    
    
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (tabName === 'login') {
        
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        
        
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    } else if (tabName === 'signup') {
        
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        
        
        signupForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    
    const loginForm = document.querySelector('#loginForm form');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        console.log('Login attempt:', { email, password, rememberMe });
        alert('Login functionality would be implemented here!');
    });
    
    
    const signupForm = document.querySelector('#signupForm form');
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        
        
        console.log('Signup attempt:', { name, email, password });
        alert('Signup functionality would be implemented here!');
    });
});


document.addEventListener('DOMContentLoaded', function() {
    
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    
    const buttons = document.querySelectorAll('.auth-button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            this.disabled = true;
            
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 2000);
        });
    });
});