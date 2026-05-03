// Admin Products Management
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { PRODUCTS_CONFIG } from "../config/firebase.js";
import { initializeApp } from "firebase/app";
import {
  compressMultipleImages,
  multipleFilesToBase64,
} from "../utils/imageCompressor.js";

// Initialize Firebase
const productsApp = initializeApp(PRODUCTS_CONFIG, "products");
const productsDb = getFirestore(productsApp);
const storage = getStorage(productsApp);

// State
let allProducts = [];
let currentEditId = null;
let selectedImages = [];

// Initialize products management
export async function initProductsManagement() {
  await loadProducts();
  initEventListeners();
}

// Load all products
async function loadProducts() {
  const tableBody = document.getElementById("productsTableBody");
  if (!tableBody) return;

  try {
    const productsRef = collection(productsDb, "products");
    const q = query(productsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    allProducts = [];
    querySnapshot.forEach((doc) => {
      allProducts.push({ id: doc.id, ...doc.data() });
    });

    renderProductsTable();
  } catch (error) {
    console.error("Error loading products:", error);
    tableBody.innerHTML =
      '<tr><td colspan="7">Error loading products</td></tr>';
  }
}

// Render products table
function renderProductsTable() {
  const tableBody = document.getElementById("productsTableBody");
  if (!tableBody) return;

  if (allProducts.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="7">No products found</td></tr>';
    return;
  }

  tableBody.innerHTML = allProducts
    .map(
      (product) => `
        <tr data-product-id="${product.id}">
            <td><img src="${product.images?.[0] || "https://via.placeholder.com/50"}" alt="${product.name}" class="product-thumbnail"></td>
            <td>${product.name}</td>
            <td>${product.category || "-"}</td>
            <td>Rs. ${(product.salePrice || product.price).toLocaleString()}</td>
            <td>${product.stock || 0}</td>
            <td><span class="status-badge ${product.stock > 0 ? "status-active" : "status-inactive"}">${product.stock > 0 ? "In Stock" : "Out of Stock"}</span></td>
            <td class="table-actions">
                <button class="edit-btn" data-id="${product.id}">Edit</button>
                <button class="delete-btn" data-id="${product.id}">Delete</button>
            </td>
        </tr>
    `,
    )
    .join("");

  // Add event listeners for edit/delete buttons
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => editProduct(btn.dataset.id));
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => showDeleteModal(btn.dataset.id));
  });
}

// Initialize event listeners
function initEventListeners() {
  // Add product button
  const addBtn = document.getElementById("addProductBtn");
  if (addBtn) {
    addBtn.addEventListener("click", () => showProductModal());
  }

  // Search
  const searchInput = document.getElementById("searchProducts");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filtered = allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.category?.toLowerCase().includes(searchTerm),
      );
      renderFilteredProducts(filtered);
    });
  }

  // Category filter
  const categoryFilter = document.getElementById("filterCategory");
  if (categoryFilter) {
    categoryFilter.addEventListener("change", (e) => {
      const category = e.target.value;
      if (category === "all") {
        renderProductsTable();
      } else {
        const filtered = allProducts.filter((p) => p.category === category);
        renderFilteredProducts(filtered);
      }
    });
  }

  // Modal close buttons
  const closeBtns = document.querySelectorAll(".close-modal");
  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("productModal")?.classList.remove("active");
      document.getElementById("deleteModal")?.classList.remove("active");
    });
  });

  // Cancel buttons
  const cancelBtn = document.getElementById("cancelModalBtn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      document.getElementById("productModal")?.classList.remove("active");
    });
  }

  const cancelDelete = document.getElementById("cancelDeleteBtn");
  if (cancelDelete) {
    cancelDelete.addEventListener("click", () => {
      document.getElementById("deleteModal")?.classList.remove("active");
    });
  }

  // Save product
  const saveBtn = document.getElementById("saveProductBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => saveProduct());
  }

  // Confirm delete
  const confirmDelete = document.getElementById("confirmDeleteBtn");
  if (confirmDelete) {
    confirmDelete.addEventListener("click", () => confirmDeleteProduct());
  }

  // Image upload
  const imageUploadArea = document.getElementById("imageUploadArea");
  const imageInput = document.getElementById("imageInput");

  if (imageUploadArea && imageInput) {
    imageUploadArea.addEventListener("click", () => imageInput.click());
    imageUploadArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      imageUploadArea.style.borderColor = "var(--color-red)";
    });
    imageUploadArea.addEventListener("dragleave", () => {
      imageUploadArea.style.borderColor = "var(--color-gray-300)";
    });
    imageUploadArea.addEventListener("drop", async (e) => {
      e.preventDefault();
      imageUploadArea.style.borderColor = "var(--color-gray-300)";
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/"),
      );
      await handleImageUpload(files);
    });

    imageInput.addEventListener("change", async (e) => {
      const files = Array.from(e.target.files);
      await handleImageUpload(files);
    });
  }
}

