import { Request, Response, NextFunction } from "express";
import {User} from '../models/userModels'
import APIFeatures from '../utils/apiFeatures';
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