const express = require('express');
const tourController = require('./../controllers/tourController');
import { getAllTours, createTour, getTour, updateTour, deleteTour, aliasTopTours, getTourStats } from "../controllers/tourController";
import { Tour } from "../models/tourModels";

const router = express.Router();



router
  .route('/')
  .get(getAllTours)
  .post( createTour);

  router
  .route('/top-5-cheap')
  .get(aliasTopTours, getAllTours)

  router
  .route('/tour-stats')
  .get(getTourStats)
  

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

export default  router;