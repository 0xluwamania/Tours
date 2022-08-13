import express from 'express';
import { auth, restrict } from '../controllers/authController';
import { getAllReviews, createReview, getReview } from '../controllers/reviewController';

const router = express.Router();

router.route('/').get(getAllReviews).post(auth, restrict('user'), createReview)

export default router;