"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReview = exports.deleteReview = exports.createReview = exports.getReview = exports.setTourUserIds = exports.getAllReviews = void 0;
const reviewModels_1 = require("../models/reviewModels");
const handlerFactory_1 = require("./handlerFactory");
exports.getAllReviews = (0, handlerFactory_1.getAll)(reviewModels_1.Review);
const setTourUserIds = (req, res, next) => {
    if (!req.body.tour)
        req.body.tour = req.params.tourId;
    if (!req.body.user)
        req.body.user = req['user'].id;
    next();
};
exports.setTourUserIds = setTourUserIds;
exports.getReview = (0, handlerFactory_1.getOne)(reviewModels_1.Review, undefined);
exports.createReview = (0, handlerFactory_1.createOne)(reviewModels_1.Review);
exports.deleteReview = (0, handlerFactory_1.deleteOne)(reviewModels_1.Review);
exports.updateReview = (0, handlerFactory_1.updateOne)(reviewModels_1.Review);
//# sourceMappingURL=reviewController.js.map