import express from 'express';
import { createEvaluation, getEstablishmentEvaluations } from '../controllers/evalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createEvaluation);
router.get('/:est_id', getEstablishmentEvaluations);

export default router;
