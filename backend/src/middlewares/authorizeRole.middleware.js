const ApiError = require("@/utils/apiError");
const { StatusCodes } = require("http-status-codes");

const authorizeRole = (requiredRole) => {
  return (req, _, next) => {
    if (req.user.role !== requiredRole) {
      return next(
        new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Access denied. You are not authorized to access this resource"
        )
      );
    }
    next();
  };
};

module.exports = authorizeRole;
