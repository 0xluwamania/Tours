import { Request, Response, NextFunction } from 'express';
import { Tour } from '../models/tourModels';
import APIFeatures from '../utils/apiFeatures';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/appError';
import { createOne, deleteOne, getAll, getOne, updateOne } from './handlerFactory';

const fs = require('fs');

export const getAllTours = getAll(Tour)

export const getTour = getOne(Tour, {path: 'reviews'})

export const createTour = createOne(Tour)

export const updateTour = updateOne(Tour)

export const deleteTour = deleteOne(Tour)

export const aliasTopTours = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.field = 'name,price,ratingsAverage,summary,difficulty';
    next();
});

export const getTourStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
 
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: {$toUpper: "$difficulty"},
          numTours: {$sum: 1},
          numRatings: {$sum: "$ratingsQuantity"},
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        },
      },
      {
        $sort : {avgRating: 1}
      }
    ]);
    console.log(stats);
    res.status(204).json({
      status: 'success',
        data: {stats},
    });
});

export const getMonthlyPlan = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const year = Number(req.params.year);
        const plan = await Tour.aggregate([
           { $unwind: '$startDates'},
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
                _id: {$month: "$startDates"},
                numTours: {$sum: 1},
                tours: {$push: "$name"}
            }
           },
           {
            $addFields: {month: "$_id"}
           },
           {
            $project: {_id: 0}
           },
           {
            $sort: {numTours: -1}
           }
        ])
        // console.log(plan)
        res.status(201).json({
            status: 'success',
              data: {plan},
          });
  
})


