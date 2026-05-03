import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
    plugins: [
        legacy({
            targets: ['defaults', 'not IE 11']
        })
    ],
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        minify: 'terser',
        rollupOptions: {
            input: {
                main: 'index.html',
                catalog: 'src/catalog.html',
                product: 'src/product.html',
                contact: 'src/contact.html',
                adminLogin: 'src/admin/login.html',
                adminDashboard: 'src/admin/dashboard.html'
            }
        }
    },
    define: {
        'import.meta.env.VITE_FIREBASE_MAIN_API_KEY': JSON.stringify(process.env.FIREBASE_MAIN_API_KEY),
        'import.meta.env.VITE_FIREBASE_MAIN_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_MAIN_AUTH_DOMAIN),
        'import.meta.env.VITE_FIREBASE_MAIN_PROJECT_ID': JSON.stringify(process.env.FIREBASE_MAIN_PROJECT_ID),
        'import.meta.env.VITE_FIREBASE_MAIN_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_MAIN_STORAGE_BUCKET),
        'import.meta.env.VITE_FIREBASE_MAIN_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_MAIN_MESSAGING_SENDER_ID),
        'import.meta.env.VITE_FIREBASE_MAIN_APP_ID': JSON.stringify(process.env.FIREBASE_MAIN_APP_ID),
        'import.meta.env.VITE_FIREBASE_PRODUCTS_API_KEY': JSON.stringify(process.env.FIREBASE_PRODUCTS_API_KEY),
        'import.meta.env.VITE_FIREBASE_PRODUCTS_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_PRODUCTS_AUTH_DOMAIN),
        'import.meta.env.VITE_FIREBASE_PRODUCTS_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PRODUCTS_PROJECT_ID),
        'import.meta.env.VITE_FIREBASE_PRODUCTS_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_PRODUCTS_STORAGE_BUCKET),
        'import.meta.env.VITE_FIREBASE_PRODUCTS_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_PRODUCTS_MESSAGING_SENDER_ID),
        'import.meta.env.VITE_FIREBASE_PRODUCTS_APP_ID': JSON.stringify(process.env.FIREBASE_PRODUCTS_APP_ID),
        'import.meta.env.VITE_FIREBASE_REVIEWS_API_KEY': JSON.stringify(process.env.FIREBASE_REVIEWS_API_KEY),
        'import.meta.env.VITE_FIREBASE_REVIEWS_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_REVIEWS_AUTH_DOMAIN),
        'import.meta.env.VITE_FIREBASE_REVIEWS_PROJECT_ID': JSON.stringify(process.env.FIREBASE_REVIEWS_PROJECT_ID),
        'import.meta.env.VITE_FIREBASE_REVIEWS_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_REVIEWS_STORAGE_BUCKET),
        'import.meta.env.VITE_FIREBASE_REVIEWS_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_REVIEWS_MESSAGING_SENDER_ID),
        'import.meta.env.VITE_FIREBASE_REVIEWS_APP_ID': JSON.stringify(process.env.FIREBASE_REVIEWS_APP_ID),
        'import.meta.env.VITE_FIREBASE_CONTACTS_API_KEY': JSON.stringify(process.env.FIREBASE_CONTACTS_API_KEY),
        'import.meta.env.VITE_FIREBASE_CONTACTS_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_CONTACTS_AUTH_DOMAIN),
        'import.meta.env.VITE_FIREBASE_CONTACTS_PROJECT_ID': JSON.stringify(process.env.FIREBASE_CONTACTS_PROJECT_ID),
        'import.meta.env.VITE_FIREBASE_CONTACTS_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_CONTACTS_STORAGE_BUCKET),
        'import.meta.env.VITE_FIREBASE_CONTACTS_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_CONTACTS_MESSAGING_SENDER_ID),
        'import.meta.env.VITE_FIREBASE_CONTACTS_APP_ID': JSON.stringify(process.env.FIREBASE_CONTACTS_APP_ID),
        'import.meta.env.VITE_EMAILJS_SERVICE_ID': JSON.stringify(process.env.EMAILJS_SERVICE_ID),
        'import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CUSTOMER': JSON.stringify(process.env.EMAILJS_TEMPLATE_ID_CUSTOMER),
        'import.meta.env.VITE_EMAILJS_TEMPLATE_ID_STAFF': JSON.stringify(process.env.EMAILJS_TEMPLATE_ID_STAFF),
        'import.meta.env.VITE_EMAILJS_USER_ID': JSON.stringify(process.env.EMAILJS_USER_ID),
        'import.meta.env.VITE_STAFF_EMAIL': JSON.stringify(process.env.STAFF_EMAIL),
        'import.meta.env.VITE_SITE_URL': JSON.stringify(process.env.SITE_URL),
        'import.meta.env.VITE_SITE_NAME': JSON.stringify(process.env.SITE_NAME),
        'import.meta.env.VITE_ADMIN_EMAILS': JSON.stringify(process.env.ADMIN_EMAILS)
    }
});