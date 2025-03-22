import DOMPurify from "dompurify";

export const sanitizeInput = (input) => {
    if (typeof input !== "string" || !input.trim()) return ""; // Ensure only valid strings are sanitized
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] }).trim(); // Remove HTML tags & trim spaces
};
