const express = require('express');
const tourController = require('./../controllers/tourController');
import { getAllTours, createTour, getTour, updateTour, deleteTour } from "../controllers/tourController";
import { Tour } from "../models/tourModels";

const router = express.Router();



router
  .route('/')
  .get(getAllTours)
  .post( createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

export default router;