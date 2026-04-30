/* ============================================
   Contact Page JavaScript - EmailJS Integration
   ============================================ */

function initContactPage() {
  // Initialize EmailJS
  if (typeof emailjs !== 'undefined' && CONFIG.EMAILJS_PUBLIC_KEY !== 'your_public_key_here') {
    emailjs.init(CONFIG.EMAILJS_PUBLIC_KEY);
  }
  
  setupContactForm();
}

function setupContactForm() {
  const form = document.getElementById('contact-form');
  
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const sendBtn = document.getElementById('send-btn');
    const originalText = sendBtn.querySelector('.text').textContent;
    
    // Validate
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const subject = form.querySelector('#subject').value;
    const message = form.querySelector('#message').value.trim();
    
    if (!name || !email || !subject || !message) {
      showFormMessage('Please fill in all required fields.', 'error');
      return;
    }
    
    // Check if EmailJS is configured
    if (CONFIG.EMAILJS_PUBLIC_KEY === 'your_public_key_here') {
      showFormMessage('Email service is not configured yet. Please contact us directly via WhatsApp or phone.', 'error');
      return;
    }
    
    // Show loading state
    sendBtn.disabled = true;
    sendBtn.querySelector('.text').textContent = 'Sending...';
    
    try {
      const templateParams = {
        from_name: name,
        from_email: email,
        phone: form.querySelector('#phone').value.trim(),
        subject: subject,
        message: message,
        to_email: CONFIG.EMAIL_ADDRESS
      };
      
      await emailjs.send(
        CONFIG.EMAILJS_SERVICE_ID,
        CONFIG.EMAILJS_TEMPLATE_ID,
        templateParams
      );
      
      showFormMessage('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
      form.reset();
      
    } catch (error) {
      console.error('EmailJS Error:', error);
      showFormMessage('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
    } finally {
      sendBtn.disabled = false;
      sendBtn.querySelector('.text').textContent = originalText;
    }
  });
}

function showFormMessage(text, type) {
  // Remove existing messages
  const existing = document.querySelector('.form-message');
  if (existing) existing.remove();
  
  const form = document.getElementById('contact-form');
  const message = document.createElement('div');
  message.className = `form-message ${type}`;
  message.textContent = text;
  
  form.appendChild(message);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (message.parentElement) {
      message.remove();
    }
  }, 5000);
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactPage);
} else {
  initContactPage();
}
