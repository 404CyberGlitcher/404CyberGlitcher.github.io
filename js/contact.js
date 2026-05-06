// Contact Form Functionality - Anas Plastic Enterprises
// Uses configuration from Vercel environment variables

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("contact.html")) {
    // Wait for config to load before setting up form
    if (window.config?.isLoaded()) {
      setupContactForm();
    } else {
      window.config?.onLoad(() => {
        setupContactForm();
      });
    }
  }
});

function setupContactForm() {
  const form = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  if (!form) return;

  // Get EmailJS configuration
  const emailjsConfig = window.config?.get("emailjs");
  const businessConfig = window.config?.get("business");

  if (
    !emailjsConfig?.publicKey ||
    !emailjsConfig?.serviceId ||
    !emailjsConfig?.templateId
  ) {
    console.error("EmailJS configuration not loaded");
    showFormMessage(
      "error",
      "Configuration not loaded. Please refresh the page.",
    );
    return;
  }

  // Initialize EmailJS
  if (typeof emailjs !== "undefined") {
    emailjs.init(emailjsConfig.publicKey);
    console.log("EmailJS initialized with config");
  } else {
    console.error("EmailJS library not loaded");
    return;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get submit button
    const submitButton = form.querySelector('button[type="submit"]');
    const textSpan = submitButton?.querySelector(".text");
    const originalText = textSpan?.textContent || "Send Message";

    if (textSpan) textSpan.textContent = "Sending...";
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.style.opacity = "0.7";
      submitButton.style.cursor = "not-allowed";
    }

    // Get form data
    const formData = {
      from_name: document.getElementById("name").value.trim(),
      from_email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      subject: document.getElementById("subject").value.trim(),
      message: document.getElementById("message").value.trim(),
      to_name: businessConfig?.name || "Anas Plastic Enterprises",
      reply_to: document.getElementById("email").value.trim(),
      to_email: businessConfig?.email || "",
    };

    try {
      // Send email via EmailJS
      const response = await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        formData,
      );

      if (response.status === 200) {
        showFormMessage(
          "success",
          "✅ Message sent successfully! We will get back to you soon.",
        );
        form.reset();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      showFormMessage(
        "error",
        "❌ Failed to send message. Please try again or contact us via WhatsApp.",
      );
      showWhatsAppFallback();
    } finally {
      if (textSpan) textSpan.textContent = originalText;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.style.opacity = "1";
        submitButton.style.cursor = "pointer";
      }
    }
  });
}

function showFormMessage(type, message) {
  const formMessage = document.getElementById("formMessage");
  if (!formMessage) return;

  formMessage.className = "form-message";
  formMessage.innerHTML = "";

  const messageContent = document.createElement("div");
  messageContent.style.cssText = `
        padding: 15px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInUp 0.5s ease;
    `;

  if (type === "success") {
    messageContent.style.backgroundColor = "#D1FAE5";
    messageContent.style.color = "#065F46";
    messageContent.style.border = "1px solid #6EE7B7";
    messageContent.innerHTML = `<i class="fas fa-check-circle" style="font-size: 1.5rem;"></i><span>${message}</span>`;
  } else {
    messageContent.style.backgroundColor = "#FEE2E2";
    messageContent.style.color = "#991B1B";
    messageContent.style.border = "1px solid #FCA5A5";
    messageContent.innerHTML = `<i class="fas fa-exclamation-circle" style="font-size: 1.5rem;"></i><span>${message}</span>`;
  }

  formMessage.appendChild(messageContent);
  formMessage.style.display = "block";

  if (type === "success") {
    setTimeout(() => {
      formMessage.style.opacity = "0";
      formMessage.style.transition = "opacity 0.3s ease";
      setTimeout(() => {
        formMessage.style.display = "none";
        formMessage.style.opacity = "1";
      }, 300);
    }, 8000);
  }
}

function showWhatsAppFallback() {
  const formMessage = document.getElementById("formMessage");
  if (!formMessage) return;

  const whatsappConfig = window.config?.get("whatsapp");
  const whatsappNumber = whatsappConfig?.number || "";

  if (!whatsappNumber) {
    console.error("WhatsApp number not configured");
    return;
  }

  const whatsappDiv = document.createElement("div");
  whatsappDiv.style.cssText = `
        margin-top: 15px;
        padding: 15px;
        background-color: #F0FDF4;
        border-radius: 8px;
        border: 2px solid #25D366;
        text-align: center;
    `;
  whatsappDiv.innerHTML = `
        <p style="margin-bottom: 10px; color: #1F2937; font-weight: 600;">
            <i class="fab fa-whatsapp" style="color: #25D366; font-size: 1.2rem;"></i>
            Or reach us directly on WhatsApp:
        </p>
        <a href="https://wa.me/${whatsappNumber}" 
           target="_blank" 
           style="display: inline-block; padding: 12px 24px; background: #25D366; color: white; border-radius: 25px; text-decoration: none; font-weight: 600; transition: all 0.3s ease;">
            <i class="fab fa-whatsapp"></i> Chat on WhatsApp
        </a>
    `;

  formMessage.appendChild(whatsappDiv);
}

// Add keyframe animation
const style = document.createElement("style");
style.textContent = `
    @keyframes slideInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
