/**
 * bookingController.js
 * Handles trip booking creation and confirmation logic.
 */
const Booking = require('../models/Booking');
const { success, error } = require('../utils/apiResponse');
const { sendBookingConfirmation } = require('../utils/mailer');

/**
 * POST /api/booking
 */
async function createBooking(req, res, next) {
  try {
    const { destination, email, checkIn, checkOut, persons, budget } = req.body;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      return error(res, 400, 'Validation failed', [
        { field: 'checkOut', message: 'Check-out date must be after check-in date' },
      ]);
    }

    const booking = await Booking.create({ destination, email, checkIn, checkOut, persons, budget });

    // Fire off the confirmation email in the background. The booking itself
    // is already confirmed and persisted, so a slow/misconfigured/unreachable
    // mail server must never delay or fail this response.
    sendBookingConfirmation(booking).catch((err) => {
      console.error('[booking] Unexpected email error:', err.message);
    });

    return success(res, 201, 'Booking confirmed! A confirmation email is on its way.', booking);
  } catch (err) {
    next(err);
  }
}

module.exports = { createBooking };
