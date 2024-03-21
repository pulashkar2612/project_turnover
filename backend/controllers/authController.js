const expressAsyncHandler = require("express-async-handler");
const usersModel = require("../models/authModel");
const { v4 } = require("uuid");
const nodemailer = require("nodemailer");
const nodeCache = require("node-cache");
const userCache = new nodeCache({ stdTTL: 300 });
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generate } = require('otp-generator');
require("dotenv").config();

const SignupController = expressAsyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  const checkEmail = await usersModel.find({ email: { $eq: email } });
  if (checkEmail.length > 0) {
    res.status(400);
    throw new Error("Email already exists");
  }

  const id = v4();
  const otp = generateOtp();

  let user = new usersModel({
    username,
    email,
    password,
    // role,
    id,
    otp,
  });

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    await user.validate();
    res.json({                       // we will remove this response from here, response will be sent from node mailer
      success: true,
      message: "Enter the otp received in the email",
      id: id,
      // otp: otp,
    });
  } catch (err) {
    res.status(400);
    next(err, req, res);
  }
  userCache.set(user.id, user);

  const transporter = nodemailer.createTransport({
    host: "smtp.forwardemail.net",
    port: 465,
    secure: true,
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.PASSWORD,
    },
  });

  try {
    transporter.sendMail(
      {
        from: "pulashkar2612@gmail.com",
        to: email,
        subject: "OTP",
        html: `<h1>The OTP is - ${otp}</h1>`,
      },
      (err, info) => {
        if (err) {
        } else {
          res.json({
            success: true,
            message: "Enter the otp received in the email",
            id: id,
          });
        }
      }
    );
  } catch (err) {
    res.status(400);
    next(err, req, res);
  }
});

const VerifyOtpController = expressAsyncHandler(async (req, res, next) => {
  const { id, otp } = req.body;

  const userCacheData = userCache.get(id);

  if (userCacheData.username) {
    if (otp == userCacheData.otp) {
    } else {
      res.status(400);
      throw new Error("Incorrect otp.");
    }
  } else {
    res.status(400);
    throw new Error("Time out. Pl signup again.");
  }

  try {
    const data = await usersModel.create({
      username: userCacheData.username,
      password: userCacheData.password,
      // role: userCacheData.role,
      email: userCacheData.email,
      createdAt: new Date().toISOString(),
    });
    userCache.del(id);
    res.json({
      success: true,
      message: { data }
    });
  } catch (err) {
    res.status(400);
    next(err, req, res);
  }
});

const LoginController = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const checkUser = await usersModel.find({ email: { $eq: email } });

  if (checkUser.length === 0) {
    res.status(400);
    throw new Error("User is not signed up.");
  } else {
    const checkPassword = await bcrypt.compare(
      atob(password),
      checkUser[0].password
    );
    console.log("cccccc", checkPassword);
    if (!checkPassword) {
      res.status(400);
      throw new Error("Incorrect password");
    }
  }

  try {
    const token = generateToken(email, checkUser[0]._id);
    const refreshToken = generateRefreshToken(email, checkUser[0]._id);
    console.log("cccc", checkUser);
    res.json({
      success: true,
      token: token,
      refreshToken: refreshToken,
      username: checkUser[0].username,
      id: checkUser[0]._id,
      // role: checkUser[0].role,
    });
  } catch (err) { }
});

const UpdateController = expressAsyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { checkedProducts } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.checkedProducts = checkedProducts;
    await user.save();
    return res.status(200).json({ success: true, message: 'Checked products updated successfully' });
  } catch (error) {
    console.error('Error updating checked products:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

function generateOtp() {
  // let otp = Math.random() * 1000000;
  // return parseInt(otp);
  let otp = generate(8, {
    secret: process.env.OTP_SECRET,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  return parseInt(otp);
}

function generateToken(email, id) {
  return jwt.sign({ email: email, id: id }, process.env.TOKEN_SECRET, {
    expiresIn: "60m",
  });
}

function generateRefreshToken(email, id) {
  return jwt.sign({ email: email, id: id }, process.env.REFRESH_SECRET, {
    expiresIn: "5m",
  });
}

module.exports = {
  LoginController,
  SignupController,
  UpdateController,
  VerifyOtpController,
};
