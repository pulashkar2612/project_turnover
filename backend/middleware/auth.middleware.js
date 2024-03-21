const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  if (["/login", "/signup", "/logout", "/verifyOtp", "/addAllProducts"].indexOf(req.url) > -1) {
    next();
  } else {
    // Bearer token
    // [bearer, token]
    if (req.headers.authorization && req.headers.authorization.split(" ")[1]) {
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
          res.status(401);
          throw new Error("Not authorized");
        } else {
          req.body.email = user.email;
          req.body.id = user.id;
          next();
        }
      });
    } else {
      res.status(401);
      throw new Error("Not authorized");
    }
  }
});

module.exports = authMiddleware;
