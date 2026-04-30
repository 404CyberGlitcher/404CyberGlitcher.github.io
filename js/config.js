/* ============================================
   Anas Plastic Enterprises - Configuration
   ============================================
   
   NOTE: In a static website, environment variables 
   from .env file need to be manually synced here.
   Update the values below with your actual credentials.
*/

const CONFIG = {
  // Business Information
  BUSINESS_NAME: 'Anas Plastic Enterprises',
  CEO_NAME: 'Muhammad Ali',
  BUSINESS_TAGLINE: 'Your Premier Source for Cosmetic Packaging Solutions',
  BUSINESS_DESCRIPTION: 'Anas Plastic Enterprises specializes in providing a wide variety of high-quality empty plastic packaging for the beauty and skincare industry.',
  
  // Contact Information
  WHATSAPP_NUMBER: '923000841330',
  CALL_NUMBER: '923000841330',
  LANDLINE_NUMBER: '04237634122',
  EMAIL_ADDRESS: 'alirafique326@gmail.com',
  FACEBOOK_URL: 'https://www.facebook.com/anasplasticenterprise/',
  
  // WhatsApp Message Settings
  WHATSAPP_MESSAGE_PREFIX: 'Hello Anas Plastic Enterprises,\n\nI am interested in ordering the following products:\n\n',
  WHATSAPP_MESSAGE_SUFFIX: '\n\nPlease provide pricing and availability details.\n\nThank you!',
  
  // Address
  SHOP_ADDRESS: 'Shop #7, Madni Three Center, 786 Market, Paper Mandi, Shah Alam (Shalam) Market, Lahore, Pakistan',
  
  // EmailJS Configuration
  // Replace these with your actual EmailJS credentials from https://www.emailjs.com/
  EMAILJS_PUBLIC_KEY: 'your_public_key_here',
  EMAILJS_SERVICE_ID: 'your_service_id_here',
  EMAILJS_TEMPLATE_ID: 'your_template_id_here',
  
  // Developer Credit
  DEVELOPER_NAME: 'Asia X Network (SMC-PVT) LTD',
  DEVELOPER_URL: 'https://asiaxnetwork.vercel.app',
  
  // Website
  WEBSITE_URL: window.location.origin,
  
  // Pagination
  PRODUCTS_PER_PAGE: 12,
  
  // Cart
  CART_STORAGE_KEY: 'anas_plastic_cart'
};

// Prevent modification
Object.freeze(CONFIG);

// Helper to format WhatsApp number
function getWhatsAppLink(message = '') {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

// Helper to format phone number for display
function formatPhoneNumber(number) {
  if (number.startsWith('92')) {
    return '+92 ' + number.slice(2, 5) + ' ' + number.slice(5);
  }
  return number;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, getWhatsAppLink, formatPhoneNumber };
}
