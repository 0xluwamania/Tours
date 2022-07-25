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
exports.getTourStats = exports.aliasTopTours = exports.deleteTour = exports.updateTour = exports.createTour = exports.getTour = exports.getAllTours = void 0;
const tourModels_1 = require("../models/tourModels");
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const fs = require('fs');
const getAllTours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
    }
    catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error,
        });
    }
});
exports.getAllTours = getAllTours;
const getTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tour = yield tourModels_1.Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    }
    catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error,
        });
    }
});
exports.getTour = getTour;
const createTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newTour = yield tourModels_1.Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour,
            },
        });
    }
    catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error,
        });
    }
});
exports.createTour = createTour;
const updateTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tour = yield tourModels_1.Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    }
    catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error,
        });
    }
});
exports.updateTour = updateTour;
const deleteTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tour = yield tourModels_1.Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: tour,
        });
    }
    catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error,
        });
    }
});
exports.deleteTour = deleteTour;
const aliasTopTours = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.query.limit = '5';
        req.query.sort = '-ratingsAverage,price';
        req.query.field = 'name,price,ratingsAverage,summary,difficulty';
        next();
    }
    catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error,
        });
    }
});
exports.aliasTopTours = aliasTopTours;
const getTourStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
            //   data: stats,
        });
    }
    catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error,
        });
    }
});
exports.getTourStats = getTourStats;
//# sourceMappingURL=tourController.js.map