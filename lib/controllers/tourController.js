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
exports.getMonthlyPlan = exports.getTourStats = exports.aliasTopTours = exports.deleteTour = exports.updateTour = exports.createTour = exports.getTour = exports.getAllTours = void 0;
const tourModels_1 = require("../models/tourModels");
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const catchAsync_1 = require("../utils/catchAsync");
const appError_1 = __importDefault(require("../utils/appError"));
const fs = require('fs');
exports.getAllTours = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const features = new apiFeatures_1.default(tourModels_1.Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const tours = yield features.query;
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours,
        },
    });
}));
exports.getTour = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tour = yield tourModels_1.Tour.findById(req.params.id).populate("reviews");
    if (!tour)
        return next(new appError_1.default('No Tour with Such ID in the DB', 404));
    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
}));
exports.createTour = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newTour = yield tourModels_1.Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour,
        },
    });
}));
exports.updateTour = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tour = yield tourModels_1.Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!tour)
        return next(new appError_1.default('No Tour with Such ID in the DB', 404));
    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
}));
exports.deleteTour = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tour = yield tourModels_1.Tour.findByIdAndDelete(req.params.id);
    if (!tour)
        return next(new appError_1.default('No Tour with Such ID in the DB', 404));
    res.status(204).json({
        status: 'success',
        data: tour,
    });
}));
exports.aliasTopTours = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.field = 'name,price,ratingsAverage,summary,difficulty';
    next();
}));
exports.getTourStats = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield tourModels_1.Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: { $toUpper: "$difficulty" },
                numTours: { $sum: 1 },
                numRatings: { $sum: "$ratingsQuantity" },
                avgRating: { $avg: "$ratingsAverage" },
                avgPrice: { $avg: "$price" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" }
            },
        },
        {
            $sort: { avgRating: 1 }
        }
    ]);
    console.log(stats);
    res.status(204).json({
        status: 'success',
        data: { stats },
    });
}));
exports.getMonthlyPlan = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const year = Number(req.params.year);
    const plan = yield tourModels_1.Tour.aggregate([
        { $unwind: '$startDates' },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: "$startDates" },
                numTours: { $sum: 1 },
                tours: { $push: "$name" }
            }
        },
        {
            $addFields: { month: "$_id" }
        },
        {
            $project: { _id: 0 }
        },
        {
            $sort: { numTours: -1 }
        }
    ]);
    // console.log(plan)
    res.status(201).json({
        status: 'success',
        data: { plan },
    });
}));
//# sourceMappingURL=tourController.js.map