import express, {Request, Response, NextFunction, response} from 'express'

export const errorHandler = (err, req: Request, res: Response )=> {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
    
}