import express from 'express';
import { todosController } from '../controllers/todos-controller.js';

const router = express.Router();

router.get('/', todosController.getAll);
router.get('/:id', todosController.get);
router.post('/', todosController.add);
router.put('/:id', todosController.update);
router.delete('/:id', todosController.delete);

export const todoRoutes = router;
