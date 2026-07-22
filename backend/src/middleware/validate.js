const { ZodError } = require('zod');

/**
 * Express middleware factory for Zod schema validation
 * @param {import('zod').ZodSchema} schema - Zod schema to validate req.body against
 */
const validate = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.parseAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError || error.name === 'ZodError') {
      const issueList = Array.isArray(error.errors) ? error.errors : (Array.isArray(error.issues) ? error.issues : []);
      const formattedErrors = issueList.map((err) => ({
        field: Array.isArray(err.path) ? err.path.join('.') : String(err.path || ''),
        message: err.message || 'Invalid data',
      }));

      return res.status(400).json({
        success: false,
        message: 'Invalid data (Validation error)',
        errors: formattedErrors,
      });
    }
    next(error);
  }
};

module.exports = validate;
