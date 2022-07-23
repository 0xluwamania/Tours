"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const userController_1 = require("../controllers/userController");
const router = express.Router();
router
    .route('/')
    .get(userController_1.getAllUsers)
    .post(userController_1.createUser);
router
    .route('/:id')
    .get(userController_1.getUser)
    .patch(userController_1.updateUser)
    .delete(userController_1.deleteUser);
exports.default = router;
//# sourceMappingURL=users.js.map