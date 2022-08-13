"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = require("express-rate-limit");
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const hpp_1 = __importDefault(require("hpp"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const app = (0, express_1.default)();
const errorController_1 = require("./controllers/errorController");
const tours_1 = __importDefault(require("./routes/tours"));
const users_1 = __importDefault(require("./routes/users"));
const reviews_1 = __importDefault(require("./routes/reviews"));
const appError_1 = __importDefault(require("./utils/appError"));
// 1) MIDDLEWARES
app.use((0, helmet_1.default)());
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
const limiter = (0, express_rate_limit_1.rateLimit)({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests'
});
app.use('/api', limiter);
app.use(express_1.default.json({ limit: '10kb' }));
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, xss_clean_1.default)());
app.use((0, hpp_1.default)({
    whitelist: ["duration", "difficulty", "ratingsQuantity", "ratingsAverage", "maxGroupSize"]
}));
app.use(express_1.default.static(`${__dirname}/public`));
app.use((req, res, next) => {
    // console.log(req.headers)
    // req.requestTime = new Date().toISOString();
    next();
});
// 3) ROUTES
app.use('/api/v1/tours', tours_1.default);
app.use('/api/v1/users', users_1.default);
app.use('/api/v1/reviews', reviews_1.default);
app.all('*', (req, res, next) => {
    // res.status(404).json({
    //   status: 'Failed',
    //   message: `This ${req.originalUrl} cannot be found on this server`
    // })
    // const err = {
    // message: new Error(`This ${req.originalUrl} cannot be found on this server`),
    // statusCode: 404,
    // status: 'fail'};
    next(new appError_1.default(`This ${req.originalUrl} cannot be found on this server`, 404));
});
app.use(errorController_1.errorHandler);
// console.log(tours)
exports.default = app;
//# sourceMappingURL=app.js.map