import { Router } from 'express';
import { registerUser } from '../controllers/user.contorllers.js';
import { upload } from '../middlewares/multer.middleware.js';
const router = Router();

router.route('/login').post(
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
    {
      name: 'coverImage',
      maxCount: 1,
    },
  ]),
  registerUser
);

export default router;
