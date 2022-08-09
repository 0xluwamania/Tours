const express = require('express');
const tourController = require('./../controllers/tourController');
import { getAllTours, createTour, getTour, updateTour, deleteTour, aliasTopTours, getTourStats, getMonthlyPlan } from "../controllers/tourController";
import { Tour } from "../models/tourModels";
import {auth, restrict} from '../controllers/authController'

const router = express.Router();



router
  .route('/')
  .get(auth, getAllTours)
  .post( createTour);

  router
  .route('/top-5-cheap')
  .get(aliasTopTours, getAllTours)

  router
  .route('/tour-stats')
  .get(getTourStats)

  router
  .route('/monthly-plan/:year')
  .get(getMonthlyPlan)
  

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(auth, restrict('admin', 'leadGuide'), deleteTour);

export default  router;