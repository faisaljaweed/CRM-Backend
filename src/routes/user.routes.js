import { Router } from 'express';
import {
  registerUser,
  loginUser,
  logout,
} from '../controllers/user.contorllers.js';
// import { upload } from '../middlewares/multer.middleware.js';
import { VerifyJWT } from '../middlewares/auth.middleware.js';
const router = Router();

router.route('/signup').post(
  // upload.fields([
  //   {
  //     name: 'avatar',
  //     maxCount: 1,
  //   },
  //   {
  //     name: 'coverImage',
  //     maxCount: 1,
  //   },
  // ]),
  registerUser
);

router.route('/login').post(loginUser);
router.route('/logout').post(VerifyJWT, logout);
export default router;
