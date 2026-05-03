// ============================================
// COLORMART - ADMIN CONTACTS MANAGEMENT
// ============================================

import firebaseService from '../config/firebase.js';

class AdminContacts {
    constructor() {
        this.contacts = [];
        
        this.init();
    }

    async init() {
        await this.loadContacts();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Refresh contacts every 30 seconds
        setInterval(() => {
            this.loadContacts();
        }, 30000);
    }

    async loadContacts() {
        try {
            this.contacts = await firebaseService.getContacts();
            this.renderContactsTable();
        } catch (error) {
            console.error('Error loading contacts:', error);
            this.showNotification('Failed to load contacts', 'error');
        }
    }

    renderContactsTable() {
        const tbody = document.getElementById('contacts-table-body');
        if (!tbody) return;

        if (this.contacts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No messages found</td></tr>';
            return;
        }

        tbody.innerHTML = this.contacts.map(contact => `
            <tr class="${!contact.read ? 'unread-row' : ''}">
                <td>
                    <span class="read-badge ${contact.read ? 'read' : 'unread'}"></span>
                    <strong>${this.escapeHtml(contact.name)}</strong>
                </td>
                <td>
                    <a href="mailto:${this.escapeHtml(contact.email)}">${this.escapeHtml(contact.email)}</a>
                </td>
                <td>${contact.phone ? this.escapeHtml(contact.phone) : 'N/A'}</td>
                <td>
                    <div class="message-cell" title="${this.escapeHtml(contact.message)}">
                        ${this.escapeHtml(contact.message)}
                    </div>
                </td>
                <td>${this.formatDate(contact.createdAt)}</td>
                <td>
                    <div class="action-buttons">
                        ${!contact.read ? `
                            <button class="mark-read-btn" onclick="adminContacts.markAsRead('${contact.id}')">
                                Mark Read
                            </button>
                        ` : ''}
                        <button class="view-message-btn" onclick="adminContacts.viewMessage('${contact.id}')">
                            View
                        </button>
                        <button class="delete-message-btn" onclick="adminContacts.deleteContact('${contact.id}')">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    viewMessage(contactId) {
        const contact = this.contacts.find(c => c.id === contactId);
        if (!contact) return;

        // Create a modal to display full message
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Message Details</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="order-detail-content" style="padding: 2rem;">
                    <div class="order-info-group">
                        <h3>Sender Information</h3>
                        <p><strong>Name:</strong> ${this.escapeHtml(contact.name)}</p>
                        <p><strong>Email:</strong> <a href="mailto:${this.escapeHtml(contact.email)}">${this.escapeHtml(contact.email)}</a></p>
                        <p><strong>Phone:</strong> ${contact.phone ? this.escapeHtml(contact.phone) : 'N/A'}</p>
                        <p><strong>Date:</strong> ${this.formatDate(contact.createdAt)}</p>
                    </div>
                    <div class="order-info-group">
                        <h3>Message</h3>
                        <p style="white-space: pre-wrap;">${this.escapeHtml(contact.message)}</p>
                    </div>
                    <div class="form-actions" style="margin-top: 2rem;">
                        <button class="cancel-btn" onclick="this.closest('.modal').remove()">Close</button>
                        <a href="mailto:${this.escapeHtml(contact.email)}" class="save-btn" style="text-decoration: none; display: inline-block;">
                            Reply via Email
                        </a>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Mark as read when viewing
        if (!contact.read) {
            this.markAsRead(contactId);
        }
    }

    async markAsRead(contactId) {
        try {
            await firebaseService.markContactAsRead(contactId);
            
            // Update local data
            const contact = this.contacts.find(c => c.id === contactId);
            if (contact) {
                contact.read = true;
            }
            
            this.renderContactsTable();
        } catch (error) {
            console.error('Error marking contact as read:', error);
            this.showNotification('Failed to mark as read', 'error');
        }
    }

    async deleteContact(contactId) {
        if (!confirm('Are you sure you want to delete this message?')) {
            return;
        }

        try {
            await firebaseService.deleteContact(contactId);
            this.showNotification('Message deleted successfully', 'success');
            await this.loadContacts();
        } catch (error) {
            console.error('Error deleting contact:', error);
            this.showNotification('Failed to delete message', 'error');
        }
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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

// Initialize admin contacts
const adminContacts = new AdminContacts();
window.adminContacts = adminContacts;
export default adminContacts;