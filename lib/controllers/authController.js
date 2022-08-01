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
exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModels_1 = require("../models/userModels");
const catchAsync_1 = require("../utils/catchAsync");
const env_1 = require("../env");
const appError_1 = __importDefault(require("../utils/appError"));
const signToken = id => {
    return jsonwebtoken_1.default.sign({ id: id }, `${env_1.jwtSecret}`, {
        expiresIn: env_1.jwtExpire
    });
};
exports.signup = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, passwordConfirm } = req.body;
    const newUser = yield userModels_1.User.create({ name, email, password, passwordConfirm });
    const token = signToken(newUser._id);
    res.status(201).json({
        status: 'success',
        token,
        user: newUser
    });
}));
exports.login = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    if (!email || !req.body.password)
        return next(new appError_1.default('email or password not supplied', 400));
    const user = yield userModels_1.User.findOne({ email });
    if (!user || !(yield (0, userModels_1.correctPasswordCheck)(`${password}`, `${user.password}`))) {
        return next(new appError_1.default('email or password incorrect', 401));
    }
    const token = signToken(user._id);
    res.status(201).json({
        status: 'success',
        token,
        user: user
    });
}));
//# sourceMappingURL=authController.js.map