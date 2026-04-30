// Contact Form Functionality - Anas Plastic Enterprises

// Initialize EmailJS
(function() {
    // EmailJS configuration - Replace with your actual keys from .env equivalent
    const EMAILJS_SERVICE_ID = 'service_xxxxxxxxx';
    const EMAILJS_TEMPLATE_ID = 'template_xxxxxxxxx';
    const EMAILJS_USER_ID = 'user_xxxxxxxxx';
    
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_USER_ID);
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('contact.html')) {
        setupContactForm();
    }
});

function setupContactForm() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.querySelector('.text').textContent;
        submitButton.querySelector('.text').textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Get form data
        const formData = {
            from_name: document.getElementById('name').value.trim(),
            from_email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim(),
            to_name: 'Anas Plastic Enterprises',
            reply_to: document.getElementById('email').value.trim()
        };
        
        try {
            // Send email via EmailJS
            const response = await emailjs.send(
                'service_xxxxxxxxx', // Replace with your Service ID
                'template_xxxxxxxxx', // Replace with your Template ID
                formData
            );
            
            // Show success message
            showFormMessage('success', 'Message sent successfully! We will get back to you soon.');
            
            // Reset form
            form.reset();
            
        } catch (error) {
            console.error('Error sending message:', error);
            showFormMessage('error', 'Failed to send message. Please try again or contact us via WhatsApp.');
        } finally {
            // Reset button
            submitButton.querySelector('.text').textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

function showFormMessage(type, message) {
    const formMessage = document.getElementById('formMessage');
    if (!formMessage) return;
    
    formMessage.className = `form-message ${type}`;
    formMessage.textContent = message;
    formMessage.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}