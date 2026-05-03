// ============================================
// COLORMART - ADMIN AUTHENTICATION
// ============================================

import firebaseService from '../config/firebase.js';

class AdminAuth {
    constructor() {
        this.checkAuth();
        this.setupLoginForm();
        this.setupLogoutButton();
    }

    async checkAuth() {
        const user = await firebaseService.getCurrentUser();
        
        // Check if we're on the login page
        const isLoginPage = window.location.pathname.includes('login.html');
        
        if (!user && !isLoginPage) {
            // Redirect to login if not authenticated
            window.location.href = 'login.html';
            return;
        }
        
        if (user && isLoginPage) {
            // Redirect to dashboard if already authenticated
            window.location.href = 'dashboard.html';
            return;
        }

        if (user) {
            this.displayUserEmail(user.email);
        }
    }

    setupLoginForm() {
        const loginForm = document.getElementById('admin-login-form');
        if (!loginForm) return;

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('admin-email').value.trim();
            const password = document.getElementById('admin-password').value.trim();
            
            // Validate email
            if (!this.validateEmail(email)) {
                this.showError('email-error', 'Please enter a valid email address');
                return;
            }
            
            // Validate email domain
            if (!email.endsWith('@colormart.store')) {
                this.showError('email-error', 'Only @colormart.store emails are allowed');
                return;
            }
            
            // Validate password
            if (!password || password.length < 6) {
                this.showError('password-error', 'Password must be at least 6 characters');
                return;
            }
            
            await this.login(email, password);
        });
    }

    setupLogoutButton() {
        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn?.addEventListener('click', async () => {
            await this.logout();
        });
    }

    async login(email, password) {
        const loginBtn = document.querySelector('.login-btn');
        const loginStatus = document.getElementById('login-status');
        
        try {
            loginBtn.disabled = true;
            loginBtn.textContent = 'Signing in...';
            
            await firebaseService.loginAdmin(email, password);
            
            loginStatus.className = 'login-status success';
            loginStatus.textContent = 'Login successful! Redirecting...';
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            
        } catch (error) {
            console.error('Login error:', error);
            loginStatus.className = 'login-status error';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    loginStatus.textContent = 'No account found with this email';
                    break;
                case 'auth/wrong-password':
                    loginStatus.textContent = 'Incorrect password';
                    break;
                case 'auth/invalid-email':
                    loginStatus.textContent = 'Invalid email address';
                    break;
                case 'auth/too-many-requests':
                    loginStatus.textContent = 'Too many attempts. Please try again later';
                    break;
                default:
                    loginStatus.textContent = 'Login failed. Please try again';
            }
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Sign In';
        }
    }

    async logout() {
        try {
            await firebaseService.logoutAdmin();
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
        }
    }

    displayUserEmail(email) {
        const display = document.getElementById('admin-email-display');
        if (display) {
            display.textContent = email;
        }
    }
}

// Initialize admin auth
const adminAuth = new AdminAuth();
export default adminAuth;