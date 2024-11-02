const cloudinary = require("../config/cloudinary.js");
const fs = require("fs");

/**
 * Uploads a file to Cloudinary.
 * @param {string} filePath - The path to the file.
 * @param {Object} options - Options for Cloudinary upload (e.g., resource_type).
 * @returns {Promise<Object>} The promise object that represents the Cloudinary response.
 */
const uploadFile = (filePath, options = {}) => {
  return cloudinary.uploader
    .upload(filePath, options)
    .then((response) => {
      console.log(`Uploaded file: ${filePath}`);
      fs.unlink(filePath, (err) => {
        if (err) console.error(`Failed to delete file: ${filePath}`, err);
        else console.log(`Deleted file: ${filePath}`);
      });
      return response;
    })
    .catch((error) => {
      console.error(`Upload failed for file: ${filePath}`, error);
      fs.unlink(filePath, (err) => {
        if (err)
          console.error(`Failed to delete file after error: ${filePath}`, err);
      });
      throw error;
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
