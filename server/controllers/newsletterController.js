/**
 * newsletterController.js
 * Handles newsletter subscription logic, including duplicate prevention.
 */
const Newsletter = require('../models/Newsletter');
const { success, error } = require('../utils/apiResponse');

/**
 * POST /api/newsletter
 */
async function subscribeNewsletter(req, res, next) {
  try {
    const { email } = req.body;

    const alreadySubscribed = await Newsletter.exists(email);
    if (alreadySubscribed) {
      return error(res, 409, 'This email is already subscribed to our newsletter');
    }

    const entry = await Newsletter.subscribe(email);
    return success(res, 201, 'Successfully subscribed to the Far & Few AI newsletter', entry);
  } catch (err) {
    next(err);
  }
}

module.exports = { subscribeNewsletter };
