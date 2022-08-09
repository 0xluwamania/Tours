"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtCookieExpire = exports.jwtExpire = exports.jwtSecret = exports.DB = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.DB = process.env.DATABASE;
exports.jwtSecret = process.env.JWT_SECRET;
exports.jwtExpire = process.env.JWT_EXPIRES_IN;
exports.jwtCookieExpire = process.env.JWT_COOKIE_EXPIRES_IN;
//# sourceMappingURL=env.js.map