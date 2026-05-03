// ============================================
// COLORMART - ADMIN PRODUCTS MANAGEMENT
// ============================================

import firebaseService from '../config/firebase.js';
import imageCompressor from '../utils/imageCompressor.js';
import discountCalculator from '../utils/discountCalculator.js';

class AdminProducts {
    constructor() {
        this.products = [];
        this.editingProduct = null;
        this.selectedImages = [];
        
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.setupEventListeners();
    }

    async loadProducts() {
        try {
            this.products = await firebaseService.getProducts();
            this.renderProductsTable();
        } catch (error) {
            console.error('Error loading products:', error);
            this.showNotification('Failed to load products', 'error');
        }
    }

    renderProductsTable(filteredProducts = null) {
        const products = filteredProducts || this.products;
        const tbody = document.getElementById('products-table-body');
        if (!tbody) return;

        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No products found</td></tr>';
            return;
        }

        tbody.innerHTML = products.map(product => `
            <tr>
                <td>
                    <img src="${product.images?.[0] || '../../assets/images/placeholder-product.jpg'}" 
                         alt="${product.name}" 
                         class="product-thumbnail"
                         onerror="this.src='../../assets/images/placeholder-product.jpg'">
                </td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${ENV.SITE.currencySymbol} ${product.originalPrice.toLocaleString()}</td>
                <td>${product.salePrice ? `${ENV.SITE.currencySymbol} ${product.salePrice.toLocaleString()}` : '-'}</td>
                <td>${product.stock || 0}</td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-btn" onclick="adminProducts.editProduct('${product.id}')">Edit</button>
                        <button class="delete-btn" onclick="adminProducts.deleteProduct('${product.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    setupEventListeners() {
        // Add product button
        document.getElementById('add-product-btn')?.addEventListener('click', () => {
            this.openProductModal();
        });

        // Modal close
        document.getElementById('modal-close')?.addEventListener('click', () => {
            this.closeProductModal();
        });

        document.getElementById('cancel-btn')?.addEventListener('click', () => {
            this.closeProductModal();
        });

        // Form submission
        document.getElementById('product-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.saveProduct();
        });

        // Image selection
        document.getElementById('product-images')?.addEventListener('change', (e) => {
            this.handleImageSelection(e.target.files);
        });

        // Product search
        document.getElementById('product-search')?.addEventListener('input', (e) => {
            this.searchProducts(e.target.value);
        });

        // Close modal on overlay click
        document.getElementById('product-modal')?.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeProductModal();
            }
        });
    }

    openProductModal(product = null) {
        const modal = document.getElementById('product-modal');
        const modalTitle = document.getElementById('modal-title');
        const form = document.getElementById('product-form');

        if (!modal) return;

        this.editingProduct = product;
        this.selectedImages = [];

        if (product) {
            modalTitle.textContent = 'Edit Product';
            this.populateForm(product);
        } else {
            modalTitle.textContent = 'Add New Product';
            form.reset();
            document.getElementById('product-id').value = '';
        }

        modal.classList.add('active');
    }

    closeProductModal() {
        const modal = document.getElementById('product-modal');
        if (modal) {
            modal.classList.remove('active');
        }
        this.editingProduct = null;
        this.selectedImages = [];
        document.getElementById('images-preview').innerHTML = '';
    }

    populateForm(product) {
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name || '';
        document.getElementById('product-category').value = product.category || '';
        document.getElementById('product-brand').value = product.brand || '';
        document.getElementById('product-original-price').value = product.originalPrice || '';
        document.getElementById('product-sale-price').value = product.salePrice || '';
        document.getElementById('product-stock').value = product.stock || 0;
        document.getElementById('product-description').value = product.description || '';

        // Show existing images
        const preview = document.getElementById('images-preview');
        if (product.images) {
            preview.innerHTML = product.images.map(img => `
                <img src="${img}" alt="Product image">
            `).join('');
        }
    }

    async handleImageSelection(files) {
        const preview = document.getElementById('images-preview');
        
        try {
            const compressedFiles = await imageCompressor.compressMultipleImages(Array.from(files));
            this.selectedImages = compressedFiles;

            // Show preview
            preview.innerHTML = compressedFiles.map(file => {
                const url = URL.createObjectURL(file);
                return `<img src="${url}" alt="New product image">`;
            }).join('');

            // Show compression info
            const totalSize = compressedFiles.reduce((sum, file) => sum + file.size, 0);
            const compressionInfo = document.getElementById('compression-info');
            if (compressionInfo) {
                compressionInfo.innerHTML = `
                    <span>Image compression: <strong>Complete</strong></span>
                    <span>Total size: ${imageCompressor.formatFileSize(totalSize)}</span>
                `;
            }
        } catch (error) {
            console.error('Error compressing images:', error);
            this.showNotification('Failed to process images', 'error');
        }
    }

    async saveProduct() {
        const productData = {
            name: document.getElementById('product-name').value.trim(),
            category: document.getElementById('product-category').value,
            brand: document.getElementById('product-brand').value.trim(),
            originalPrice: parseFloat(document.getElementById('product-original-price').value),
            salePrice: parseFloat(document.getElementById('product-sale-price').value) || null,
            stock: parseInt(document.getElementById('product-stock').value) || 0,
            description: document.getElementById('product-description').value.trim()
        };

        // Validate
        if (!productData.name || !productData.category || !productData.originalPrice) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        const productId = document.getElementById('product-id').value;
        const saveBtn = document.getElementById('save-btn');

        try {
            saveBtn.disabled = true;
            saveBtn.textContent = 'Saving...';

            // Upload new images if any
            if (this.selectedImages.length > 0) {
                const imageUrls = [];
                for (const file of this.selectedImages) {
                    const url = await firebaseService.uploadProductImage(
                        file, 
                        productId || 'new-product'
                    );
                    imageUrls.push(url);
                }
                productData.images = imageUrls;
            }

            if (productId) {
                // Update existing product
                await firebaseService.updateProduct(productId, productData);
                this.showNotification('Product updated successfully!', 'success');
            } else {
                // Add new product
                await firebaseService.addProduct(productData);
                this.showNotification('Product added successfully!', 'success');
            }

            this.closeProductModal();
            await this.loadProducts();

        } catch (error) {
            console.error('Error saving product:', error);
            this.showNotification('Failed to save product', 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Product';
        }
    }

    async editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            this.openProductModal(product);
        }
    }

    async deleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            await firebaseService.deleteProduct(productId);
            this.showNotification('Product deleted successfully!', 'success');
            await this.loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            this.showNotification('Failed to delete product', 'error');
        }
    }

    searchProducts(query) {
        if (!query) {
            this.renderProductsTable();
            return;
        }

        const filtered = this.products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.brand?.toLowerCase().includes(query.toLowerCase()) ||
            product.category?.toLowerCase().includes(query.toLowerCase())
        );

        this.renderProductsTable(filtered);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize admin products
const adminProducts = new AdminProducts();
window.adminProducts = adminProducts;
export default adminProducts;