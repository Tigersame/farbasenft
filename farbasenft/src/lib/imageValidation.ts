/**
 * Image validation utilities for ERC-721 NFT metadata standards
 * 
 * ERC-721 recommendations:
 * - Width: between 320 and 1080 pixels
 * - Aspect ratio: between 1.91:1 and 4:5 inclusive
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageValidationResult {
  isValid: boolean;
  dimensions: ImageDimensions;
  aspectRatio: number;
  errors: string[];
  warnings: string[];
}

const MIN_WIDTH = 320;
const MAX_WIDTH = 1080;
const MIN_ASPECT_RATIO = 0.8; // 4:5 = 0.8 (portrait/square)
const MAX_ASPECT_RATIO = 1.91; // 1.91:1 (landscape)

/**
 * Format aspect ratio for display
 */
export function formatAspectRatio(aspectRatio: number): string {
  if (aspectRatio >= 1) {
    return `${aspectRatio.toFixed(2)}:1`;
  } else {
    const ratio = 1 / aspectRatio;
    return `1:${ratio.toFixed(2)}`;
  }
}

/**
 * Validate image dimensions according to ERC-721 recommendations
 * 
 * ERC-721 recommends:
 * - Width: between 320 and 1080 pixels
 * - Aspect ratio: between 1.91:1 (landscape) and 4:5 (portrait) inclusive
 *   This means: 0.8 <= width/height <= 1.91
 */
export function validateImageDimensions(
  width: number,
  height: number
): ImageValidationResult {
  const dimensions: ImageDimensions = { width, height };
  const aspectRatio = width / height;
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check width
  if (width < MIN_WIDTH) {
    errors.push(`Width (${width}px) is below minimum of ${MIN_WIDTH}px`);
  } else if (width > MAX_WIDTH) {
    warnings.push(`Width (${width}px) exceeds recommended maximum of ${MAX_WIDTH}px`);
  }

  // Check aspect ratio
  // Valid range: 0.8 (4:5 portrait) <= width/height <= 1.91 (1.91:1 landscape)
  if (aspectRatio < MIN_ASPECT_RATIO || aspectRatio > MAX_ASPECT_RATIO) {
    errors.push(
      `Aspect ratio (${formatAspectRatio(aspectRatio)}) is outside recommended range. ` +
      `Should be between 4:5 (0.8:1) and 1.91:1 inclusive.`
    );
  }

  // Additional warnings
  if (width !== height && (aspectRatio < 0.5 || aspectRatio > 2)) {
    warnings.push("Extreme aspect ratios may not display well in all viewers");
  }

  return {
    isValid: errors.length === 0,
    dimensions,
    aspectRatio,
    errors,
    warnings,
  };
}

/**
 * Load image and get its dimensions
 */
export function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

