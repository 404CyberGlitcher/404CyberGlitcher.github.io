// ============================================
// COLORMART - CONTACT PAGE SCRIPT
// ============================================

import firebaseService from './config/firebase.js';
import emailService from './utils/emailService.js';
import seoManager from './utils/seo.js';

class ContactPage {
    constructor() {
        this.init();
    }

    init() {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });

        this.setupFormValidation();
        this.setupSEO();
    }

    setupSEO() {
        seoManager.updatePageTitle('Contact Us');
        seoManager.updateMetaDescription(
            `Contact ${ENV.SITE.name} - Get in touch with our beauty and cosmetics store. Reach out for inquiries, support, or feedback.`
        );
    }

    setupFormValidation() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const phoneInput = document.getElementById('contact-phone');
        const messageInput = document.getElementById('contact-message');

        // Real-time validation
        nameInput?.addEventListener('input', () => this.validateName(nameInput));
        emailInput?.addEventListener('input', () => this.validateEmail(emailInput));
        phoneInput?.addEventListener('input', () => this.validatePhone(phoneInput));
        messageInput?.addEventListener('input', () => this.validateMessage(messageInput));

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                await this.submitForm();
            }
        });
    }

    validateName(input) {
        const error = document.getElementById('name-error');
        const value = input.value.trim();
        
        if (!value) {
            error.textContent = 'Name is required';
            return false;
        }
        if (value.length < 2) {
            error.textContent = 'Name must be at least 2 characters';
            return false;
        }
        
        error.textContent = '';
        return true;
    }

    validateEmail(input) {
        const error = document.getElementById('email-error');
        const value = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!value) {
            error.textContent = 'Email is required';
            return false;
        }
        if (!emailRegex.test(value)) {
            error.textContent = 'Please enter a valid email address';
            return false;
        }
        
        error.textContent = '';
        return true;
    }

    validatePhone(input) {
        const value = input.value.trim();
        if (value && !/^[\d\s\-\+\(\)]{10,}$/.test(value)) {
            return false;
        }
        return true;
    }

    validateMessage(input) {
        const error = document.getElementById('message-error');
        const value = input.value.trim();
        
        if (!value) {
            error.textContent = 'Message is required';
            return false;
        }
        if (value.length < 10) {
            error.textContent = 'Message must be at least 10 characters';
            return false;
        }
        
        error.textContent = '';
        return true;
    }

    validateForm() {
        const nameValid = this.validateName(document.getElementById('contact-name'));
        const emailValid = this.validateEmail(document.getElementById('contact-email'));
        const messageValid = this.validateMessage(document.getElementById('contact-message'));
        
        return nameValid && emailValid && messageValid;
    }

    async submitForm() {
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const phone = document.getElementById('contact-phone').value.trim();
        const message = document.getElementById('contact-message').value.trim();
        
        const submitBtn = document.querySelector('.submit-btn');
        const formStatus = document.getElementById('form-status');
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Save to Firebase
            await firebaseService.addContact({
                name,
                email,
                phone,
                message
            });

            // Send notification email
            await emailService.sendContactFormNotification({
                name,
                email,
                phone,
                message
            });
            
            // Show success
            formStatus.className = 'form-status success';
            formStatus.textContent = 'Message sent successfully! We will get back to you soon.';
            
            // Reset form
            document.getElementById('contact-form').reset();
            
        } catch (error) {
            console.error('Error submitting contact form:', error);
            formStatus.className = 'form-status error';
            formStatus.textContent = 'Failed to send message. Please try again later.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
            
            // Hide status after 5 seconds
            setTimeout(() => {
                formStatus.className = 'form-status';
                formStatus.textContent = '';
            }, 5000);
        }
    }
}

// Initialize contact page
document.addEventListener('DOMContentLoaded', () => {
    new ContactPage();
});