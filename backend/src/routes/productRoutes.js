const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products — Lấy danh sách sản phẩm (phân trang, filter, search)
router.get('/', productController.getProducts);

// GET /api/products/:slug — Lấy chi tiết sản phẩm theo slug
router.get('/:slug', productController.getProductBySlug);

// POST /api/products — Tạo sản phẩm mới
router.post('/', productController.createProduct);

// PUT /api/products/:id — Cập nhật sản phẩm theo ID
router.put('/:id', productController.updateProduct);

// DELETE /api/products/:id — Xóa sản phẩm theo ID
router.delete('/:id', productController.deleteProduct);

module.exports = router;
