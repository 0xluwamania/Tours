import { Request, Response, NextFunction } from 'express';
import APIFeatures from '../utils/apiFeatures';
import AppError from '../utils/appError';
import { catchAsync } from "../utils/catchAsync";





export const deleteOne = Model => catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if(!doc) return next(new AppError('No Document with Such ID in the Database', 404))
    res.status(204).json({
      status: 'success',
      data: doc,
    });
});

export const updateOne = Model => catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if(!doc) return next(new AppError('No document with Such ID in the Database', 404))
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
 
});
export const createOne = Model => catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      },
    });
})

export const getOne = (Model, populateoptions) => catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);
    if(populateoptions) query = query.populate(populateoptions)
    const doc = await query
    if(!doc) return next(new AppError('No document with Such ID in the DB', 404))
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });

});

export const getAll = Model => catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let filter: any = {}
    if(req.params.tourId) filter.tour = req.params.tourId
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        docs,
      },
    });
 
});