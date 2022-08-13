"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    review: {
        type: String,
        trim: true,
        required: [true, 'Review cannot be empty']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    tour: {
        type: mongoose_1.default.Schema['ObjectId'],
        ref: "Tour",
        required: [true, 'Review must belong to a tour']
    },
    user: {
        type: mongoose_1.default.Schema['ObjectId'],
        ref: "User",
        required: [true, 'review must belong to a user']
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
reviewSchema.pre('find', function (next) {
    this.populate({
        path: 'user',
        select: "name photo"
    });
    next();
});
reviewSchema.pre('findOne', function (next) {
    this.populate({
        path: 'user',
        select: "name photo"
    });
    next();
});
reviewSchema.pre('findById', function (next) {
    this.populate({
        path: 'user',
        select: "name photo"
    });
    next();
});
// reviewSchema.pre('find', function(next){
//     this.populate({
//         path: 'tour',
//         select: "name"
//     })
//     next()
// })
// reviewSchema.pre('findOne', function(next){
//     this.populate({
//         path: 'tour',
//         select: "name"
//     })
//     next()
// })
// reviewSchema.pre('findById', function(next){
//     this.populate({
//         path: 'tour',
//         select: "name"
//     })
//     next()
// })
exports.Review = mongoose_1.default.model('Review', reviewSchema);
//# sourceMappingURL=reviewModels.js.map