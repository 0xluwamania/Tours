import path from "path";
import { Request, Response, NextFunction } from "express";
import { Tour } from "../models/tourModels";

const fs = require('fs');







export const getAllTours = async (req: Request, res: Response) => {
    try {
        const tours = await Tour.find();
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error
        })
    }

};

export const getTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.findById(req.params.id)
    res.status(200).json({
        status: 'success',
        data: {
          tour
        }
      });
  } catch (error) {
    res.status(404).json({
        status: 'failed',
        message: error
    })
  }


};

export const createTour = async (req: Request, res: Response) => {
    try {
        
        const newTour =  await Tour.create(req.body)
  
          res.status(201).json({
            status: 'success',
            data: {
              tour: newTour
            }
    })
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error
        })
    }
 

}


export const updateTour = async (req: Request, res: Response) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: 'success',
            data: {
              tour
            }
          });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error
        })
    }
 
};

export const deleteTour = async (req: Request, res: Response) => {
    try {
    const tour = await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: 'success',
            data: tour
          });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error
        })
    }
  
};
