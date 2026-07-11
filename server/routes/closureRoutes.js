import express from 'express';
import { issueClosure, getActiveClosures, reportBreach } from '../controllers/closureController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getActiveClosures)
  .post(issueClosure);

router.put('/:id/breach', reportBreach);

export default router;
