// ============================================
// COLORMART - ENVIRONMENT CONFIGURATION
// ============================================

const ENV = {
    // Firebase Main Database
    FIREBASE_MAIN: {
        apiKey: process.env.FIREBASE_MAIN_API_KEY || window.ENV?.FIREBASE_MAIN_API_KEY,
        authDomain: process.env.FIREBASE_MAIN_AUTH_DOMAIN || window.ENV?.FIREBASE_MAIN_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_MAIN_PROJECT_ID || window.ENV?.FIREBASE_MAIN_PROJECT_ID,
        storageBucket: process.env.FIREBASE_MAIN_STORAGE_BUCKET || window.ENV?.FIREBASE_MAIN_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MAIN_MESSAGING_SENDER_ID || window.ENV?.FIREBASE_MAIN_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_MAIN_APP_ID || window.ENV?.FIREBASE_MAIN_APP_ID,
        measurementId: process.env.FIREBASE_MAIN_MEASUREMENT_ID || window.ENV?.FIREBASE_MAIN_MEASUREMENT_ID
    },
    
    // Firebase Products Database
    FIREBASE_PRODUCTS: {
        apiKey: process.env.FIREBASE_PRODUCTS_API_KEY || window.ENV?.FIREBASE_PRODUCTS_API_KEY,
        authDomain: process.env.FIREBASE_PRODUCTS_AUTH_DOMAIN || window.ENV?.FIREBASE_PRODUCTS_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PRODUCTS_PROJECT_ID || window.ENV?.FIREBASE_PRODUCTS_PROJECT_ID,
        storageBucket: process.env.FIREBASE_PRODUCTS_STORAGE_BUCKET || window.ENV?.FIREBASE_PRODUCTS_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_PRODUCTS_MESSAGING_SENDER_ID || window.ENV?.FIREBASE_PRODUCTS_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_PRODUCTS_APP_ID || window.ENV?.FIREBASE_PRODUCTS_APP_ID,
        measurementId: process.env.FIREBASE_PRODUCTS_MEASUREMENT_ID || window.ENV?.FIREBASE_PRODUCTS_MEASUREMENT_ID,
        databaseURL: process.env.FIREBASE_PRODUCTS_DATABASE_URL || window.ENV?.FIREBASE_PRODUCTS_DATABASE_URL
    },
    
    // Firebase Reviews Database
    FIREBASE_REVIEWS: {
        apiKey: process.env.FIREBASE_REVIEWS_API_KEY || window.ENV?.FIREBASE_REVIEWS_API_KEY,
        authDomain: process.env.FIREBASE_REVIEWS_AUTH_DOMAIN || window.ENV?.FIREBASE_REVIEWS_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_REVIEWS_PROJECT_ID || window.ENV?.FIREBASE_REVIEWS_PROJECT_ID,
        storageBucket: process.env.FIREBASE_REVIEWS_STORAGE_BUCKET || window.ENV?.FIREBASE_REVIEWS_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_REVIEWS_MESSAGING_SENDER_ID || window.ENV?.FIREBASE_REVIEWS_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_REVIEWS_APP_ID || window.ENV?.FIREBASE_REVIEWS_APP_ID,
        measurementId: process.env.FIREBASE_REVIEWS_MEASUREMENT_ID || window.ENV?.FIREBASE_REVIEWS_MEASUREMENT_ID,
        databaseURL: process.env.FIREBASE_REVIEWS_DATABASE_URL || window.ENV?.FIREBASE_REVIEWS_DATABASE_URL
    },
    
    // Firebase Contacts Database
    FIREBASE_CONTACTS: {
        apiKey: process.env.FIREBASE_CONTACTS_API_KEY || window.ENV?.FIREBASE_CONTACTS_API_KEY,
        authDomain: process.env.FIREBASE_CONTACTS_AUTH_DOMAIN || window.ENV?.FIREBASE_CONTACTS_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_CONTACTS_PROJECT_ID || window.ENV?.FIREBASE_CONTACTS_PROJECT_ID,
        storageBucket: process.env.FIREBASE_CONTACTS_STORAGE_BUCKET || window.ENV?.FIREBASE_CONTACTS_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_CONTACTS_MESSAGING_SENDER_ID || window.ENV?.FIREBASE_CONTACTS_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_CONTACTS_APP_ID || window.ENV?.FIREBASE_CONTACTS_APP_ID,
        measurementId: process.env.FIREBASE_CONTACTS_MEASUREMENT_ID || window.ENV?.FIREBASE_CONTACTS_MEASUREMENT_ID,
        databaseURL: process.env.FIREBASE_CONTACTS_DATABASE_URL || window.ENV?.FIREBASE_CONTACTS_DATABASE_URL
    },
    
    // EmailJS Configuration
    EMAILJS: {
        serviceId: process.env.EMAILJS_SERVICE_ID || window.ENV?.EMAILJS_SERVICE_ID,
        templateIdCustomer: process.env.EMAILJS_TEMPLATE_ID_CUSTOMER || window.ENV?.EMAILJS_TEMPLATE_ID_CUSTOMER,
        templateIdStaff: process.env.EMAILJS_TEMPLATE_ID_STAFF || window.ENV?.EMAILJS_TEMPLATE_ID_STAFF,
        userId: process.env.EMAILJS_USER_ID || window.ENV?.EMAILJS_USER_ID
    },
    
    // Staff & Site Configuration
    STAFF: {
        email: process.env.STAFF_EMAIL || window.ENV?.STAFF_EMAIL,
        adminEmails: (process.env.ADMIN_EMAILS || window.ENV?.ADMIN_EMAILS || '').split(',')
    },
    
    SITE: {
        url: process.env.SITE_URL || window.ENV?.SITE_URL,
        name: process.env.SITE_NAME || window.ENV?.SITE_NAME,
        freeShippingThreshold: parseFloat(process.env.FREE_SHIPPING_THRESHOLD || window.ENV?.FREE_SHIPPING_THRESHOLD || 2500),
        currency: process.env.CURRENCY || window.ENV?.CURRENCY || 'PKR',
        currencySymbol: process.env.CURRENCY_SYMBOL || window.ENV?.CURRENCY_SYMBOL || 'Rs.'
    }
};

// Validate required environment variables
function validateEnv() {
    const required = [
        { obj: ENV.FIREBASE_MAIN, name: 'FIREBASE_MAIN' },
        { obj: ENV.FIREBASE_PRODUCTS, name: 'FIREBASE_PRODUCTS' },
        { obj: ENV.FIREBASE_REVIEWS, name: 'FIREBASE_REVIEWS' },
        { obj: ENV.FIREBASE_CONTACTS, name: 'FIREBASE_CONTACTS' }
    ];
    
    for (const { obj, name } of required) {
        if (!obj.apiKey || obj.apiKey.includes('your_')) {
            console.error(`Missing or invalid ${name} configuration. Please check your .env file.`);
        }
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ENV;
}

// Make available globally
window.ENV = ENV;

// Validate on load
validateEnv();