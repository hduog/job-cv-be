import express from 'express';
import { authMiddleware } from '~/middlewares/authMiddleware';
import { ROLE_USER } from '~/utils/constants';
import {
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getAllCategories,
} from '~/controllers/categoryController';

const router = express.Router();

router.post('/', authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN]), createCategory);
router.get('/', authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN]), getAllCategories);
router.get('/:id', authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN]), getCategoryById);
router.put('/:id', authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN]), updateCategory);
router.delete('/:id', authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN]), deleteCategory);

export const categoryRouter = router;