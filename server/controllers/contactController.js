/**
 * contactController.js
 * Handles the contact form submission endpoint.
 */
const Contact = require('../models/Contact');
const { success } = require('../utils/apiResponse');

/**
 * POST /api/contact
 */
async function createContact(req, res, next) {
  try {
    const { name, email, phone, message } = req.body;
    const entry = await Contact.create({ name, email, phone, message });
    return success(res, 201, 'Your message has been received. We will get back to you shortly.', entry);
  } catch (err) {
    next(err);
  }
}

module.exports = { createContact };
