import { Request, Response, NextFunction } from 'express';
import { Review } from '../models/reviewModels';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/appError';
import APIFeatures from '../utils/apiFeatures';

export const getAllReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const features = new APIFeatures(Review.find(), req.query)
    // .filter()
    // .sort()
    // .limitFields()
    // .paginate();
    // const reviews = await features.query;
    const reviews = await Review.find()

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
          reviews,
        },
      });
});

export const getReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params
    const review = Review.findById({id})
    if(!review) return next(new AppError('No Review with Such ID in the DB', 404))
    res.status(200).json({
      status: 'success',
      data: {
        review,
      },
    });
})
export const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newReview = await Review.create(req.body);

    res.status(200).json({
        status: 'success',
        data: {
          review: newReview,
        },
      });
})