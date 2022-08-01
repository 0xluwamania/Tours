"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const tourController = require('./../controllers/tourController');
const tourController_1 = require("../controllers/tourController");
const authController_1 = require("../controllers/authController");
const router = express.Router();
router
    .route('/')
    .get(authController_1.auth, tourController_1.getAllTours)
    .post(tourController_1.createTour);
router
    .route('/top-5-cheap')
    .get(tourController_1.aliasTopTours, tourController_1.getAllTours);
router
    .route('/tour-stats')
    .get(tourController_1.getTourStats);
router
    .route('/monthly-plan/:year')
    .get(tourController_1.getMonthlyPlan);
router
    .route('/:id')
    .get(tourController_1.getTour)
    .patch(tourController_1.updateTour)
    .delete(tourController_1.deleteTour);
exports.default = router;
//# sourceMappingURL=tours.js.map