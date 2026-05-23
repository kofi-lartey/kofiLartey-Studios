/**
 * Application-wide constants
 * Configured via environment variables with sensible defaults
 */

/**
 * Maximum storage limit in GB for the storage progress bar.
 * Configure via: VITE_MAX_STORAGE_GB=<value> in your .env file
 * Default: 5 GB
 */
export const MAX_STORAGE_GB = parseFloat(import.meta.env.VITE_MAX_STORAGE_GB || import.meta.env.VITE_MAX_STORAGE || "5");

/**
 * Debounce delay in milliseconds for search input
 */
export const SEARCH_DEBOUNCE_MS = 400;

/**
 * Number of items per page for gallery listing
 */
export const ITEMS_PER_PAGE = 10;
