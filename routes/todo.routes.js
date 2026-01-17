import validate from '../middlewares/validate.js';
import{createTodoSchema,updateTodoSchema,getTodosSchema,idParamSchema} from '../schemas/todo.schema.js';
import {getTodos,createTodo,updateTodo,deleteTodo,restoreTodo} from '../controllers/todo.controllers.js';
import protect from '../middlewares/auth.middleware.js';
import express from 'express';

const router = express.Router();

router.use(protect);

router.get('/',validate(getTodosSchema),getTodos);

router.post('/',validate(createTodoSchema),createTodo);

router.put('/:id',validate(updateTodoSchema),updateTodo);

router.patch('/restore/:id',validate(idParamSchema),restoreTodo);

router.delete('/:id',validate(idParamSchema),deleteTodo);

export default router;