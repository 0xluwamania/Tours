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
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
// const DB = process.env.DATABASE
const connection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isConnected = yield mongoose_1.default.connect("mongodb+srv://ade:KOAgLkc9Tv07NlfE@cluster0.5nbpw.mongodb.net/natour?retryWrites=true&w=majority");
        console.log('connected');
        return isConnected;
    }
    catch (err) {
        console.log(err);
        throw new Error(err);
    }
});
connection();
const port = process.env.PORT || 3200;
process.on('uncaughtException', (err) => {
    console.log(err, err.name);
    process.exit(1);
});
const server = app_1.default.listen(port, () => {
    console.log(`app is listening on PORT: ${port}...`);
});
process.on('unhandledRejection', (err) => {
    server.close(() => {
        console.log(err, err.name);
        process.exit(1);
    });
});
//# sourceMappingURL=server.js.map