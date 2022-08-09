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
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.deleteMe = exports.updateUserDetails = exports.getAllUsers = void 0;
const userModels_1 = require("../models/userModels");
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = require("../utils/catchAsync");
exports.getAllUsers = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModels_1.User.find();
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users,
        },
    });
}));
const filterObj = (obj, ...allowedFields) => {
    const outputObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el))
            outputObj[el] = obj[el];
    });
    return outputObj;
};
exports.updateUserDetails = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.password || req.body.passwordConfirm)
        return next(new appError_1.default('Unauthorized', 400));
    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = yield userModels_1.User.findByIdAndUpdate(req['user'].id, filteredBody, { new: true, runValidators: true });
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
}));
exports.deleteMe = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield userModels_1.User.findByIdAndUpdate(req['user'].id, { active: false });
    res.status(204).json({
        status: 'success',
        data: null
    });
}));
const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};
exports.getUser = getUser;
const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};
exports.createUser = createUser;
const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};
exports.updateUser = updateUser;
const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map