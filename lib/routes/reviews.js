"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const reviewController_1 = require("../controllers/reviewController");
const router = express_1.default.Router();
router.route('/').get(reviewController_1.getAllReviews).post(authController_1.auth, (0, authController_1.restrict)('user'), reviewController_1.createReview);
exports.default = router;
//# sourceMappingURL=reviews.js.map