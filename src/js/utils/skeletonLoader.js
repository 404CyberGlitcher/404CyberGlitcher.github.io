// ============================================
// COLORMART - SKELETON LOADER UTILITY
// ============================================

class SkeletonLoader {
    createProductCardSkeleton() {
        const card = document.createElement('div');
        card.className = 'product-card skeleton-card';
        card.innerHTML = `
            <div class="product-card-image skeleton skeleton-image"></div>
            <div class="product-card-content">
                <div class="skeleton skeleton-text skeleton-title"></div>
                <div class="skeleton skeleton-text skeleton-price"></div>
            </div>
        `;
        return card;
    }

    createGridSkeleton(container, count = 4) {
        container.innerHTML = '';
        container.classList.add('skeleton-grid');
        
        for (let i = 0; i < count; i++) {
            container.appendChild(this.createProductCardSkeleton());
        }
    }

    removeSkeleton(container) {
        container.innerHTML = '';
        container.classList.remove('skeleton-grid');
    }

    createCategorySkeleton() {
        const card = document.createElement('div');
        card.className = 'category-card skeleton';
        card.style.aspectRatio = '1';
        return card;
    }

    createReviewSkeleton() {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
            <div class="review-header">
                <div class="skeleton" style="width: 48px; height: 48px; border-radius: 50%;"></div>
                <div>
                    <div class="skeleton skeleton-text" style="width: 100px;"></div>
                    <div class="skeleton skeleton-text" style="width: 80px;"></div>
                </div>
            </div>
            <div class="skeleton skeleton-text" style="width: 100%; height: 60px;"></div>
        `;
        return card;
    }
}

const skeletonLoader = new SkeletonLoader();
export default skeletonLoader;