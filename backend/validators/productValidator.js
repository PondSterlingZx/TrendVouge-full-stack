// validators/productValidator.js

/**
 * Validates product data before saving
 * @param {Object} data - The product data to validate
 * @returns {Object} Validation result with success status and optional errors
 */
export const validateProduct = (data) => {
    const errors = [];

    // Required field checks
    const requiredFields = ['name', 'description', 'price', 'category', 'subCategory', 'sizes'];
    requiredFields.forEach(field => {
        if (!data[field]) {
            errors.push(`${field} is required`);
        }
    });

    // Name validation
    if (data.name && (data.name.length < 3 || data.name.length > 100)) {
        errors.push('Name must be between 3 and 100 characters');
    }

    // Description validation
    if (data.description && (data.description.length < 10 || data.description.length > 1000)) {
        errors.push('Description must be between 10 and 1000 characters');
    }

    // Price validation
    if (data.price) {
        const price = Number(data.price);
        if (isNaN(price) || price <= 0) {
            errors.push('Price must be a positive number');
        }
    }

    // Sizes validation
    if (data.sizes) {
        let sizesArray;
        try {
            sizesArray = typeof data.sizes === 'string' ? JSON.parse(data.sizes) : data.sizes;
            
            if (!Array.isArray(sizesArray) || sizesArray.length === 0) {
                errors.push('Sizes must be a non-empty array');
            } else {
                // Check if using new format with dimensions
                const hasDetailedSizes = sizesArray.some(size => size.dimensions);
                
                if (hasDetailedSizes) {
                    sizesArray.forEach((size, index) => {
                        if (!size.size) {
                            errors.push(`Size name is required for size at index ${index}`);
                        }
                        if (size.dimensions) {
                            const { chest, length, shoulder } = size.dimensions;
                            if (chest && (isNaN(chest) || chest <= 0)) {
                                errors.push(`Invalid chest measurement for size ${size.size}`);
                            }
                            if (length && (isNaN(length) || length <= 0)) {
                                errors.push(`Invalid length measurement for size ${size.size}`);
                            }
                            if (shoulder && (isNaN(shoulder) || shoulder <= 0)) {
                                errors.push(`Invalid shoulder measurement for size ${size.size}`);
                            }
                        }
                        if (typeof size.stock !== 'undefined' && (isNaN(size.stock) || size.stock < 0)) {
                            errors.push(`Invalid stock value for size ${size.size}`);
                        }
                    });
                }
            }
        } catch (error) {
            errors.push('Invalid sizes format');
        }
    }

    // Categories validation
    if (data.categories) {
        try {
            const categoriesArray = typeof data.categories === 'string' 
                ? JSON.parse(data.categories) 
                : data.categories;

            if (Array.isArray(categoriesArray)) {
                categoriesArray.forEach((cat, index) => {
                    if (!cat.main || !cat.sub) {
                        errors.push(`Both main and sub categories are required for category at index ${index}`);
                    }
                });
            }
        } catch (error) {
            errors.push('Invalid categories format');
        }
    }

    return {
        success: errors.length === 0,
        errors
    };
};

/**
 * Validates product update data
 * @param {Object} data - The product update data to validate
 * @returns {Object} Validation result with success status and optional errors
 */
export const validateUpdateProduct = (data) => {
    const errors = [];

    // Only validate fields that are present in the update
    if (data.name && (data.name.length < 3 || data.name.length > 100)) {
        errors.push('Name must be between 3 and 100 characters');
    }

    if (data.description && (data.description.length < 10 || data.description.length > 1000)) {
        errors.push('Description must be between 10 and 1000 characters');
    }

    if (data.price) {
        const price = Number(data.price);
        if (isNaN(price) || price <= 0) {
            errors.push('Price must be a positive number');
        }
    }

    if (data.sizes) {
        try {
            const sizesArray = typeof data.sizes === 'string' ? JSON.parse(data.sizes) : data.sizes;
            if (!Array.isArray(sizesArray) || sizesArray.length === 0) {
                errors.push('Sizes must be a non-empty array');
            }
            // ... (rest of sizes validation)
        } catch (error) {
            errors.push('Invalid sizes format');
        }
    }

    return {
        success: errors.length === 0,
        errors
    };
};