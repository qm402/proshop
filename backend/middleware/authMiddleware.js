import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// Protect (Auth) Middleware. Protecting routes from being public. Users msut be logged in
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // console.log(req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Getting the token and not 'Bearer' too
      token = req.headers.authorization.split(' ')[1];

      // Verifying token with secret token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Putting the user details into req.user
      req.user = await await User.findById(decoded.id).select('-password');
      //console.log(req.user);

      // Move onto next middleware
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorised, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorised, No token');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as admin');
  }
};

export { protect, admin };
