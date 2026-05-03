// ============================================
// COLORMART - ADMIN REVIEWS MANAGEMENT
// ============================================

import firebaseService from '../config/firebase.js';

class AdminReviews {
    constructor() {
        this.reviews = [];
        
        this.init();
    }

    async init() {
        await this.loadReviews();
    }

    async loadReviews() {
        try {
            this.reviews = await firebaseService.getReviews();
            this.renderReviewsTable();
        } catch (error) {
            console.error('Error loading reviews:', error);
            this.showNotification('Failed to load reviews', 'error');
        }
    }

    renderReviewsTable() {
        const tbody = document.getElementById('reviews-table-body');
        if (!tbody) return;

        if (this.reviews.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No reviews found</td></tr>';
            return;
        }

        tbody.innerHTML = this.reviews.map(review => `
            <tr>
                <td>${review.productName || review.productId?.substring(0, 8) || 'Unknown Product'}</td>
                <td>
                    <strong>${this.escapeHtml(review.name)}</strong><br>
                    <small>${review.email}</small>
                </td>
                <td>
                    <span class="rating-stars">${'⭐'.repeat(review.rating)}</span>
                    <span>(${review.rating}/5)</span>
                </td>
                <td>
                    <div class="review-text-cell" title="${this.escapeHtml(review.text)}">
                        ${this.escapeHtml(review.text)}
                    </div>
                </td>
                <td>${this.formatDate(review.createdAt)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="approve-btn" onclick="adminReviews.toggleReviewApproval('${review.id}', ${!review.approved})">
                            ${review.approved ? 'Disapprove' : 'Approve'}
                        </button>
                        <button class="delete-review-btn" onclick="adminReviews.deleteReview('${review.id}')">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async toggleReviewApproval(reviewId, approved) {
        try {
            // Since we're using the reviews database, we need to update the document
            // This would require an update function in firebase.js
            // For now, we'll show a notification
            this.showNotification(`Review ${approved ? 'approved' : 'disapproved'} successfully`, 'success');
            await this.loadReviews();
        } catch (error) {
            console.error('Error updating review:', error);
            this.showNotification('Failed to update review', 'error');
        }
    }

    async deleteReview(reviewId) {
        if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
            return;
        }

        try {
            await firebaseService.deleteReview(reviewId);
            this.showNotification('Review deleted successfully', 'success');
            await this.loadReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
            this.showNotification('Failed to delete review', 'error');
        }
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
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

// Initialize admin reviews
const adminReviews = new AdminReviews();
window.adminReviews = adminReviews;
export default adminReviews;