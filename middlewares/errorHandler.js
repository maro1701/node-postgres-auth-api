import { ZodError } from 'zod';

export default function errorHandler(err, req, res, next) {
  // Log full error for debugging
  console.error(err);

  // -------------------------
  // Zod validation errors
  // -------------------------
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      errors: err.errors.map(e => ({
        field: e.path[0],
        message: e.message
      }))
    });
  }

  // -------------------------
  // JWT errors
  // -------------------------
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // -------------------------
  // PostgreSQL errors
  // -------------------------
  if (err.code) {
    switch (err.code) {
      case '23505': // unique violation
        return res.status(409).json({
          success: false,
          message: 'Resource already exists'
        });

      case '23503': // foreign key violation
        return res.status(400).json({
          success: false,
          message: 'Invalid reference'
        });

      case '23502': // not null violation
        return res.status(400).json({
          success: false,
          message: 'Missing required field'
        });

      case '22P02': // invalid input syntax
        return res.status(400).json({
          success: false,
          message: 'Invalid input format'
        });
    }
  }

  // -------------------------
  // Custom app errors
  // -------------------------
  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message
    });
  }

  // -------------------------
  // Fallback (unknown errors)
  // -------------------------
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
}
