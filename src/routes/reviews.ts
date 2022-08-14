import express from 'express';
import { auth, restrict } from '../controllers/authController';
import { getAllReviews, createReview, getReview, deleteReview, updateReview, setTourUserIds } from '../controllers/reviewController';


//So that it can take params from previous params not identified in this route
const router = express.Router({mergeParams: true});

router.route('/').get(getAllReviews).post(auth, restrict('user'), setTourUserIds, createReview)
router.route('/:id').patch(updateReview).delete(deleteReview).get(getReview)

export default router;