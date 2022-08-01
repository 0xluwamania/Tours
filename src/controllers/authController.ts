import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import {User, correctPasswordCheck} from "../models/userModels";
import { catchAsync} from "../utils/catchAsync";
import { jwtSecret, jwtExpire } from '../env';
import AppError from '../utils/appError';


const signToken = id => {
    return jwt.sign({id: id}, `${jwtSecret}`, {
        expiresIn: jwtExpire
    } )
}

export const signup = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
    const {name, email, password, passwordConfirm} = req.body
    const newUser = await User.create({name, email, password, passwordConfirm} );

    const token = signToken(newUser._id)
    res.status(201).json({
        status: 'success',
        token,
        user: newUser
    })
})

export const login = catchAsync (async(req: Request, res: Response, next: NextFunction)=> {
    let {email, password} = req.body;
    if(!email || !req.body.password) return next(new AppError('email or password not supplied', 400));
    const user = await User.findOne({email});
    if(!user || !(await correctPasswordCheck(`${password}`, `${user.password}`))){
        return next(new AppError('email or password incorrect', 401))
    }
    const token = signToken(user._id);
    res.status(201).json({
        status: 'success',
        token,
        user: user
    })
   
})

export const auth = catchAsync (async(req: Request, res: Response, next: NextFunction)=> {
    let token = '';
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
        console.log(token)
    }
    if(!token) return next(new AppError('Unauthorized. Please login', 401))
    next();
})