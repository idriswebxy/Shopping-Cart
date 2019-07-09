const jwt = require("jsonwebtoken");

const JWT_SECRET = "jwt_secret_password";

module.exports = (req, res, next) => {
  // checks the header or url params for token
  var token =
    req.body["x-access-token"] ||
    req.query["x-access-token"] ||
    req.headers["x-access-token"];
  // decodes the token
  if (token) {
    // verify secret and exp
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
      if (err) {
        return res.status(403).send({
          success: false,
          message: "Failed to authenticate token..."
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).send({
      success: false,
      message: "No Token provided..."
    });
  }
};
