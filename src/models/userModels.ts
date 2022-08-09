import mongoose,{Document} from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

interface IUser {
 name: string,
 email: string,
 photo?: string,
 password: string,
 passwordConfirm?: string,
 passwordChangedAt?: string,
 
}

export interface IUserDocument extends IUser, Document {
	changePasswordAfter(): ()=> boolean
}


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
    role: {
        type: String,
        enum: ['user', 'guide', 'leadGuide', 'admin'],
        default: 'user'
    },
    passwordConfirm: {
        type: String,
        // required: true`
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
}, 
{
    toObject: {virtuals: true},
    toJSON: {virtuals: true }
  })

userSchema.pre('save', async function(next){
    // if(!this.isModified('password')) return next;
    if(this.password === this.passwordConfirm){
        this.password = await bcrypt.hash(this.password, 10);
        this.passwordConfirm = undefined;
        next()
    }
})

userSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = new Date(Date.now() - 1000);
    next()
})

userSchema.pre('find', function(next){
    this.find({active: {$ne: false}});
    next()
})

userSchema.pre('findOne', function(next){
    this.find({active: {$ne: false}});
    next()
})

userSchema.pre('findById', function(next){
    this.find({active: {$ne: false}});
    next()
})
// userSchema.methods.changedPasswordAfter = function(JWTTimeStamp){
//     if(this.passwordChangedAt){
//        console.log(this.passwordChangedAt, JWTTimeStamp)
//     }
//     return false
// }


export const changedPasswordAfter = (passwordChangedAt, JWTTimeStamp) =>{
    if(passwordChangedAt){
        const changedTime = passwordChangedAt.getTime()/1000
        return JWTTimeStamp < changedTime
       console.log(changedTime, JWTTimeStamp)
    }
    return false
}

export const createPasswordResetToken = (user: any)=> {
    const resetToken = crypto.randomBytes(32).toString('hex')
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

export const correctPasswordCheck = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}

export const User = mongoose.model('User', userSchema);
