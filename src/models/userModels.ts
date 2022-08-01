import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: validator.isEmail
    },
    photo: String,
    password: {
        type: String,
        minlength: 8,
        required: true,
        // select: false
    },
    passwordConfirm: {
        type: String ,
        // required: true`
    }
})

userSchema.pre('save', async function(next){
    // if(!this.isModified('password')) return next;
    if(this.password === this.passwordConfirm){
        this.password = await bcrypt.hash(this.password, 10);
        this.passwordConfirm = undefined;
        next()
    }
})

export const correctPasswordCheck = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}

export const User = mongoose.model('User', userSchema);
