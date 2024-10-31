//  Middleware to authenticate user by verifying token

const ApiError = require("../utils/apiError");
const { verifyAccessToken } = require("../utils/jwtToken");

function extractToken(req) {
  let token = null;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers["authorization"]) {
    const authHeader = req.headers["authorization"];
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  } else if (req.headers["x-access-token"]) {
    token = req.headers["x-access-token"];
  }

  return token;
}

const authenticate = (req, res, next) => {
  const tokenRaw = extractToken(req);

  if (!tokenRaw) {
    return next(new ApiError(401, "Access denied. No token provided"));
  }

  try {
    const decoded = verifyAccessToken(tokenRaw);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new ApiError(401, "Invalid token"));
  }
};

module.exports = authenticate;
