import { ZodError } from 'zod';

export default function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse({body:req.body,
        query:req.query,
        params:req.params
    });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          errors: err.errors.map(e => ({
            field: e.path[0],
            message: e.message
          }))
        });
      }
      next(err);
    }
  };
}
