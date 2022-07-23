import express, {Request, Response, NextFunction} from 'express'
import fs from "fs";
import path from "path"
import morgan from 'morgan'
const app = express();



import tourRouter from './routes/tours';
import userRouter from './routes/users';



// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
//   req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);




// console.log(tours)
export default app

