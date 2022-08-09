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
exports.User = exports.correctPasswordCheck = exports.createPasswordResetToken = exports.changedPasswordAfter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: validator_1.default.isEmail
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
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // if(!this.isModified('password')) return next;
        if (this.password === this.passwordConfirm) {
            this.password = yield bcrypt_1.default.hash(this.password, 10);
            this.passwordConfirm = undefined;
            next();
        }
    });
});
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew)
        return next();
    this.passwordChangedAt = new Date(Date.now() - 1000);
    next();
});
userSchema.pre('find', function (next) {
    this.find({ active: { $ne: false } });
    next();
});
userSchema.pre('findOne', function (next) {
    this.find({ active: { $ne: false } });
    next();
});
userSchema.pre('findById', function (next) {
    this.find({ active: { $ne: false } });
    next();
});
// userSchema.methods.changedPasswordAfter = function(JWTTimeStamp){
//     if(this.passwordChangedAt){
//        console.log(this.passwordChangedAt, JWTTimeStamp)
//     }
//     return false
// }
const changedPasswordAfter = (passwordChangedAt, JWTTimeStamp) => {
    if (passwordChangedAt) {
        const changedTime = passwordChangedAt.getTime() / 1000;
        return JWTTimeStamp < changedTime;
        console.log(changedTime, JWTTimeStamp);
    }
    return false;
};
exports.changedPasswordAfter = changedPasswordAfter;
const createPasswordResetToken = (user) => {
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
exports.createPasswordResetToken = createPasswordResetToken;
const correctPasswordCheck = function (candidatePassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(candidatePassword, userPassword);
    });
};
exports.correctPasswordCheck = correctPasswordCheck;
exports.User = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=userModels.js.map