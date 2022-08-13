import mongoose from "mongoose";
import { User} from "./userModels";
import { Tour} from "./tourModels";

const reviewSchema = new mongoose.Schema({
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
        type: mongoose.Schema['ObjectId'],
        ref: "Tour",
        required: [true, 'Review must belong to a tour']
    },
    user: {
        type: mongoose.Schema['ObjectId'],
        ref: "User",
        required: [true, 'review must belong to a user']
    }
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
} )


reviewSchema.pre('find', function(next){
    this.populate({
        path: 'user',
        select: "name photo"
    })
    next()
})

reviewSchema.pre('findOne', function(next){
    this.populate({
        path: 'user',
        select: "name photo"
    })
    next()
})

reviewSchema.pre('findById', function(next){
    this.populate({
        path: 'user',
        select: "name photo"
    })
    next()
})

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

export const Review = mongoose.model('Review', reviewSchema);