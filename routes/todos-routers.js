import express from 'express';
import { todosController } from '../controllers/todos-controller.js';

const router = express.Router();

router.get('/', todosController.getAll);

export const todoRoutes = router;
