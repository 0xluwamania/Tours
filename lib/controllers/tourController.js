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
exports.deleteTour = exports.updateTour = exports.createTour = exports.getTour = exports.getAllTours = void 0;
const tourModels_1 = require("../models/tourModels");
const fs = require('fs');
const getAllTours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tours = yield tourModels_1.Tour.find();
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });
    }
    catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error
        });
    }
});
exports.getAllTours = getAllTours;
const getTour = (req, res) => {
    console.log(req.params);
    const id = Number(req.params.id);
    //   const tour = tours.find(el => el.id === id);
    //   res.status(200).json({
    //     status: 'success',
    //     data: {
    //       tour
    //     }
    //   });
};
exports.getTour = getTour;
const createTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newTour = yield tourModels_1.Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    }
    catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error
        });
    }
});
exports.createTour = createTour;
const updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    });
};
exports.updateTour = updateTour;
const deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null
    });
};
exports.deleteTour = deleteTour;
//# sourceMappingURL=tourController.js.map