import { Request, Response, NextFunction } from "express";
import { nextTick } from "process";
import {User} from '../models/userModels'
import APIFeatures from '../utils/apiFeatures';
import AppError from "../utils/appError";
import { catchAsync } from '../utils/catchAsync';

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
  });

  const filterObj = (obj, ...allowedFields)=> {
      const outputObj: any = {};
      Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) outputObj[el] = obj[el]
      })
      return outputObj;
  }

  export const updateUserDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
          if(req.body.password || req.body.passwordConfirm) return next(new AppError('Unauthorized', 400));
          const filteredBody = filterObj(req.body, 'name', 'email');
          const updatedUser = await User.findByIdAndUpdate(req['user'].id, filteredBody, {new: true, runValidators: true} );

          res.status(200).json({
            status: 'success',
            data: {
              user: updatedUser
            }
          })
  })

  export const deleteMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await User.findByIdAndUpdate(req['user'].id, {active: false});
    res.status(204).json({
      status: 'success',
      data: null
    })
  })
  export const getUser = (req: Request, res: Response) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!'
    });
  };
  export const createUser = (req: Request, res: Response) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!'
    });
  };
  export const updateUser =(req: Request, res: Response) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!'
    });
  };
  export const deleteUser = (req: Request, res: Response) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!'
    });
  };