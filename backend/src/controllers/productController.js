const Product = require('../models/Product');
const mongoose = require('mongoose');

/**
 * @desc    Lấy danh sách sản phẩm (phân trang, filter, search)
 * @route   GET /api/products
 * @query   page, limit, brand, theme, search, sort, tag, isFlashSale, isLookbook
 */
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      brand,
      theme,
      search,
      sort = '-createdAt',
      tag,
      isFlashSale,
      isLookbook,
      discounted,
    } = req.query;

    const filter = {};

    if (isFlashSale === 'true') {
      filter.isFlashSale = true;
    }

    if (isLookbook === 'true') {
      filter.isLookbook = true;
    }

    if (brand) {
      filter.brand = new RegExp(brand, 'i');
    }

    if (theme) {
      filter.theme = new RegExp(theme, 'i');
    }

    if (tag) {
      filter.$or = [{ tagLeft: tag }, { tagRight: tag }];
    }

    if (discounted === 'true') {
      filter.$or = [
        { discount: { $nin: [null, ''] } },
        { originalPrice: { $nin: [null, 0], $gt: 0 } }
      ];
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { title: searchRegex },
        { brand: searchRegex },
        { theme: searchRegex },
        { description: searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('getProducts error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
    });
  }
};

/**
 * @desc    Lấy chi tiết sản phẩm theo slug hoặc id hoặc _id
 * @route   GET /api/products/:slug
 */
const getProductBySlug = async (req, res) => {
  try {
    const param = decodeURIComponent(req.params.slug);
    let product = null;

    // 1. Try matching by _id if param is valid ObjectId
    if (mongoose.Types.ObjectId.isValid(param)) {
      product = await Product.findById(param);
    }

    // 2. Try matching by numeric id or string id
    if (!product) {
      const numId = Number(param);
      if (!isNaN(numId)) {
        product = await Product.findOne({ id: numId });
      }
    }

    if (!product) {
      product = await Product.findOne({ id: param });
    }

    // 3. Try matching by slug
    if (!product) {
      product = await Product.findOne({ slug: param.toLowerCase() });
    }

    // 4. Try title matching
    if (!product) {
      const titleSearch = param.replace(/-/g, ' ');
      product = await Product.findOne({
        title: new RegExp(titleSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('getProductBySlug error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product',
    });
  }
};

/**
 * @desc    Tạo sản phẩm mới
 * @route   POST /api/products
 */
const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    if (!productData.slug && productData.title) {
      productData.slug = productData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully',
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    console.error('createProduct error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while creating product',
    });
  }
};

/**
 * @desc    Cập nhật sản phẩm theo ID / _id
 * @route   PUT /api/products/:id
 */
const updateProduct = async (req, res) => {
  try {
    const param = req.params.id;
    let product = null;

    if (mongoose.Types.ObjectId.isValid(param)) {
      product = await Product.findByIdAndUpdate(param, req.body, {
        new: true,
        runValidators: true,
      });
    }

    if (!product) {
      const numId = Number(param);
      const query = !isNaN(numId) ? { id: numId } : { id: param };
      product = await Product.findOneAndUpdate(query, req.body, {
        new: true,
        runValidators: true,
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully',
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    console.error('updateProduct error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product',
    });
  }
};

/**
 * @desc    Xóa sản phẩm theo ID / _id
 * @route   DELETE /api/products/:id
 */
const deleteProduct = async (req, res) => {
  try {
    const param = req.params.id;
    let product = null;

    if (mongoose.Types.ObjectId.isValid(param)) {
      product = await Product.findByIdAndDelete(param);
    }

    if (!product) {
      const numId = Number(param);
      const query = !isNaN(numId) ? { id: numId } : { id: param };
      product = await Product.findOneAndDelete(query);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: {},
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('deleteProduct error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product',
    });
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
