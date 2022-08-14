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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthlyPlan = exports.getTourStats = exports.aliasTopTours = exports.deleteTour = exports.updateTour = exports.createTour = exports.getTour = exports.getAllTours = void 0;
const tourModels_1 = require("../models/tourModels");
const catchAsync_1 = require("../utils/catchAsync");
const handlerFactory_1 = require("./handlerFactory");
const fs = require('fs');
exports.getAllTours = (0, handlerFactory_1.getAll)(tourModels_1.Tour);
exports.getTour = (0, handlerFactory_1.getOne)(tourModels_1.Tour, { path: 'reviews' });
exports.createTour = (0, handlerFactory_1.createOne)(tourModels_1.Tour);
exports.updateTour = (0, handlerFactory_1.updateOne)(tourModels_1.Tour);
exports.deleteTour = (0, handlerFactory_1.deleteOne)(tourModels_1.Tour);
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