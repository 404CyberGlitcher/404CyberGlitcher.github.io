// Image compression utility - auto compress to under 500KB
import imageCompression from "browser-image-compression";

const MAX_SIZE_MB = 0.5; // 500KB
const MAX_SIZE_BYTES = 500 * 1024;

/**
 * Compress image file to under 500KB
 * @param {File} file - Original image file
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = async (file) => {
  try {
    // Check if file size is already under limit
    if (file.size <= MAX_SIZE_BYTES) {
      return file;
    }

    const options = {
      maxSizeMB: MAX_SIZE_MB,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      fileType: file.type,
      initialQuality: 0.8,
      alwaysKeepResolution: false,
    };

    const compressedFile = await imageCompression(file, options);
    console.log(
      `Compressed: ${(file.size / 1024).toFixed(2)}KB -> ${(compressedFile.size / 1024).toFixed(2)}KB`,
    );
    return compressedFile;
  } catch (error) {
    console.error("Image compression error:", error);
    return file; // Return original if compression fails
  }
};

/**
 * Compress multiple images
 * @param {FileList} files - List of image files
 * @returns {Promise<File[]>} - Array of compressed images
 */
export const compressMultipleImages = async (files) => {
  const compressedFiles = [];
  for (const file of files) {
    const compressed = await compressImage(file);
    compressedFiles.push(compressed);
  }
  return compressedFiles;
};

/**
 * Convert file to base64 string
 * @param {File} file - Image file
 * @returns {Promise<string>} - Base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Convert multiple files to base64
 * @param {File[]} files - Array of image files
 * @returns {Promise<string[]>} - Array of base64 strings
 */
export const multipleFilesToBase64 = async (files) => {
  const base64Strings = [];
  for (const file of files) {
    const base64 = await fileToBase64(file);
    base64Strings.push(base64);
  }
  return base64Strings;
};
