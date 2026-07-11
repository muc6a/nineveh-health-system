import express from 'express';
import { getEstablishments, createEstablishment, updateEstablishment } from '../controllers/estController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all establishment routes
router.use(protect);

router.route('/')
  .get(getEstablishments)
  .post(createEstablishment);

router.route('/:id')
  .put(updateEstablishment);

export default router;
