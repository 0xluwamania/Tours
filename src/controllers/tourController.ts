import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { Tour } from '../models/tourModels';
import APIFeatures from '../utils/apiFeatures';
import request from 'superagent';

const fs = require('fs');

export const getAllTours = async (req: Request, res: Response) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error,
    });
  }
};

export const getTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error,
    });
  }
};

export const createTour = async (req: Request, res: Response) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error,
    });
  }
};

export const updateTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error,
    });
  }
};

export const deleteTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: tour,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error,
    });
  }
};

export const aliasTopTours = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.field = 'name,price,ratingsAverage,summary,difficulty';
    next();
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error,
    });
  }
};

export const getTourStats = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error,
    });
  }
};

export const getMonthlyPlan = async (req: Request, res: Response) => {
    try {
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
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error,
          });
    }
}
