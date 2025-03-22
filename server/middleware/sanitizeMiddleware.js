const sanitizeHtml = require("sanitize-html");

const sanitizeInput = (input) => sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} });

const sanitizeMiddleware = (req, res, next) => {
    if (req.body) {
        for (let key in req.body) {
            if (typeof req.body[key] === "string") {
                req.body[key] = sanitizeInput(req.body[key]).trim();
            }
        }
    }
    next();
};

module.exports = { sanitizeInput, sanitizeMiddleware };
