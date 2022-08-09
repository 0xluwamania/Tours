import express, {Request, Response, NextFunction, response} from 'express'
import fs from "fs";
import path from "path"
import morgan from 'morgan'
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import hpp from "hpp"
import xss from 'xss-clean'
const app = express();
import { errorHandler } from './controllers/errorController';



import tourRouter from './routes/tours';
import userRouter from './routes/users';
import AppError from './utils/appError';



// 1) MIDDLEWARES
app.use(helmet())
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests'
})
app.use('/api', limiter)
app.use(express.json({limit: '10kb'}));
app.use(ExpressMongoSanitize());
app.use(xss());
app.use(hpp({
  whitelist: ["duration", "difficulty", "ratingsQuantity", "ratingsAverage", "maxGroupSize"]
}))
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

