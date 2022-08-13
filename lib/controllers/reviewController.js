"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = exports.getReview = exports.getAllReviews = void 0;
const reviewModels_1 = require("../models/reviewModels");
const catchAsync_1 = require("../utils/catchAsync");
const appError_1 = __importDefault(require("../utils/appError"));
exports.getAllReviews = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const features = new APIFeatures(Review.find(), req.query)
    // .filter()
    // .sort()
    // .limitFields()
    // .paginate();
    // const reviews = await features.query;
    const reviews = yield reviewModels_1.Review.find();
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews,
        },
    });
}));
exports.getReview = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const review = reviewModels_1.Review.findById({ id });
    if (!review)
        return next(new appError_1.default('No Review with Such ID in the DB', 404));
    res.status(200).json({
        status: 'success',
        data: {
            review,
        },
    });
}));
exports.createReview = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newReview = yield reviewModels_1.Review.create(req.body);
    res.status(200).json({
        status: 'success',
        data: {
            review: newReview,
        },
    });
}));
//# sourceMappingURL=reviewController.js.map