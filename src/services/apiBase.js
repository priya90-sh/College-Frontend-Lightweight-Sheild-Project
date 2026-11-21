// Set VITE_API_URL to the deployed Flask API origin (no trailing slash).
export const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
