// Admin Orders Management
import { showToast } from "../components/cart.js";

// State
let allOrders = [];

// Initialize orders management
export async function initOrdersManagement(orders) {
  allOrders =
    orders || JSON.parse(localStorage.getItem("colormart_orders") || "[]");
  renderOrdersTable();
  updateOrdersStats();
  initEventListeners();
}

// Update order statistics
function updateOrdersStats() {
  const statsContainer = document.getElementById("ordersStats");
  if (!statsContainer) return;

  const pending = allOrders.filter((o) => o.status === "pending").length;
  const processing = allOrders.filter((o) => o.status === "processing").length;
  const shipped = allOrders.filter((o) => o.status === "shipped").length;
  const delivered = allOrders.filter((o) => o.status === "delivered").length;

  statsContainer.innerHTML = `
        <div class="stat-badge"><strong>Total:</strong> ${allOrders.length}</div>
        <div class="stat-badge"><strong>Pending:</strong> ${pending}</div>
        <div class="stat-badge"><strong>Processing:</strong> ${processing}</div>
        <div class="stat-badge"><strong>Shipped:</strong> ${shipped}</div>
        <div class="stat-badge"><strong>Delivered:</strong> ${delivered}</div>
    `;
}

// Render orders table
function renderOrdersTable() {
  const tableBody = document.getElementById("ordersTableBody");
  if (!tableBody) return;

  if (allOrders.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6">No orders found</td></tr>';
    return;
  }

  tableBody.innerHTML = allOrders
    .map(
      (order) => `
        <tr data-order-id="${order.orderId}">
            <td>${order.orderId}</td>
            <td>${order.customerName}</td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td>Rs. ${order.totalAmount.toLocaleString()}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td><span class="status-badge">${order.paymentMethod}</span></td>
        </tr>
    `,
    )
    .join("");

  // Add click handler for order details
  document.querySelectorAll("#ordersTableBody tr").forEach((row) => {
    row.addEventListener("click", () => {
      const orderId = row.dataset.orderId;
      const order = allOrders.find((o) => o.orderId === orderId);
      if (order) showOrderDetail(order);
    });
  });
}

