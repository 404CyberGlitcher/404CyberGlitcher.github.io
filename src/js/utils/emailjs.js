// EmailJS utility for sending emails
import emailjs from "@emailjs/browser";

// Initialize EmailJS with environment variables
const initEmailJS = () => {
  const publicKey = import.meta.env.VITE_EMAILJS_USER_ID;
  if (publicKey) {
    emailjs.init(publicKey);
  } else {
    console.error("EmailJS User ID not configured");
  }
};

// Call initialization
initEmailJS();

/**
 * Send order confirmation email to customer
 * @param {Object} orderData - Order details
 * @returns {Promise}
 */
export const sendCustomerOrderEmail = async (orderData) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CUSTOMER;

  if (!serviceId || !templateId) {
    console.error("EmailJS templates not configured");
    return;
  }

  const templateParams = {
    to_email: orderData.customerEmail,
    customer_name: orderData.customerName,
    order_id: orderData.orderId,
    order_date: new Date(orderData.createdAt).toLocaleDateString(),
    total_amount: `Rs. ${orderData.totalAmount.toLocaleString()}`,
    items: orderData.items
      .map(
        (item) =>
          `${item.name} x ${item.quantity} = Rs. ${(item.price * item.quantity).toLocaleString()}`,
      )
      .join("\n"),
    shipping_address: orderData.shippingAddress,
    payment_method: orderData.paymentMethod,
    tracking_url: `${import.meta.env.VITE_SITE_URL}/track-order/${orderData.orderId}`,
  };

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams);
    console.log("Customer email sent:", response);
    return response;
  } catch (error) {
    console.error("Customer email error:", error);
    throw error;
  }
};

/**
 * Send order notification to staff
 * @param {Object} orderData - Order details
 * @returns {Promise}
 */
export const sendStaffOrderEmail = async (orderData) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_STAFF;
  const staffEmail = import.meta.env.VITE_STAFF_EMAIL;

  if (!serviceId || !templateId || !staffEmail) {
    console.error("EmailJS staff configuration missing");
    return;
  }

  const templateParams = {
    to_email: staffEmail,
    order_id: orderData.orderId,
    customer_name: orderData.customerName,
    customer_email: orderData.customerEmail,
    customer_phone: orderData.customerPhone || "Not provided",
    total_amount: `Rs. ${orderData.totalAmount.toLocaleString()}`,
    items: orderData.items
      .map(
        (item) =>
          `${item.name} x ${item.quantity} = Rs. ${(item.price * item.quantity).toLocaleString()}`,
      )
      .join("\n"),
    shipping_address: orderData.shippingAddress,
    payment_method: orderData.paymentMethod,
    admin_url: `${import.meta.env.VITE_SITE_URL}/admin/orders.html`,
  };

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams);
    console.log("Staff email sent:", response);
    return response;
  } catch (error) {
    console.error("Staff email error:", error);
    throw error;
  }
};

/**
 * Send contact form confirmation
 * @param {Object} contactData - Contact form data
 * @returns {Promise}
 */
export const sendContactAutoReply = async (contactData) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env
    .VITE_EMAILJS_TEMPLATE_ID_CONTACT_AUTO_REPLY;

  if (!serviceId || !templateId) {
    console.error("Contact auto-reply template not configured");
    return;
  }

  const templateParams = {
    to_email: contactData.email,
    customer_name: contactData.name,
    subject: contactData.subject,
    message: contactData.message,
    site_name: import.meta.env.VITE_SITE_NAME || "ColorMart",
    support_email:
      import.meta.env.VITE_STAFF_EMAIL || "support@colormart.store",
  };

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams);
    console.log("Auto-reply sent:", response);
    return response;
  } catch (error) {
    console.error("Auto-reply error:", error);
    // Don't throw - auto-reply failure shouldn't break the form
  }
};

/**
 * Send contact notification to staff
 * @param {Object} contactData - Contact form data
 * @returns {Promise}
 */
export const sendContactStaffNotification = async (contactData) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONTACT_STAFF;
  const staffEmail = import.meta.env.VITE_STAFF_EMAIL;

  if (!serviceId || !templateId || !staffEmail) {
    console.error("Contact staff notification template not configured");
    return;
  }

  const templateParams = {
    to_email: staffEmail,
    from_name: contactData.name,
    from_email: contactData.email,
    from_phone: contactData.phone || "Not provided",
    subject: contactData.subject,
    message: contactData.message,
    admin_url: `${import.meta.env.VITE_SITE_URL}/admin/contacts.html`,
  };

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams);
    console.log("Staff notification sent:", response);
    return response;
  } catch (error) {
    console.error("Staff notification error:", error);
    throw error;
  }
};
