const jwt = require('jsonwebtoken');
const secret = 'mysecretsshhh';

const commonResponse = require('./common-response');

let {
    successRes,
    failureRes
  } = commonResponse;

const withAuth = function(req, res, next) {
  // console.log("req.cookies.token", req.cookies.token, "req.body.token", req.body.token);
  // const token = req.cookies.token || req.body.token;
  let token = null;
  const header = req.headers['authorization'];
  if(typeof header != 'undefined') {
      const bearer = header.split(' ');
      token = bearer[1];
  }
  if (!token) {
    res.status(401).json({...failureRes, statusCode: 401, msg: 'Unauthorized: No token provided'});
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.status(401).json({...failureRes, statusCode: 401, msg: 'Unauthorized: Invalid token'});
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
}
module.exports = withAuth;