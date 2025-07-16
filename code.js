// Tab switching functionality
function switchTab(tabName) {
    console.log('Switching to:', tabName); // Debug log
    
    // Get elements
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    // Check if elements exist
    if (!loginTab || !signupTab || !loginForm || !signupForm) {
        console.error('Required elements not found');
        return;
    }
    
    if (tabName === 'login') {
        // Switch to login
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        console.log('Switched to login tab');
    } else if (tabName === 'signup') {
        // Switch to signup
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        console.log('Switched to signup tab');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded'); // Debug log
    
    // Add event listeners to tab buttons
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    
    if (loginTab) {
        loginTab.addEventListener('click', function(e) {
            e.preventDefault();
            switchTab('login');
        });
    }
    
    if (signupTab) {
        signupTab.addEventListener('click', function(e) {
            e.preventDefault();
            switchTab('signup');
        });
    }
    
    // Add event listeners to switch links
    const switchLinks = document.querySelectorAll('.switch-link');
    switchLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
        });
    });
    
    // Login form submission
    const loginFormElement = document.querySelector('#loginForm form');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            console.log('Login attempt:', { email, password, rememberMe });
            alert('Login functionality would be implemented here!');
        });
    }
    
    // Signup form submission
    const signupFormElement = document.querySelector('#signupForm form');
    if (signupFormElement) {
        signupFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            
            console.log('Signup attempt:', { name, email, password });
            alert('Signup functionality would be implemented here!');
        });
    }
    
    // Add focus effects to inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Add loading state to auth buttons only
    const authButtons = document.querySelectorAll('.auth-button');
    authButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Only add loading state for form submissions, not tab switches
            if (this.type === 'submit') {
                const originalText = this.textContent;
                this.textContent = 'Loading...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                }, 2000);
            }
        });
    });
});