//  Middleware to authenticate user by verifying token

const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/apiError");
const { verifyAccessToken } = require("../utils/jwtToken");
const { userServices } = require("@/modules/users");

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

const authenticate = async (req, res, next) => {
  const tokenRaw = extractToken(req);
  if (!tokenRaw) {
    return next(
      new ApiError(StatusCodes.UNAUTHORIZED, "Access denied. No token provided")
    );
  }

  try {
    const decoded = verifyAccessToken(tokenRaw);
    const userExits = await userServices.getUserById(decoded.id);
    if (!userExits) {
      return next(
        new ApiError(StatusCodes.UNAUTHORIZED, "Invalid or expire token")
      );
    }
    req.user = userExits;
    next();
  } catch (err) {
    return next(
      new ApiError(StatusCodes.UNAUTHORIZED, "Invalid or expire token")
    );
  }
};

module.exports = authenticate;
