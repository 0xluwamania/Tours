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
exports.Tour = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const userModels_1 = require("./userModels");
const tourSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true,
        maxlength: [40, 'name length should not be more than 30'],
        minlength: [10, 'name length should not be more than 30'],
        // validate: [validator.isAlpha, 'Tour name must only be alphabets']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        required: [true, 'A tour must have a group size'],
        enum: ['easy', 'medium', 'difficult'],
        type: String,
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'ratings must be above 1.0'],
        max: [5, 'ratings must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"]
    },
    priceDiscount: {
        type: Number,
    },
    summary: {
        type: String,
        trim: true,
        required: [true, "A tour must have a summary"]
    },
    description: {
        type: String,
        trim: true,
    },
    secretTour: {
        type: Boolean,
        default: false
    },
    imageCover: {
        type: String,
        required: [true, "A tour must have an image cover"]
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startLocation: {
        type: {
            type: String,
            default: "Point",
            enum: ["Point"]
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [{
            type: {
                type: String,
                default: "Point",
                enum: ["Point"]
            },
            coordinates: [Number],
            address: String,
            description: String
        }],
    guides: Array,
    guidesRef: [{
            type: mongoose_1.default.Schema['ObjectId'],
            ref: "User"
        }],
    startDates: [Date]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});
tourSchema.virtual('reviews', {
    ref: "Review",
    foreignField: "tour",
    localField: "_id"
});
tourSchema.pre('find', function (next) {
    this.populate({
        path: 'guidesRef',
        select: "-__v -passwordChangedAt -role"
    });
    next();
});
tourSchema.pre('findOne', function (next) {
    this.populate({
        path: 'guidesRef',
        select: "-__v -passwordChangedAt -role"
    });
    next();
});
tourSchema.pre('findById', function (next) {
    this.populate({
        path: 'guidesRef',
        select: "-__v -passwordChangedAt -role"
    });
    next();
});
tourSchema.pre('save', function (next) {
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    next();
});
tourSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const guidePromises = this.guides.map((id) => __awaiter(this, void 0, void 0, function* () { return yield userModels_1.User.findById(id); }));
        this.guides = yield Promise.all(guidePromises);
        next;
    });
});
let date = 0;
// tourSchema.pre('find', function(next){
//     this.find({secretTour: {$ne: true}});
//     date = Date.now()
//     next()
// })
tourSchema.post('find', function (docs, next) {
    console.log(`Query took ${Date.now() - date}`);
    next();
});
// tourSchema.pre('aggregate', function(next){
//     next();
// })
exports.Tour = mongoose_1.default.model('Tour', tourSchema);
//# sourceMappingURL=tourModels.js.map