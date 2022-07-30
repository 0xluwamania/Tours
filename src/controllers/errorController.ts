import express, {Request, Response, NextFunction, response} from 'express'
import AppError from '../utils/appError'

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}

const handleDuplicateErrorDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
    const message = `Duplicate field: ${value}`;
    return new AppError(message, 400);
}

const sendErrorDev = (err, res: Response)=> {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
      })
}

const sendErrorProd = (err, res: Response)=> {
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
          })
    }else {
        console.error('ERROR', err)
        res.status(500).json({
            status: 'fail',
            message: 'Something went wrong'
        })
    }
}

export const errorHandler = (err, req: Request, res: Response )=> {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
   if (process.env.NODE_ENV === 'development') sendErrorDev(err, res);
   else if(process.env.NODE_ENV === 'production') {
    let error = {...err};
    if(error.name === "CastError") error = handleCastErrorDB(error);
    if(error.code === 11000) error = handleDuplicateErrorDB(error)
    sendErrorProd(error, res)
}
    
}