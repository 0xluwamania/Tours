import { Request, Response, NextFunction } from 'express';
import { Review } from '../models/reviewModels';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/appError';
import { createOne, deleteOne, getAll, getOne, updateOne } from './handlerFactory';

export const getAllReviews = getAll(Review)


export const setTourUserIds = (req: Request, res: Response, next: NextFunction)=> {
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req['user'].id;
    next()
}
export const getReview = getOne(Review, undefined)
export const createReview = createOne(Review)

export const deleteReview = deleteOne(Review)
export const updateReview = updateOne(Review)