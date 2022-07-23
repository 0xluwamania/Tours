import path from "path";
import { Request, Response, NextFunction } from "express";
import { Tour } from "../models/tourModels";

const fs = require('fs');







export const getAllTours = (req: Request, res: Response) => {
//   console.log(req.requestTime);

//   res.status(200).json({
//     status: 'success',
//     // requestedAt: req.requestTime,
//     results: tours.length,
//     data: {
//       tours
//     }
//   });
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

export const createTour = (req: Request, res: Response) => {
  // console.log(req.body);
  err => {
          res.status(201).json({
            status: 'success',
            // data: {
            //   tour: newTour
            // }
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
