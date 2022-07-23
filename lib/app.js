"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
const tours_1 = __importDefault(require("./routes/tours"));
const users_1 = __importDefault(require("./routes/users"));
// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
app.use(express_1.default.json());
app.use(express_1.default.static(`${__dirname}/public`));
app.use((req, res, next) => {
    console.log('Hello from the middleware 👋');
    next();
});
app.use((req, res, next) => {
    //   req.requestTime = new Date().toISOString();
    next();
});
// 3) ROUTES
app.use('/api/v1/tours', tours_1.default);
app.use('/api/v1/users', users_1.default);
// console.log(tours)
exports.default = app;
//# sourceMappingURL=app.js.map