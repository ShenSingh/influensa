/**
 * Converts Google Drive sharing URLs to direct image URLs
 * @param url - Google Drive URL (sharing or direct)
 * @returns Direct image URL or original URL if not a Google Drive link
 */
export const convertGoogleDriveUrl = (url: string): string => {
  if (!url) return url;

  // If it's already in the correct format, return as is
  if (url.includes('drive.google.com/uc?export=view&id=')) {
    return url;
  }

  // Extract file ID from different Google Drive URL formats
  let fileId = '';

  // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const shareMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (shareMatch) {
    fileId = shareMatch[1];
  }

  // Format: https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch) {
    fileId = openMatch[1];
  }

  // If we found a file ID, convert to direct link
  if (fileId) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  // Return original URL if it's not a Google Drive link or couldn't parse
  return url;
};

/**
 * Validates if a URL is a valid image URL
 * @param url - URL to validate
 * @returns boolean indicating if it's likely a valid image URL
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;

  // Check for common image extensions or Google Drive direct links
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
  const isGoogleDriveDirectLink = url.includes('drive.google.com/uc?export=view&id=');

  return imageExtensions.test(url) || isGoogleDriveDirectLink;
};
