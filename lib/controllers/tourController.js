"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTour = exports.updateTour = exports.createTour = exports.getTour = exports.getAllTours = void 0;
const fs = require('fs');
const getAllTours = (req, res) => {
    //   console.log(req.requestTime);
    //   res.status(200).json({
    //     status: 'success',
    //     // requestedAt: req.requestTime,
    //     results: tours.length,
    //     data: {
    //       tours
    //     }
    //   });
};
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
const createTour = (req, res) => {
    // console.log(req.body);
    err => {
        res.status(201).json({
            status: 'success',
            // data: {
            //   tour: newTour
            // }
        });
    };
};
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