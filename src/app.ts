import express, {Request, Response, NextFunction, response} from 'express'
import fs from "fs";
import path from "path"
import morgan from 'morgan'
const app = express();
import { errorHandler } from './controllers/errorController';



import tourRouter from './routes/tours';
import userRouter from './routes/users';
import AppError from './utils/appError';



// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));



app.use((req: Request, res: Response, next: NextFunction) => {
  // console.log(req.headers)
  // req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req: Request, res: Response, next: NextFunction)=> {
  // res.status(404).json({
  //   status: 'Failed',
  //   message: `This ${req.originalUrl} cannot be found on this server`
  // })
  // const err = {
    // message: new Error(`This ${req.originalUrl} cannot be found on this server`),
    // statusCode: 404,
    // status: 'fail'};
    next(new AppError(`This ${req.originalUrl} cannot be found on this server`, 404))
  
})

app.use(errorHandler);


// console.log(tours)
export default app

