// ============================================
// COLORMART - FIREBASE CONFIGURATION
// ============================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit, updateDoc, deleteDoc, addDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

class FirebaseService {
    constructor() {
        this.apps = {};
        this.dbs = {};
        this.storages = {};
        this.initializeApps();
    }

    initializeApps() {
        // Initialize Main App
        if (ENV.FIREBASE_MAIN.apiKey) {
            this.apps.main = initializeApp({
                apiKey: ENV.FIREBASE_MAIN.apiKey,
                authDomain: ENV.FIREBASE_MAIN.authDomain,
                projectId: ENV.FIREBASE_MAIN.projectId,
                storageBucket: ENV.FIREBASE_MAIN.storageBucket,
                messagingSenderId: ENV.FIREBASE_MAIN.messagingSenderId,
                appId: ENV.FIREBASE_MAIN.appId,
                measurementId: ENV.FIREBASE_MAIN.measurementId
            }, 'main');
            this.dbs.main = getFirestore(this.apps.main);
            this.auth = getAuth(this.apps.main);
            this.storages.main = getStorage(this.apps.main);
        }

        // Initialize Products App
        if (ENV.FIREBASE_PRODUCTS.apiKey) {
            this.apps.products = initializeApp({
                apiKey: ENV.FIREBASE_PRODUCTS.apiKey,
                authDomain: ENV.FIREBASE_PRODUCTS.authDomain,
                projectId: ENV.FIREBASE_PRODUCTS.projectId,
                storageBucket: ENV.FIREBASE_PRODUCTS.storageBucket,
                messagingSenderId: ENV.FIREBASE_PRODUCTS.messagingSenderId,
                appId: ENV.FIREBASE_PRODUCTS.appId,
                measurementId: ENV.FIREBASE_PRODUCTS.measurementId,
                databaseURL: ENV.FIREBASE_PRODUCTS.databaseURL
            }, 'products');
            this.dbs.products = getFirestore(this.apps.products);
            this.storages.products = getStorage(this.apps.products);
        }

        // Initialize Reviews App
        if (ENV.FIREBASE_REVIEWS.apiKey) {
            this.apps.reviews = initializeApp({
                apiKey: ENV.FIREBASE_REVIEWS.apiKey,
                authDomain: ENV.FIREBASE_REVIEWS.authDomain,
                projectId: ENV.FIREBASE_REVIEWS.projectId,
                storageBucket: ENV.FIREBASE_REVIEWS.storageBucket,
                messagingSenderId: ENV.FIREBASE_REVIEWS.messagingSenderId,
                appId: ENV.FIREBASE_REVIEWS.appId,
                measurementId: ENV.FIREBASE_REVIEWS.measurementId,
                databaseURL: ENV.FIREBASE_REVIEWS.databaseURL
            }, 'reviews');
            this.dbs.reviews = getFirestore(this.apps.reviews);
        }

        // Initialize Contacts App
        if (ENV.FIREBASE_CONTACTS.apiKey) {
            this.apps.contacts = initializeApp({
                apiKey: ENV.FIREBASE_CONTACTS.apiKey,
                authDomain: ENV.FIREBASE_CONTACTS.authDomain,
                projectId: ENV.FIREBASE_CONTACTS.projectId,
                storageBucket: ENV.FIREBASE_CONTACTS.storageBucket,
                messagingSenderId: ENV.FIREBASE_CONTACTS.messagingSenderId,
                appId: ENV.FIREBASE_CONTACTS.appId,
                measurementId: ENV.FIREBASE_CONTACTS.measurementId,
                databaseURL: ENV.FIREBASE_CONTACTS.databaseURL
            }, 'contacts');
            this.dbs.contacts = getFirestore(this.apps.contacts);
        }
    }

    // ============ PRODUCTS METHODS ============
    
