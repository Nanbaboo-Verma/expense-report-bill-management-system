/**
 * Helper utilities for file uploads, Base64 conversion, validation, and downloads.
 */

// Supported MIME types
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];

export const ALLOWED_FILE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".pdf"];

/**
 * Validates whether a file has an allowed MIME type or extension.
 * @param {File} file 
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: "No file selected." };
  }

  const isTypeValid = ALLOWED_FILE_TYPES.includes(file.type);
  const ext = "." + file.name.split(".").pop().toLowerCase();
  const isExtValid = ALLOWED_FILE_EXTENSIONS.includes(ext);

  if (!isTypeValid && !isExtValid) {
    return {
      valid: false,
      error: `Invalid file format (${ext}). Supported formats: JPG, PNG, JPEG, PDF.`,
    };
  }

  // Limit file size to 8MB for localStorage friendliness
  const MAX_SIZE = 8 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: "File size exceeds 8MB limit. Please upload a smaller file.",
    };
  }

  return { valid: true };
};

/**
 * Converts a browser File object to a Base64 Data URL string.
 * @param {File} file 
 * @returns {Promise<string>}
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
 * Formats bytes into human readable file size (e.g. 1.2 MB, 450 KB).
 * @param {number} bytes 
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Triggers a browser download for a data URL or blob URL.
 * @param {string} dataUrl 
 * @param {string} filename 
 */
export const downloadFile = (dataUrl, filename = "document") => {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generates an SVG Data URL representation of a bill receipt for initial mock seed data.
 * @param {string} title 
 * @param {number} amount 
 * @param {string} merchant 
 * @param {string} category 
 */
