
import express from 'express'
import { login, signup } from '../controllers/authController';
import { getAllUsers, createUser, getUser, updateUser, deleteUser } from "../controllers/userController";

const router = express.Router();

router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

router.route('/signup').post(signup);
router.post('/login', login)


export default router;