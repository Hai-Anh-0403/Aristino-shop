const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

const validate = require('../middleware/validate');
const { createProductSchema, updateProductSchema } = require('../middleware/schemas');

// GET /api/products — Get list of products (pagination, filter, search)
router.get('/', productController.getProducts);

// GET /api/products/:slug — Get product details by slug
router.get('/:slug', productController.getProductBySlug);

// Protected Admin Routes:
// POST /api/products — Create a new product
router.post('/', protect, validate(createProductSchema), productController.createProduct);

// PUT /api/products/:id — Update product by ID
router.put('/:id', protect, validate(updateProductSchema), productController.updateProduct);

// DELETE /api/products/:id — Delete product by ID
router.delete('/:id', protect, productController.deleteProduct);

module.exports = router;
