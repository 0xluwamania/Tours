"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.restrict = exports.auth = exports.login = exports.signup = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModels_1 = require("../models/userModels");
const catchAsync_1 = require("../utils/catchAsync");
const env_1 = require("../env");
const appError_1 = __importDefault(require("../utils/appError"));
const email_1 = __importDefault(require("../utils/email"));
const env_2 = require("../env");
const signToken = id => {
    return jsonwebtoken_1.default.sign({ id: id }, `${env_1.jwtSecret}`, {
        expiresIn: env_1.jwtExpire
    });
};
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + Number(env_2.jwtCookieExpire) * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production')
        cookieOptions['secure'] = true;
    if (env_2.jwtCookieExpire) {
        res.cookie('token', token, cookieOptions);
    }
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};
exports.signup = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, passwordConfirm, passwordChangedAt, role } = req.body;
    const newUser = yield userModels_1.User.create({ name, email, password, passwordConfirm, passwordChangedAt, role });
    createSendToken(newUser, 201, res);
}));
exports.login = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    if (!email || !req.body.password)
        return next(new appError_1.default('email or password not supplied', 400));
    const user = yield userModels_1.User.findOne({ email });
    if (!user || !(yield (0, userModels_1.correctPasswordCheck)(`${password}`, `${user.password}`))) {
        return next(new appError_1.default('email or password incorrect', 401));
    }
    createSendToken(user, 200, res);
}));
exports.auth = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token)
        return next(new appError_1.default('Unauthorized. Please login', 401));
    const { id, iat } = jsonwebtoken_1.default.verify(token, `${env_1.jwtSecret}`);
    const user = yield userModels_1.User.findById(id);
    if (!user) {
        return next(new appError_1.default('Bad Token. Unauthorized', 401));
    }
    if (user) {
        if ((0, userModels_1.changedPasswordAfter)(user.passwordChangedAt, iat))
            return next(new appError_1.default('Unauthorized, Password changed', 401));
    }
    req["user"] = user;
    console.log(req['user']);
    next();
}));
const restrict = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req['user'].role)) {
            throw next(new appError_1.default('Unauthorized. You do not have permission', 403));
        }
        console.log(req['user'].role);
        next();
    };
};
exports.restrict = restrict;
exports.forgotPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield userModels_1.User.findOne({ email: req.body.email });
    if (!user)
        return next(new appError_1.default('Account not available', 404));
    const resetToken = (0, userModels_1.createPasswordResetToken)(user);
    yield user.save({ validateBeforeSave: false });
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot password. Please click on link below to reset password. \n ${resetUrl} \n Please ignore if you did not forget password`;
    try {
        yield (0, email_1.default)({
            email: user.email,
            message,
            subject: 'Reset link valid for 10 minutes'
        });
        res.status(200).json({
            status: 'success',
            message: "email reset link sent"
        });
    }
    catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        yield user.save({ validateBeforeSave: false });
        return next(new appError_1.default('There was an error sending the reset email. Please try again later', 500));
    }
}));
exports.resetPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedToken = crypto_1.default.createHash('sha256').update(req.params.token).digest('hex');
    const user = yield userModels_1.User.findOne({ token: hashedToken, passwordResetExpires: { $gt: Date.now() } });
    if (!user)
        return next(new appError_1.default('Token Expired', 400));
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    yield user.save();
    createSendToken(user, 200, res);
}));
exports.updatePassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, password, passwordConfirm } = req.body;
    const user = req['user'];
    console.log(user);
    if (!(yield (0, userModels_1.correctPasswordCheck)(`${oldPassword}`, `${user.password}`))) {
        return next(new appError_1.default('Incorrect Password', 401));
    }
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    yield user.save();
    createSendToken(user, 200, res);
}));
//# sourceMappingURL=authController.js.map