const cloudinary = require("../config/cloudinary.js");
const fs = require("fs");
/**
 * Uploads a file to Cloudinary.
 * @param {string} filePath - The path to the file.
 * @param {Object} options - Options for Cloudinary upload (e.g., resource_type).
 * @returns {Promise<Object>} The promise object that represents the Cloudinary response.
 */
const uploadFile = (filePath, options = {}) => {
  const result = cloudinary.uploader.upload(filePath, options);
  return result.then((response) => {
    console.log(response);
    fs.unlinkSync(filePath);
    return response;
  });
};

/**
 * Uploads multiple files to Cloudinary.
 * @param {Array} files - Array of file paths.
 * @param {Object} options - Options for Cloudinary upload (e.g., resource_type).
 * @returns {Promise<Array>} The promise object that represents the array of Cloudinary responses.
 */
const uploadMultipleFiles = (files, options = {}) => {
  const uploadPromises = files.map((file) => uploadFile(file.path, options));
  return Promise.all(uploadPromises);
};

module.exports = {
  uploadFile,
  uploadMultipleFiles,
};
