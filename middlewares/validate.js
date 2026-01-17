import { ZodError } from 'zod';

export default function validate(schema) {
  return (req, res, next) => {
    try {
      // Validate all parts of the request
      const validatedData = schema.parse({
        body: req.body || {},
        query: req.query || {},
        params: req.params || {}
      });

      // Attach validated data to req.validated
      req.validated = validatedData;

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next(err); // passes to your errorHandler
      }
      next(err);
    }
  };
}
