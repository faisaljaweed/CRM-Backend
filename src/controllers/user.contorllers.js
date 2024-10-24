import { asynHandler } from '../utils/asynchandler.js';
import { ApiError } from '../utils/ApiErroe.js';
import { User } from '../models/user.model.js';
// import { uploadCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
const generateAccessandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshtoken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      'Something went wrong while generating access and refresh token'
    );
  }
};

const registerUser = asynHandler(async (req, res) => {
  // get user datails form fronend
  // validation -not empty and email
  // check user already exists -email and username
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create User Object -create entry in db
  // remove password, refresh token field from response
  // check user creation
  // return res
  //
  //
  // get user datails form fronend
  console.log(req.body);
  console.log(req.files);
  const { email, username, fullname, password, role } = req.body;
  // console.log('email', email);

  // validation -not empty and email

  if (
    [email, fullname, username, password, role].some(
      (field) => field?.trim() === ''
    )
  ) {
    throw new ApiError(400, 'All fields are required');
  }
  if (!email.includes('@') || !email.includes('.')) {
    throw new ApiError(400, 'Invalid email format');
  }

  // check user already exists -email and username

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, 'User with email and username already exists');
  }
  console.log(existedUser);
  // check for images, check for avatar

  // const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // let coverImageLocalPath;

  // if (
  //   req.files &&
  //   Array.isArray(req.files.coverImage) &&
  //   req.files.coverImage.length > 0 // <-- Typo here
  // ) {
  //   coverImageLocalPath = req.files.coverImage[0].path;
  // }

  // if (!avatarLocalPath) {
  //   throw new ApiError(400, 'Avatar file is required');
  // }
  // console.log(avatarLocalPath);
  // console.log(coverImageLocalPath);
  // upload them to cloudinary, avatar
  // const avatar = await uploadCloudinary(avatarLocalPath);
  // const coverImage = await uploadCloudinary(coverImageLocalPath);
  // check avatar upload on cloudinary
  // console.log(avatar);
  // console.log(coverImage);
  // if (!avatar) {
  //   throw new ApiError(400, 'Avatar is required');
  // }
  // create User Object -create entry in db
  const user = await User.create({
    fullname,
    // avatar: avatar.url,
    // coverImage: coverImage?.url || null,
    email,
    username: username.toLowerCase(),
    password,
    role,
  });
  // remove password, refresh token field from response
  const createdUser = await User.findById(user._id).select(
    '-password -refreshtoken'
  );
  console.log(createdUser);
  // check user creation
  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering the user');
  }

  // return res
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'User Registered Successfully'));
});

const loginUser = asynHandler(async (req, res) => {
  // get user datails form fronend
  // check validate email password and role
  // find user
  // generate access and refresh token
  // send cookies
  // return res
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, 'All fields are required');
  }
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Invalid email or password');
  }
  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    user._id
  );
  console.log('Access Token', accessToken, 'Refresh Token', refreshToken);
  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );
  // ye options jb dete hain tw server se ye modified
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refresh', refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          loggedInUser,
          accessToken,
          refreshToken,
        },
        'User LoggedInSuccessfully'
      )
    );
});
const logout = asynHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'User Logged Out'));
});
export { registerUser, loginUser, logout };
