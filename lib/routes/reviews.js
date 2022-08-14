"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const reviewController_1 = require("../controllers/reviewController");
//So that it can take params from previous params not identified in this route
const router = express_1.default.Router({ mergeParams: true });
router.route('/').get(reviewController_1.getAllReviews).post(authController_1.auth, (0, authController_1.restrict)('user'), reviewController_1.setTourUserIds, reviewController_1.createReview);
router.route('/:id').patch(reviewController_1.updateReview).delete(reviewController_1.deleteReview).get(reviewController_1.getReview);
exports.default = router;
//# sourceMappingURL=reviews.js.map