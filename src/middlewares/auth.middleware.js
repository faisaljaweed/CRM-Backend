// import { asynHandler } from '../utils/asynchandler.js';
// import jwt from 'jsonwebtoken';
// import { User } from '../models/user.model.js';
// import { ApiError } from '../utils/ApiErroe.js';
// export const VerifyJWT = asynHandler(async (req, res, next) => {
//   try {
//     const token =
//       req.cookies.accessToken || req.headers['authorization']?.split(' ')[1];
//     console.log('Token: ', token);

//     if (!token) {
//       throw new ApiError(401, 'Access denied, no token provided');
//     }

//     // Verify the token
//     try {
//       const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//       console.log('Decoded Token: ', decoded); // Check decoded token
//     } catch (error) {
//       throw new ApiError(403, 'Invalid or expired token.');
//     }

//     // Find the user without returning the password or refresh token
//     const user = await User.findById(decoded._id).select(
//       '-password -refreshToken'
//     );

//     if (!user) {
//       throw new ApiError(404, 'User not found');
//     }

//     // Set the user in the request
//     req.user = user;
//     next(); // Proceed to the next middleware or route handler
//   } catch (error) {
//     throw new ApiError(403, 'Invalid or expired token.');
//   }
// });

import { asynHandler } from '../utils/asynchandler.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiErroe.js';
export const VerifyJWT = asynHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers['authorization']?.split(' ')[1];
    console.log('Token: ', token);
    if (!token) {
      throw new ApiError(401, 'Unauthorized');
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      '-password -refreshToken'
    );

    if (!user) {
      throw new ApiError(401, 'Invaid Access Token');
    }

    req.user = user;
    next(); //   if (req.cookies?.accessToken || req.header("Authorization")) { }
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invaid Access Token');
  }
});
