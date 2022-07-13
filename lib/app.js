"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const filepath = path_1.default.join(__dirname, '/dev-data/data/tours.json');
const tours = fs_1.default.readFile(filepath, 'utf-8', (err, data) => {
    console.log(data);
    return (data);
});
app.get('/api/v1/tours', (req, res, next) => {
    res.status(200).json({
        status: "success",
        data: {
            tours
        }
    });
});
console.log(tours);
const port = 3010;
app.listen(port, () => {
    console.log(`App Running on port: ${port}`);
});
//# sourceMappingURL=app.js.map