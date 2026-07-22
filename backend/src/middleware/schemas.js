const { z } = require('zod');

// ─── Product Validation Schemas ────────────────────────────────
const createProductSchema = z.object({
  brand: z.string({ required_error: 'Brand is required' }).min(1).max(100),
  title: z.string({ required_error: 'Title is required' }).min(1).max(200),
  price: z.union([
    z.number().positive('Price must be a positive number'),
    z.string().transform((val, ctx) => {
      const parsed = parseFloat(val);
      if (isNaN(parsed) || parsed <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid price number' });
        return z.NEVER;
      }
      return parsed;
    })
  ]),
  originalPrice: z.union([
    z.number().positive(),
    z.string().transform((val) => {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? undefined : parsed;
    })
  ]).optional(),
  discount: z.string().max(50).optional(),
  description: z.string().max(5000).optional(),
  imageUrl: z.string().max(1000).optional(),
  images: z.array(z.string()).optional(),
  color: z.string().max(50).optional(),
  colors: z.array(z.string()).optional(),
  theme: z.string().max(100).optional(),
  slug: z.string().max(200).optional(),
  tagLeft: z.string().max(50).optional(),
  tagRight: z.string().max(50).optional(),
  isFlashSale: z.boolean().optional(),
  isLookbook: z.boolean().optional(),
  done: z.boolean().optional(),
}).strict();

const updateProductSchema = createProductSchema.partial().strict();

// ─── Order Validation Schemas ──────────────────────────────────
const orderItemSchema = z.object({
  productId: z.string().optional(),
  _id: z.string().optional(),
  id: z.string().optional(),
  title: z.string().optional(),
  name: z.string().optional(),
  quantity: z.number().optional().default(1),
  price: z.number().optional(),
  size: z.string().optional(),
  selectedSize: z.string().optional(),
  color: z.string().optional(),
  selectedColor: z.string().optional(),
  imageUrl: z.string().optional(),
  slug: z.string().optional(),
}).passthrough();

const createOrderSchema = z.object({
  customerName: z.string({ required_error: 'Customer name is required' }).min(1).max(100),
  customerEmail: z.string({ required_error: 'Customer email is required' }).email('Invalid email address'),
  phone: z.string().optional().default(''),
  shippingAddress: z.string().optional().default(''),
  paymentMethod: z.string().optional().default('COD'),
  items: z.array(orderItemSchema).min(1, 'Order must contain at least 1 item'),
  subtotal: z.number().optional(),
  shippingFee: z.number().optional().default(0),
  notes: z.string().optional(),
}).passthrough();

const updateOrderStatusSchema = z.object({
  status: z.enum(['Pending', 'Processing', 'Completed', 'Cancelled'], {
    required_error: 'Status is required'
  }),
}).strict();

// ─── Feedback Validation Schema ────────────────────────────────
const createFeedbackSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(1).max(100),
  email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
  phone: z.string({ required_error: 'Phone is required' }).min(1).max(30),
  message: z.string({ required_error: 'Message is required' }).min(1).max(2000),
  userKey: z.string().max(100).optional(),
}).strict();

// ─── Auth Validation Schemas ──────────────────────────────────
const loginSchema = z.object({
  username: z.string().max(100).optional(),
  email: z.string().email().optional(),
  password: z.string({ required_error: 'Password is required' }).min(1),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  createOrderSchema,
  updateOrderStatusSchema,
  createFeedbackSchema,
  loginSchema,
};
