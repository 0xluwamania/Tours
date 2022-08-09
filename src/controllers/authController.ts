import {promisify} from 'util'
import crypto from 'crypto'
import {Request, Response, NextFunction} from 'express'
import jwt, {JwtPayload} from 'jsonwebtoken'
import {User, correctPasswordCheck, changedPasswordAfter, createPasswordResetToken} from "../models/userModels";
import { catchAsync} from "../utils/catchAsync";
import { jwtSecret, jwtExpire } from '../env';
import AppError from '../utils/appError';
import sendEmail from '../utils/email';
import { jwtCookieExpire } from '../env';


const signToken = id => {
    return jwt.sign({id: id}, `${jwtSecret}`, {
        expiresIn: jwtExpire
    } )
}


const createSendToken = (user: any, statusCode: number, res: Response)=> {
    const token = signToken(user._id)
    const cookieOptions = {
        expires: new Date(Date.now() + Number(jwtCookieExpire) * 24 * 60 * 60 * 1000 ),
        httpOnly: true
    }
    if(process.env.NODE_ENV === 'production') cookieOptions['secure']= true;
    if(jwtCookieExpire){
        res.cookie('token', token, cookieOptions)
    }
    user.password = undefined
   
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

export const signup = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
    const {name, email, password, passwordConfirm, passwordChangedAt, role} = req.body
    const newUser = await User.create({name, email, password, passwordConfirm, passwordChangedAt, role} );
    createSendToken(newUser, 201, res);
})

export const login = catchAsync (async(req: Request, res: Response, next: NextFunction)=> {
    let {email, password} = req.body;
    if(!email || !req.body.password) return next(new AppError('email or password not supplied', 400));
    const user = await User.findOne({email});
    if(!user || !(await correctPasswordCheck(`${password}`, `${user.password}`))){
        return next(new AppError('email or password incorrect', 401))
    }
    createSendToken(user, 200, res);
})

export const auth = catchAsync (async(req: Request, res: Response, next: NextFunction)=> {
    let token = '';
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token) return next(new AppError('Unauthorized. Please login', 401))
    
    const {id, iat}: any = jwt.verify(token, `${jwtSecret}`);
    const user= await User.findById(id);
    if(!user) {
        return next(new AppError('Bad Token. Unauthorized', 401))
    }
    if(user){
       if(changedPasswordAfter(user.passwordChangedAt, iat)) return next(new AppError('Unauthorized, Password changed', 401))
    }
    req["user"] = user 
    console.log(req['user'])
    next();
})

export const restrict = (...roles)=> {
    return (req: Request, res: Response, next: NextFunction)=> {
       if(!roles.includes(req['user'].role)){
            throw next(new AppError('Unauthorized. You do not have permission', 403))
        }
        console.log(req['user'].role)
        next()
    }
}
export const forgotPassword = catchAsync( async(req: Request, res: Response, next: NextFunction)=> {
            let user = await User.findOne({email: req.body.email});
            if(!user) return next(new AppError('Account not available', 404));
            const resetToken = createPasswordResetToken(user)
            await user.save({validateBeforeSave: false});
            const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

            const message = `Forgot password. Please click on link below to reset password. \n ${resetUrl} \n Please ignore if you did not forget password`

            try {
                await sendEmail({
                    email: user.email,
                    message,
                    subject: 'Reset link valid for 10 minutes'
                })
    
                res.status(200).json({
                    status: 'success',
                    message: "email reset link sent"
                })
            } catch (error) {
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                await user.save({validateBeforeSave: false});

                return next(new AppError('There was an error sending the reset email. Please try again later', 500))
            }
           
})

export const resetPassword = catchAsync( async (req: Request, res: Response, next: NextFunction)=> {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({token: hashedToken, passwordResetExpires: {$gt: Date.now()}})
    if(!user) return next(new AppError('Token Expired', 400));
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save()
    createSendToken(user, 200, res);
})

export const updatePassword = catchAsync( async (req: Request, res: Response, next: NextFunction)=> {
        const {oldPassword, password, passwordConfirm} = req.body
        const user = req['user'];
        console.log(user)
        if(!await correctPasswordCheck(`${oldPassword}`, `${user.password}`)){
            return next(new AppError('Incorrect Password', 401))
        }
        user.password = password;
        user.passwordConfirm = passwordConfirm;
        await user.save();
        createSendToken(user, 200, res);
})