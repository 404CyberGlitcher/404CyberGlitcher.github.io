// ============================================
// COLORMART - REVIEW SYSTEM COMPONENT
// ============================================

import firebaseService from '../config/firebase.js';

class ReviewSystem {
    constructor() {
        this.currentProductId = null;
    }

    async loadReviews(productId, containerId) {
        this.currentProductId = productId;
        const container = document.getElementById(containerId);
        if (!container) return;

        try {
            const reviews = await firebaseService.getReviews(productId);
            this.renderReviews(reviews, container);
        } catch (error) {
            console.error('Error loading reviews:', error);
            container.innerHTML = '<p>Failed to load reviews.</p>';
        }
    }

    renderReviews(reviews, container) {
        if (reviews.length === 0) {
            container.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to review this product!</p>';
            return;
        }

        const averageRating = this.calculateAverageRating(reviews);
        
        container.innerHTML = `
            <div class="reviews-summary">
                <div class="average-rating">
                    <span class="rating-number">${averageRating}</span>
                    <div class="rating-stars">${this.renderStars(averageRating)}</div>
                    <span class="review-count">(${reviews.length} reviews)</span>
                </div>
            </div>
            <div class="reviews-list">
                ${reviews.map(review => this.renderReviewItem(review)).join('')}
            </div>
        `;
    }

    renderReviewItem(review) {
        const date = new Date(review.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <div class="review-item">
                <div class="review-item-header">
                    <h4>${this.escapeHtml(review.name)}</h4>
                    <div class="review-item-rating">${this.renderStars(review.rating)}</div>
                </div>
                <p class="review-item-text">${this.escapeHtml(review.text)}</p>
                <div class="review-item-date">${date}</div>
            </div>
        `;
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return '⭐'.repeat(fullStars) + 
               (halfStar ? '✨' : '') + 
               '☆'.repeat(emptyStars);
    }

    calculateAverageRating(reviews) {
        if (!reviews.length) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    }

    async submitReview(productId, reviewData) {
        try {
            const review = {
                productId,
                name: reviewData.name,
                email: reviewData.email,
                rating: parseInt(reviewData.rating),
                text: reviewData.text,
                createdAt: new Date().toISOString()
            };

            await firebaseService.addReview(review);
            
            // Reload reviews
            await this.loadReviews(productId, 'reviews-list');
            
            // Reset form
            const form = document.getElementById('review-form');
            if (form) form.reset();
            
            return { success: true, message: 'Review submitted successfully!' };
        } catch (error) {
            console.error('Error submitting review:', error);
            return { success: false, message: 'Failed to submit review. Please try again.' };
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const reviewSystem = new ReviewSystem();
export default reviewSystem;