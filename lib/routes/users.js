"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const userController_1 = require("../controllers/userController");
const authController_2 = require("../controllers/authController");
const router = express_1.default.Router();
router
    .route('/')
    .get(authController_2.auth, userController_1.getAllUsers)
    .post(userController_1.createUser);
router
    .route('/:id')
    .get(userController_1.getUser)
    .patch(userController_1.updateUser)
    .delete(userController_1.deleteUser);
router.route('/signup').post(authController_1.signup);
router.post('/login', authController_1.login);
router.post('/forgotPassword', authController_2.forgotPassword);
router.patch('/resetPassword/:token', authController_2.resetPassword);
router.post('/updatePassword', authController_2.auth, authController_1.updatePassword);
router.post('/updateuserdetails', authController_2.auth, userController_1.updateUserDetails);
router.post('/deleteMe', authController_2.auth, userController_1.deleteMe);
exports.default = router;
//# sourceMappingURL=users.js.map