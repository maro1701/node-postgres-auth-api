import { pool } from '../db.js';

/**
 * GET TODOS (Cursor-based pagination + filtering)
 * Query params:
 *  - limit (number)
 *  - cursor (created_at ISO string)
 *  - search (string)
 */
export async function getTodos(req, res, next) {
  try {
    const userId = req.user.id;
    const { query } = req.validated; // <--- validated query params
    const limit = query.limit;
    const cursor = query.cursor;
    const search = query.search || '';

    const values = [userId, `%${search}%`];
    let cursorCondition = '';

    if (cursor) {
      values.push(cursor);
      cursorCondition = `AND created_at < $${values.length}`;
    }

    values.push(limit);

    const result = await pool.query(`
      SELECT id, task, created_at
      FROM todos
      WHERE user_id = $1
        AND task ILIKE $2
        AND deleted_at IS NULL
        ${cursorCondition}
      ORDER BY created_at DESC
      LIMIT $${values.length};
    `, values);

    const nextCursor = result.rows.length > 0
      ? result.rows[result.rows.length - 1].created_at
      : null;

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      nextCursor,
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
}


export async function createTodo(req, res, next) {
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ message: 'Task is required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO todos (task, user_id)
       VALUES ($1, $2)
       RETURNING id, task, created_at`,
      [task, req.user.id]
    );

    return res.status(201).json({
      success: true,
      message: 'TODO CREATED!',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

export async function updateTodo(req, res, next) {
  const { id } = req.params;
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ message: 'Task is required' });
  }

  try {
    const result = await pool.query(
      `UPDATE todos
       SET task = $1
       WHERE id = $2 AND user_id = $3
       RETURNING id, task, created_at`,
      [task, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteTodo(req, res, next) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE todos
      SET deleted_at =NOW()
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
       RETURNING id`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
 
}

 export async function restoreTodo(req,res,next){
   const {id} = req.params;
   try{
      const result =await pool.query(`
         UPDATE todos
         SET deleted_at = NULL
         WHERE id =$1 AND user_id =$2 AND deleted_at IS NOT NULL
         RETURNING id, task, created_at 
         `,[id,req.user.id])
         if(result.rows.length===0){
            return res.status(404).json({
               message:'Todo not found or not deleted '
            });
         }
         return res.status(200).json({
            success:true,
            data:result.rows[0]
         });
   } catch(err){
      next(err);
   }
  }