// Render filtered products
function renderFilteredProducts(products) {
  const tableBody = document.getElementById("productsTableBody");
  if (!tableBody) return;

  if (products.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="7">No products found</td></tr>';
    return;
  }

  tableBody.innerHTML = products
    .map(
      (product) => `
        <tr data-product-id="${product.id}">
            <td><img src="${product.images?.[0] || "https://via.placeholder.com/50"}" class="product-thumbnail"></td>
            <td>${product.name}</td>
            <td>${product.category || "-"}</td>
            <td>Rs. ${(product.salePrice || product.price).toLocaleString()}</td>
            <td>${product.stock || 0}</td>
            <td><span class="status-badge">${product.stock > 0 ? "In Stock" : "Out of Stock"}</span></td>
            <td class="table-actions">
                <button class="edit-btn" data-id="${product.id}">Edit</button>
                <button class="delete-btn" data-id="${product.id}">Delete</button>
            </td>
        </tr>
    `,
    )
    .join("");

  // Reattach event listeners
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => editProduct(btn.dataset.id));
  });
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => showDeleteModal(btn.dataset.id));
  });
}

// Show product modal for add/edit
function showProductModal(product = null) {
  const modal = document.getElementById("productModal");
  const modalTitle = document.getElementById("modalTitle");

  if (!modal) return;

  currentEditId = product?.id || null;

  if (product) {
    modalTitle.textContent = "Edit Product";
    document.getElementById("productName").value = product.name || "";
    document.getElementById("productCategory").value =
      product.category || "makeup";
    document.getElementById("productBrand").value = product.brand || "";
    document.getElementById("productStock").value = product.stock || 100;
    document.getElementById("productPrice").value = product.price || "";
    document.getElementById("productSalePrice").value = product.salePrice || "";
    document.getElementById("productDescription").value =
      product.description || "";

    // Show existing images
    if (product.images && product.images.length > 0) {
      const previewContainer = document.getElementById("imagePreview");
      previewContainer.innerHTML = product.images
        .map(
          (img, index) => `
                <div class="preview-image">
                    <img src="${img}" alt="Preview">
                    <span class="remove-image" data-index="${index}">&times;</span>
                </div>
            `,
        )
        .join("");
      selectedImages = [...product.images];
    }
  } else {
    modalTitle.textContent = "Add New Product";
    document.getElementById("productForm").reset();
    document.getElementById("imagePreview").innerHTML = "";
    selectedImages = [];
  }

  modal.classList.add("active");
}

// Edit product
function editProduct(productId) {
  const product = allProducts.find((p) => p.id === productId);
  if (product) {
    showProductModal(product);
  }
}

