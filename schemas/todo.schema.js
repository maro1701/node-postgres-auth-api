import { z } from 'zod';

export const createTodoSchema = z.object({
  body: z.object({
    task: z.string().min(1, 'Task is required')
  })
});

export const updateTodoSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid todo id')
  }),
  body: z.object({
    task: z.string().min(1, 'Task is required')
  })
});



export const getTodosSchema = z.object({
  query: z.object({
    limit: z
      .string()
      .optional()
      .transform(val => {
        if (!val) return 10;        // default 10
        const n = Number(val);
        if (isNaN(n) || n <= 0 || n > 50) throw new Error('Limit must be between 1 and 50');
        return n;
      }),
    cursor: z.string().optional(),
    search: z.string().optional()
  })
});


export const idParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid todo id')
  })
});