    async getProducts(options = {}) {
        try {
            let q = query(collection(this.dbs.products, 'products'));
            
            if (options.category) {
                q = query(q, where('category', '==', options.category));
            }
            
            if (options.brand) {
                q = query(q, where('brand', '==', options.brand));
            }
            
            if (options.featured) {
                q = query(q, where('featured', '==', true));
            }
            
            if (options.limit) {
                q = query(q, limit(options.limit));
            }
            
            if (options.orderBy) {
                q = query(q, orderBy(options.orderBy, options.order || 'desc'));
            }
            
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    async getProductById(productId) {
        try {
            const docRef = doc(this.dbs.products, 'products', productId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            }
            return null;
        } catch (error) {
            console.error('Error fetching product:', error);
            return null;
        }
    }

    async addProduct(productData) {
        try {
            const docRef = await addDoc(collection(this.dbs.products, 'products'), {
                ...productData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            return { id: docRef.id, ...productData };
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    }

    async updateProduct(productId, productData) {
        try {
            const docRef = doc(this.dbs.products, 'products', productId);
            await updateDoc(docRef, {
                ...productData,
                updatedAt: new Date().toISOString()
            });
            return { id: productId, ...productData };
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    async deleteProduct(productId) {
        try {
            const docRef = doc(this.dbs.products, 'products', productId);
            await deleteDoc(docRef);
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }

    async uploadProductImage(file, productId) {
        try {
            const storageRef = ref(this.storages.products, `products/${productId}/${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    async deleteProductImage(imageUrl) {
        try {
            const imageRef = ref(this.storages.products, imageUrl);
            await deleteObject(imageRef);
            return true;
        } catch (error) {
            console.error('Error deleting image:', error);
            throw error;
        }
    }

    // ============ REVIEWS METHODS ============
    
    async getReviews(productId = null) {
        try {
            let q = query(collection(this.dbs.reviews, 'reviews'));
            
            if (productId) {
                q = query(q, where('productId', '==', productId));
            }
            
            q = query(q, orderBy('createdAt', 'desc'));
            
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return [];
        }
    }

    async addReview(reviewData) {
        try {
            const docRef = await addDoc(collection(this.dbs.reviews, 'reviews'), {
                ...reviewData,
                createdAt: new Date().toISOString(),
                approved: true
            });
            return { id: docRef.id, ...reviewData };
        } catch (error) {
            console.error('Error adding review:', error);
            throw error;
        }
    }

    async deleteReview(reviewId) {
        try {
            const docRef = doc(this.dbs.reviews, 'reviews', reviewId);
            await deleteDoc(docRef);
            return true;
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    }

    // ============ CONTACTS METHODS ============
    
    async addContact(contactData) {
        try {
            const docRef = await addDoc(collection(this.dbs.contacts, 'contacts'), {
                ...contactData,
                createdAt: new Date().toISOString(),
                read: false
            });
            return { id: docRef.id, ...contactData };
        } catch (error) {
            console.error('Error adding contact:', error);
            throw error;
        }
    }

    async getContacts() {
        try {
            const q = query(collection(this.dbs.contacts, 'contacts'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching contacts:', error);
            return [];
        }
    }

    async markContactAsRead(contactId) {
        try {
            const docRef = doc(this.dbs.contacts, 'contacts', contactId);
            await updateDoc(docRef, { read: true });
            return true;
        } catch (error) {
            console.error('Error marking contact as read:', error);
            throw error;
        }
    }

    async deleteContact(contactId) {
        try {
            const docRef = doc(this.dbs.contacts, 'contacts', contactId);
            await deleteDoc(docRef);
            return true;
        } catch (error) {
            console.error('Error deleting contact:', error);
            throw error;
        }
    }

    // ============ ORDERS METHODS ============
    
    async addOrder(orderData) {
        try {
            const docRef = await addDoc(collection(this.dbs.main, 'orders'), {
                ...orderData,
                status: 'pending',
                createdAt: new Date().toISOString()
            });
            return { id: docRef.id, ...orderData };
        } catch (error) {
            console.error('Error adding order:', error);
            throw error;
        }
    }

    async getOrders(status = null) {
        try {
            let q = query(collection(this.dbs.main, 'orders'));
            
            if (status && status !== 'all') {
                q = query(q, where('status', '==', status));
            }
            
            q = query(q, orderBy('createdAt', 'desc'));
            
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching orders:', error);
            return [];
        }
    }

    async updateOrderStatus(orderId, status) {
        try {
            const docRef = doc(this.dbs.main, 'orders', orderId);
            await updateDoc(docRef, { 
                status, 
                updatedAt: new Date().toISOString() 
            });
            return true;
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    }

    // ============ AUTH METHODS ============
    
    async loginAdmin(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }

    async logoutAdmin() {
        try {
            await signOut(this.auth);
            return true;
        } catch (error) {
            console.error('Error logging out:', error);
            throw error;
        }
    }

    getCurrentUser() {
        return new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(this.auth, (user) => {
                unsubscribe();
                resolve(user);
            }, reject);
        });
    }

    // ============ STATS METHODS ============
    
    async getDashboardStats() {
        try {
            const [productsSnapshot, ordersSnapshot, reviewsSnapshot, contactsSnapshot] = await Promise.all([
                getDocs(collection(this.dbs.products, 'products')),
                getDocs(collection(this.dbs.main, 'orders')),
                getDocs(collection(this.dbs.reviews, 'reviews')),
                getDocs(collection(this.dbs.contacts, 'contacts'))
            ]);

            return {
                totalProducts: productsSnapshot.size,
                totalOrders: ordersSnapshot.size,
                totalReviews: reviewsSnapshot.size,
                totalContacts: contactsSnapshot.size
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            return {
                totalProducts: 0,
                totalOrders: 0,
                totalReviews: 0,
                totalContacts: 0
            };
        }
    }
}

// Create and export singleton instance
const firebaseService = new FirebaseService();
export default firebaseService;