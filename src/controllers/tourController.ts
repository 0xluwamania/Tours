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

export const getTour = (req: Request, res: Response) => {
  console.log(req.params);
  const id = Number(req.params.id);

//   const tour = tours.find(el => el.id === id);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour
//     }
//   });
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


export const updateTour = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
};

export const deleteTour = (req: Request, res: Response) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};
