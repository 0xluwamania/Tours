import mongoose from "mongoose";
import slugify from "slugify";
import validator from "validator"

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
    startDates: [Date]
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
})


tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7
})

tourSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true});
    next()
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