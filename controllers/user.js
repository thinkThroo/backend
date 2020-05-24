const User = require("../models/user");
const jwt = require('jsonwebtoken');
const commonResponse = require('../utils/common-response');

const responseInfo = {
    emailExists: "Email already registered",
    epMissing: "Email and password are required",
}

// TODO: THIS GOES INTO ENV --> POLISH UP FOR PROD RELEASE LATER
const secret = 'mysecretsshhh';

let {
  successRes,
  failureRes
} = commonResponse;

exports.user_create_post = function (req, res) {
    const {
        email,
        password,
        isNew
    } = req.body;
    const user = new User({ email, password, isNew });
    if (!email || !password) {
        failureRes.msg = responseInfo.epMissing
        res.status(500).json(failureRes);
    } else {
        user.save(function (err, user) {
            if (err) {
                let responseMsg = "Error registering new user please try again."
                // TODO: CLEAN THIS UP WITH VALIDATION API FROM MONGOOSE
                if (err.errmsg.includes("duplicate key error")) {
                    responseMsg = responseInfo.emailExists;
                }
                failureRes.msg = responseMsg;
                res.status(500).json(failureRes);
            } else {
                // Issue token
                const payload = { email };
                const token = jwt.sign(payload, secret, {
                  expiresIn: '8h'
                });
                successRes.msg = "Successfully registered.";
                res.status(200).json({...successRes, token, user_id: user._id});
            }
        });
    }
};


exports.user_login = function(req, res) {
  const { email, password } = req.body;
  User.findOne({ email }, function(err, user) {
    if (err) {
      console.error(err);
      failureRes.msg = 'Internal error please try again';
      res.status(500)
        .json(failureRes);
    } else if (!user) {
        failureRes.msg = 'Incorrect email or password'; 
      res.status(401)
        .json(failureRes);
    } else {
      user.isCorrectPassword(password, function(err, same) {
        if (err) {
        failureRes.msg = 'Internal error please try again';
          res.status(500)
            .json(failureRes);
        } else if (!same) {
        failureRes.msg = 'Incorrect email or password'; 
          res.status(401)
            .json(failureRes);
        } else {
          // Issue token
          const payload = { email };
          const token = jwt.sign(payload, secret, {
            expiresIn: '8h'
          });
          successRes.msg = "Successfully logged-in.";
          // console.log("user object at the time of login:", user);
          res
            // .cookie('token', token, { httpOnly: false })
            .json({...successRes, token, user_id: user._id});
        }
      });
    }
  });
};