// ============================================
// COLORMART - EMAIL SERVICE UTILITY
// ============================================

class EmailService {
    constructor() {
        this.serviceId = ENV.EMAILJS.serviceId;
        this.templateIdCustomer = ENV.EMAILJS.templateIdCustomer;
        this.templateIdStaff = ENV.EMAILJS.templateIdStaff;
        this.userId = ENV.EMAILJS.userId;
        this.staffEmails = ENV.STAFF.adminEmails;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        
        try {
            // Initialize EmailJS
            if (window.emailjs) {
                window.emailjs.init(this.userId);
                this.initialized = true;
            } else {
                // Load EmailJS dynamically
                await this.loadEmailJSScript();
                window.emailjs.init(this.userId);
                this.initialized = true;
            }
        } catch (error) {
            console.error('Failed to initialize EmailJS:', error);
        }
    }

    loadEmailJSScript() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async sendOrderConfirmationToCustomer(orderData) {
        await this.init();
        
        const templateParams = {
            to_email: orderData.email,
            to_name: `${orderData.firstName} ${orderData.lastName}`,
            order_id: orderData.orderId,
            order_total: `${ENV.SITE.currencySymbol} ${orderData.total.toLocaleString()}`,
            order_items: this.formatOrderItems(orderData.items),
            shipping_address: `${orderData.address}, ${orderData.city}`,
            store_name: ENV.SITE.name,
            store_url: ENV.SITE.url
        };

        try {
            const response = await window.emailjs.send(
                this.serviceId,
                this.templateIdCustomer,
                templateParams
            );
            console.log('Customer confirmation email sent:', response.status);
            return response;
        } catch (error) {
            console.error('Failed to send customer email:', error);
        }
    }

    async sendOrderNotificationToStaff(orderData) {
        await this.init();
        
        for (const staffEmail of this.staffEmails) {
            const templateParams = {
                to_email: staffEmail.trim(),
                order_id: orderData.orderId,
                customer_name: `${orderData.firstName} ${orderData.lastName}`,
                customer_email: orderData.email,
                customer_phone: orderData.phone,
                order_total: `${ENV.SITE.currencySymbol} ${orderData.total.toLocaleString()}`,
                order_items: this.formatOrderItems(orderData.items),
                shipping_address: `${orderData.address}, ${orderData.city}`,
                store_name: ENV.SITE.name,
                admin_url: `${ENV.SITE.url}/src/admin/orders.html`
            };

            try {
                await window.emailjs.send(
                    this.serviceId,
                    this.templateIdStaff,
                    templateParams
                );
                console.log(`Staff notification sent to ${staffEmail}`);
            } catch (error) {
                console.error(`Failed to send staff email to ${staffEmail}:`, error);
            }
        }
    }

    formatOrderItems(items) {
        if (!items || !items.length) return 'No items';
        
        return items.map(item => 
            `${item.name} x${item.quantity} - ${ENV.SITE.currencySymbol} ${item.price.toLocaleString()}`
        ).join('<br>');
    }

    async sendContactFormNotification(contactData) {
        await this.init();
        
        for (const staffEmail of this.staffEmails) {
            const templateParams = {
                to_email: staffEmail.trim(),
                contact_name: contactData.name,
                contact_email: contactData.email,
                contact_phone: contactData.phone || 'Not provided',
                message: contactData.message,
                store_name: ENV.SITE.name
            };

            try {
                await window.emailjs.send(
                    this.serviceId,
                    this.templateIdStaff,
                    templateParams
                );
                console.log(`Contact form notification sent to ${staffEmail}`);
            } catch (error) {
                console.error(`Failed to send contact notification to ${staffEmail}:`, error);
            }
        }
    }
}

const emailService = new EmailService();
export default emailService;