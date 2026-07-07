/**
 * testimonialController.js
 * Handles business logic for testimonial endpoints.
 */
const Testimonial = require('../models/Testimonial');
const { success } = require('../utils/apiResponse');

async function getTestimonials(req, res, next) {
  try {
    const testimonials = await Testimonial.findAll();
    return success(res, 200, 'Testimonials fetched successfully', testimonials, {
      count: testimonials.length,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getTestimonials };
