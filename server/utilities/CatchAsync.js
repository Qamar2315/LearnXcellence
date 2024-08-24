/**
 * A higher-order function to wrap asynchronous route handlers.
 * This ensures that any errors thrown in the asynchronous function
 * are passed to the next middleware (error handler) in the chain.
 *
 * @param {Function} fn - The asynchronous function to be wrapped.
 * @returns {Function} - A new function that wraps the async function
 * and catches any errors, passing them to the next middleware.
 */

function wrapAsync(fn) {
    return function(req, res, next) {
        // Call the asynchronous function and catch any errors
        fn(req, res, next).catch(next); // Pass any caught error to the next middleware
    };
}

module.exports = wrapAsync;