// Show order detail modal
function showOrderDetail(order) {
  const modal = document.getElementById("orderDetailModal");
  const body = document.getElementById("orderDetailBody");

  if (!modal || !body) return;

  body.innerHTML = `
        <div class="order-info-grid">
            <div class="order-info-card">
                <h4>Order Information</h4>
                <p><strong>Order ID:</strong> ${order.orderId}</p>
                <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                <p><strong>Status:</strong> 
                    <select class="status-select" id="orderStatusSelect">
                        <option value="pending" ${order.status === "pending" ? "selected" : ""}>Pending</option>
                        <option value="processing" ${order.status === "processing" ? "selected" : ""}>Processing</option>
                        <option value="shipped" ${order.status === "shipped" ? "selected" : ""}>Shipped</option>
                        <option value="delivered" ${order.status === "delivered" ? "selected" : ""}>Delivered</option>
                        <option value="cancelled" ${order.status === "cancelled" ? "selected" : ""}>Cancelled</option>
                    </select>
                    <button class="update-status-btn" id="updateStatusBtn">Update</button>
                </p>
            </div>
            <div class="order-info-card">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> ${order.customerName}</p>
                <p><strong>Email:</strong> ${order.customerEmail}</p>
                <p><strong>Phone:</strong> ${order.customerPhone || "N/A"}</p>
            </div>
            <div class="order-info-card">
                <h4>Shipping Address</h4>
                <p>${order.shippingAddress}</p>
                <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            </div>
            <div class="order-info-card">
                <h4>Order Summary</h4>
                <p><strong>Subtotal:</strong> Rs. ${order.subtotal?.toLocaleString() || order.totalAmount.toLocaleString()}</p>
                <p><strong>Shipping:</strong> ${order.shippingCost > 0 ? `Rs. ${order.shippingCost}` : "Free"}</p>
                <p><strong>Total:</strong> Rs. ${order.totalAmount.toLocaleString()}</p>
            </div>
        </div>
        <h4>Order Items</h4>
        <div class="order-items-list">
            ${order.items
              .map(
                (item) => `
                <div class="order-item">
                    <img src="${item.image || "https://via.placeholder.com/60"}" alt="${item.name}" class="order-item-image">
                    <div class="order-item-details">
                        <div class="order-item-title">${item.name}</div>
                        <div>Quantity: ${item.quantity}</div>
                        <div class="order-item-price">Rs. ${(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                </div>
            `,
              )
              .join("")}
        </div>
        <div class="order-total">
            Total Amount: Rs. ${order.totalAmount.toLocaleString()}
        </div>
        <div class="order-actions">
            <button class="print-btn" id="printOrderBtn">Print Order</button>
        </div>
    `;

  modal.classList.add("active");

  // Update status button
  const updateBtn = document.getElementById("updateStatusBtn");
  if (updateBtn) {
    updateBtn.addEventListener("click", () => {
      const newStatus = document.getElementById("orderStatusSelect").value;
      updateOrderStatus(order.orderId, newStatus);
      modal.classList.remove("active");
    });
  }

  // Print button
  const printBtn = document.getElementById("printOrderBtn");
  if (printBtn) {
    printBtn.addEventListener("click", () => printOrder(order));
  }
}

// Update order status
function updateOrderStatus(orderId, newStatus) {
  const orderIndex = allOrders.findIndex((o) => o.orderId === orderId);
  if (orderIndex !== -1) {
    allOrders[orderIndex].status = newStatus;
    localStorage.setItem("colormart_orders", JSON.stringify(allOrders));
    renderOrdersTable();
    updateOrdersStats();
    showToast(`Order ${orderId} status updated to ${newStatus}`);
  }
}

// Print order
function printOrder(order) {
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
        <html>
            <head>
                <title>Order ${order.orderId}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #ff0000; }
                    .order-info { margin: 20px 0; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f5f5f5; }
                    .total { margin-top: 20px; text-align: right; font-size: 18px; font-weight: bold; }
                </style>
            </head>
            <body>
                <h1>ColorMart - Order Invoice</h1>
                <div class="order-info">
                    <p><strong>Order ID:</strong> ${order.orderId}</p>
                    <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                    <p><strong>Customer:</strong> ${order.customerName}</p>
                    <p><strong>Email:</strong> ${order.customerEmail}</p>
                    <p><strong>Shipping Address:</strong> ${order.shippingAddress}</p>
                </div>
                <h3>Order Items</h3>
                <table>
                    <thead>
                        <tr><th>Product</th><th>Quantity</th><th>Price</th><th>Total</th></tr>
                    </thead>
                    <tbody>
                        ${order.items
                          .map(
                            (item) => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>Rs. ${item.price.toLocaleString()}</td>
                                <td>Rs. ${(item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                        `,
                          )
                          .join("")}
                    </tbody>
                </table>
                <div class="total">
                    Total: Rs. ${order.totalAmount.toLocaleString()}
                </div>
                <p>Thank you for shopping with ColorMart!</p>
            </body>
        </html>
    `);
  printWindow.document.close();
  printWindow.print();
}

// Initialize event listeners
function initEventListeners() {
  // Status filter
  const statusFilter = document.getElementById("filterStatus");
  if (statusFilter) {
    statusFilter.addEventListener("change", (e) => {
      const status = e.target.value;
      if (status === "all") {
        renderOrdersTable();
      } else {
        const filtered = allOrders.filter((o) => o.status === status);
        const tableBody = document.getElementById("ordersTableBody");
        if (tableBody) {
          if (filtered.length === 0) {
            tableBody.innerHTML =
              '<tr><td colspan="6">No orders found</td></tr>';
          } else {
            tableBody.innerHTML = filtered
              .map(
                (order) => `
                            <tr data-order-id="${order.orderId}">
                                <td>${order.orderId}</td>
                                <td>${order.customerName}</td>
                                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>Rs. ${order.totalAmount.toLocaleString()}</td>
                                <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                                <td><span class="status-badge">${order.paymentMethod}</span></td>
                            </tr>
                        `,
              )
              .join("");

            // Reattach click handlers
            document.querySelectorAll("#ordersTableBody tr").forEach((row) => {
              row.addEventListener("click", () => {
                const orderId = row.dataset.orderId;
                const order = filtered.find((o) => o.orderId === orderId);
                if (order) showOrderDetail(order);
              });
            });
          }
        }
      }
    });
  }

  // Modal close
  const closeBtns = document.querySelectorAll(".close-modal");
  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("orderDetailModal")?.classList.remove("active");
    });
  });

  // Close button in modal footer
  const closeModalBtn = document.querySelector(".close-modal-btn");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      document.getElementById("orderDetailModal")?.classList.remove("active");
    });
  }
}
