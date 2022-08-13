import mongoose from "mongoose";
import slugify from "slugify";
import validator from "validator"
import { User } from "./userModels";

const tourSchema = new mongoose.Schema({
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
        enum:  ['easy', 'medium', 'difficult'],
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
    startLocation : {
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
        type: mongoose.Schema['ObjectId'],
        ref: "User"
    }],
    startDates: [Date]
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
})


tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7
});

tourSchema.virtual('reviews', {
    ref: "Review",
    foreignField: "tour",
    localField: "_id"
})

tourSchema.pre('find', function(next){
    this.populate({
        path: 'guidesRef',
        select: "-__v -passwordChangedAt -role"
    })
    next()
})

tourSchema.pre('findOne', function(next){
    this.populate({
        path: 'guidesRef',
        select: "-__v -passwordChangedAt -role"
    })
    next()
})
tourSchema.pre('findById', function(next){
    this.populate({
        path: 'guidesRef',
        select: "-__v -passwordChangedAt -role"
    })
    next()
})

tourSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true});
    next()
})

tourSchema.pre('save', async function(next){
    const guidePromises = this.guides.map(async (id)=> await User.findById(id));
    this.guides = await Promise.all(guidePromises);
    next;
})
let date: number = 0
// tourSchema.pre('find', function(next){
//     this.find({secretTour: {$ne: true}});
//     date = Date.now()
//     next()
// })

tourSchema.post('find', function(docs, next){
    console.log(`Query took ${Date.now() - date}`)
    next()
})

// tourSchema.pre('aggregate', function(next){
//     next();
// })
export const Tour = mongoose.model('Tour', tourSchema)