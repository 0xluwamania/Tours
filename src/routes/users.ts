
import express from 'express'
import { login, signup, updatePassword } from '../controllers/authController';
import { getAllUsers, createUser, getUser, updateUser, deleteUser, updateUserDetails, deleteMe, getMe } from "../controllers/userController";
import { auth, forgotPassword, resetPassword } from '../controllers/authController';

const router = express.Router();

router
  .route('/')
  .get(auth, getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

router.route('/signup').post(signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.post('/updatePassword', auth, updatePassword);
router.post('/updateuserdetails', auth, updateUserDetails);
router.post('/deleteMe', auth, deleteMe)

router.get('/me', auth, getMe, getUser)



export default router;