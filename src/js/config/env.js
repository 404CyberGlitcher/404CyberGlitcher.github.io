// ============================================
// COLORMART - ENVIRONMENT CONFIGURATION
// ============================================

const ENV = {
    // Firebase Main Database
    FIREBASE_MAIN: {
        apiKey: "AIzaSyCfZZObqI2Xzc7zc4kk_GZRVP_oD3U49Ko",
        authDomain: "colormart-main.firebaseapp.com",
        projectId: "colormart-main",
        storageBucket: "colormart-main.firebasestorage.app",
        messagingSenderId: "327377737295",
        appId: "1:327377737295:web:606f091640050547247c3a",
        measurementId: "G-4C6V5R08LK"
    },
    
    // Firebase Products Database
    FIREBASE_PRODUCTS: {
        apiKey: "AIzaSyDrisaVyBtffiyTq1d9IvCSz08FZIXQzf4",
        authDomain: "colormart-products-be5f4.firebaseapp.com",
        projectId: "colormart-products-be5f4",
        storageBucket: "colormart-products-be5f4.firebasestorage.app",
        messagingSenderId: "566959149626",
        appId: "1:566959149626:web:27758b0cba8531a6231b03",
        measurementId: "G-L7CZN2HLF1",
        databaseURL: "https://colormart-products-be5f4.firebaseio.com"
    },
    
    // Firebase Reviews Database
    FIREBASE_REVIEWS: {
        apiKey: "AIzaSyB_D3KExSf5iGrY2aAcF3LIK-33yu2YQic",
        authDomain: "colormart-reviews-d922f.firebaseapp.com",
        projectId: "colormart-reviews-d922f",
        storageBucket: "colormart-reviews-d922f.firebasestorage.app",
        messagingSenderId: "454153448009",
        appId: "1:454153448009:web:c4fce55968d2272a23ed98",
        measurementId: "G-9VJPBFTENK",
        databaseURL: "https://colormart-reviews-d922f.firebaseio.com"
    },
    
    // Firebase Contacts Database
    FIREBASE_CONTACTS: {
        apiKey: "AIzaSyDP45vx2hh0A9A5yE1WODivbCePwPTlRsI",
        authDomain: "colormart-contacts.firebaseapp.com",
        projectId: "colormart-contacts",
        storageBucket: "colormart-contacts.firebasestorage.app",
        messagingSenderId: "456183880118",
        appId: "1:456183880118:web:2ba074e6fadfc334204917",
        measurementId: "G-00H34LSVH2",
        databaseURL: "https://colormart-contacts.firebaseio.com"
    },
    
    // EmailJS Configuration
    EMAILJS: {
        publicKey: "kYrgHsA61AQpWfh6s",
        serviceId: "service_mxwyfhm",
        templateIdCustomer: "template_mochk6g",
        templateIdStaff: "template_795os07"
    },
    
    // Staff & Site Configuration
    STAFF: {
        email: "staff@colormart.store",
        adminEmails: ["admin@colormart.store"]
    },
    
    SITE: {
        url: "https://colormart.store",
        name: "ColorMart",
        freeShippingThreshold: 2500,
        currency: "PKR",
        currencySymbol: "Rs."
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ENV;
}

// Make available globally
window.ENV = ENV;