// Handle image upload with compression
async function handleImageUpload(files) {
  if (!files.length) return;

  // Compress images
  const compressedFiles = await compressMultipleImages(files);

  // Convert to base64 for preview and storage
  const base64Images = await multipleFilesToBase64(compressedFiles);

  // Add to selected images
  selectedImages.push(...base64Images);

  // Update preview
  const previewContainer = document.getElementById("imagePreview");
  const newImagesHTML = base64Images
    .map(
      (img, index) => `
        <div class="preview-image">
            <img src="${img}" alt="Preview">
            <span class="remove-image" data-index="${selectedImages.length - base64Images.length + index}">&times;</span>
        </div>
    `,
    )
    .join("");

  previewContainer.insertAdjacentHTML("beforeend", newImagesHTML);

  // Add remove handlers
  document.querySelectorAll(".remove-image").forEach((btn) => {
    btn.removeEventListener("click", removeImageHandler);
    btn.addEventListener("click", removeImageHandler);
  });

  // Show compression info
  const compressionInfo = document.querySelector(".compression-info");
  if (compressionInfo) {
    compressionInfo.textContent = `${files.length} image(s) uploaded and compressed to under 500KB each`;
    setTimeout(() => {
      compressionInfo.textContent =
        "Images will be automatically compressed to under 500KB";
    }, 3000);
  }
}

// Remove image handler
function removeImageHandler(e) {
  const index = parseInt(e.target.dataset.index);
  if (!isNaN(index)) {
    selectedImages.splice(index, 1);
    e.target.closest(".preview-image")?.remove();
  }
}

// Save product
async function saveProduct() {
  const name = document.getElementById("productName")?.value;
  const category = document.getElementById("productCategory")?.value;
  const brand = document.getElementById("productBrand")?.value;
  const stock = parseInt(document.getElementById("productStock")?.value) || 0;
  const price = parseFloat(document.getElementById("productPrice")?.value);
  const salePrice =
    parseFloat(document.getElementById("productSalePrice")?.value) || null;
  const description = document.getElementById("productDescription")?.value;

  // Validate
  if (!name || !category || !price || !description) {
    alert("Please fill in all required fields");
    return;
  }

  if (selectedImages.length === 0 && !currentEditId) {
    alert("Please upload at least one product image");
    return;
  }

  const productData = {
    name,
    category,
    brand: brand || null,
    stock,
    price,
    salePrice: salePrice && salePrice < price ? salePrice : null,
    description,
    images: selectedImages,
    updatedAt: serverTimestamp(),
  };

  if (!currentEditId) {
    productData.createdAt = serverTimestamp();
    productData.salesCount = 0;
    productData.averageRating = 0;
    productData.reviewCount = 0;
  }

  try {
    if (currentEditId) {
      // Update existing product
      const productRef = doc(productsDb, "products", currentEditId);
      await updateDoc(productRef, productData);
      alert("Product updated successfully!");
    } else {
      // Add new product
      await addDoc(collection(productsDb, "products"), productData);
      alert("Product added successfully!");
    }

    // Close modal and reload
    document.getElementById("productModal")?.classList.remove("active");
    await loadProducts();
  } catch (error) {
    console.error("Error saving product:", error);
    alert("Failed to save product. Please try again.");
  }
}

// Show delete confirmation modal
let deleteProductId = null;
function showDeleteModal(productId) {
  deleteProductId = productId;
  const product = allProducts.find((p) => p.id === productId);
  const productNameSpan = document.getElementById("deleteProductName");
  if (productNameSpan && product) {
    productNameSpan.textContent = `"${product.name}"`;
  }
  document.getElementById("deleteModal")?.classList.add("active");
}

// Confirm delete product
async function confirmDeleteProduct() {
  if (!deleteProductId) return;

  try {
    await deleteDoc(doc(productsDb, "products", deleteProductId));
    alert("Product deleted successfully!");
    document.getElementById("deleteModal")?.classList.remove("active");
    await loadProducts();
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("Failed to delete product. Please try again.");
  }
}
