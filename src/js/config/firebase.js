// Firebase configuration - reads from .env file
// IMPORTANT: These values are loaded from environment variables
// Never hardcode Firebase credentials in production

const getFirebaseConfig = () => {
  // Check if we're in production (Vercel) or development
  const isProduction = import.meta.env.PROD;

  // For Vite, env variables are exposed via import.meta.env
  // All variables must be prefixed with VITE_ to be exposed
  return {
    main: {
      apiKey: import.meta.env.VITE_FIREBASE_MAIN_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_MAIN_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_MAIN_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_MAIN_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MAIN_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_MAIN_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MAIN_MEASUREMENT_ID,
    },
    products: {
      apiKey: import.meta.env.VITE_FIREBASE_PRODUCTS_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_PRODUCTS_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PRODUCTS_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_PRODUCTS_STORAGE_BUCKET,
      messagingSenderId: import.meta.env
        .VITE_FIREBASE_PRODUCTS_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_PRODUCTS_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_PRODUCTS_MEASUREMENT_ID,
      databaseURL: import.meta.env.VITE_FIREBASE_PRODUCTS_DATABASE_URL,
    },
    reviews: {
      apiKey: import.meta.env.VITE_FIREBASE_REVIEWS_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_REVIEWS_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_REVIEWS_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_REVIEWS_STORAGE_BUCKET,
      messagingSenderId: import.meta.env
        .VITE_FIREBASE_REVIEWS_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_REVIEWS_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_REVIEWS_MEASUREMENT_ID,
      databaseURL: import.meta.env.VITE_FIREBASE_REVIEWS_DATABASE_URL,
    },
    contacts: {
      apiKey: import.meta.env.VITE_FIREBASE_CONTACTS_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_CONTACTS_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_CONTACTS_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_CONTACTS_STORAGE_BUCKET,
      messagingSenderId: import.meta.env
        .VITE_FIREBASE_CONTACTS_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_CONTACTS_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_CONTACTS_MEASUREMENT_ID,
      databaseURL: import.meta.env.VITE_FIREBASE_CONTACTS_DATABASE_URL,
    },
  };
};

// Validate that all required configs are present
const validateConfig = (config) => {
  const missingVars = [];

  for (const [dbName, dbConfig] of Object.entries(config)) {
    for (const [key, value] of Object.entries(dbConfig)) {
      if (!value && key !== "measurementId" && key !== "databaseURL") {
        missingVars.push(
          `VITE_FIREBASE_${dbName.toUpperCase()}_${key.toUpperCase()}`,
        );
      }
    }
  }

  if (missingVars.length > 0) {
    console.error("Missing Firebase configuration variables:", missingVars);
    return false;
  }
  return true;
};

const firebaseConfig = getFirebaseConfig();
validateConfig(firebaseConfig);

// Export configurations for use in other files
export const MAIN_CONFIG = firebaseConfig.main;
export const PRODUCTS_CONFIG = firebaseConfig.products;
export const REVIEWS_CONFIG = firebaseConfig.reviews;
export const CONTACTS_CONFIG = firebaseConfig.contacts;
