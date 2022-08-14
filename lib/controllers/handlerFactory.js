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
exports.getAll = exports.getOne = exports.createOne = exports.updateOne = exports.deleteOne = void 0;
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = require("../utils/catchAsync");
const deleteOne = Model => (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield Model.findByIdAndDelete(req.params.id);
    if (!doc)
        return next(new appError_1.default('No Document with Such ID in the Database', 404));
    res.status(204).json({
        status: 'success',
        data: doc,
    });
}));
exports.deleteOne = deleteOne;
const updateOne = Model => (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!doc)
        return next(new appError_1.default('No document with Such ID in the Database', 404));
    res.status(200).json({
        status: 'success',
        data: {
            data: doc,
        },
    });
}));
exports.updateOne = updateOne;
const createOne = Model => (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield Model.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            data: doc
        },
    });
}));
exports.createOne = createOne;
const getOne = (Model, populateoptions) => (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let query = Model.findById(req.params.id);
    if (populateoptions)
        query = query.populate(populateoptions);
    const doc = yield query;
    if (!doc)
        return next(new appError_1.default('No document with Such ID in the DB', 404));
    res.status(200).json({
        status: 'success',
        data: {
            doc,
        },
    });
}));
exports.getOne = getOne;
const getAll = Model => (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let filter = {};
    if (req.params.tourId)
        filter.tour = req.params.tourId;
    const features = new apiFeatures_1.default(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const docs = yield features.query;
    res.status(200).json({
        status: 'success',
        results: docs.length,
        data: {
            docs,
        },
    });
}));
exports.getAll = getAll;
//# sourceMappingURL=handlerFactory.js.map