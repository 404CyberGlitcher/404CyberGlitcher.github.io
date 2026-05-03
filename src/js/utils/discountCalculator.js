// ============================================
// COLORMART - DISCOUNT CALCULATOR UTILITY
// ============================================

class DiscountCalculator {
    calculateDiscount(originalPrice, salePrice) {
        if (!originalPrice || !salePrice || originalPrice <= 0 || salePrice <= 0) {
            return {
                discountAmount: 0,
                discountPercentage: 0,
                hasDiscount: false
            };
        }

        if (salePrice >= originalPrice) {
            return {
                discountAmount: 0,
                discountPercentage: 0,
                hasDiscount: false
            };
        }

        const discountAmount = originalPrice - salePrice;
        const discountPercentage = Math.round((discountAmount / originalPrice) * 100);

        return {
            discountAmount,
            discountPercentage,
            hasDiscount: true
        };
    }

    formatDiscount(discountPercentage) {
        return `-${discountPercentage}% OFF`;
    }

    calculateSavings(originalPrice, salePrice) {
        const { discountAmount } = this.calculateDiscount(originalPrice, salePrice);
        return discountAmount;
    }

    isOnSale(product) {
        return product.originalPrice > product.salePrice && product.salePrice > 0;
    }

    getDiscountBadge(product) {
        if (!this.isOnSale(product)) return null;
        
        const { discountPercentage } = this.calculateDiscount(
            product.originalPrice, 
            product.salePrice
        );
        
        return {
            text: this.formatDiscount(discountPercentage),
            percentage: discountPercentage
        };
    }
}

const discountCalculator = new DiscountCalculator();
export default discountCalculator;