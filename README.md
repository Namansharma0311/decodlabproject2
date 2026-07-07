# Far & Few AI ✈️
### An AI-powered luxury travel planning platform — full-stack demo

Far & Few AI is a portfolio-grade full-stack application built to demonstrate professional backend API development: REST architecture, server-side validation, structured error handling, and clean JSON responses — wrapped in an Apple-inspired, glassmorphic frontend with GSAP + Three.js + Lenis.

---

## ✨ Features

**Frontend**
- Animated hero with live particle background (Three.js)
- Buttery smooth scrolling (Lenis) + scroll-triggered reveals (GSAP)
- Glassmorphism navbar, cards, and forms
- Dark / light theme toggle (persisted in localStorage)
- Destination search, budget filter, sort by price/rating
- Interactive destination modal
- Live booking ticker + toast notifications
- Fully responsive, mobile nav
- Loading screen with progress animation

**Backend**
- Node.js + Express REST API
- JSON file "database" (`server/data/db.json`)
- `express-validator` request validation on every mutating route
- Centralized error handling + 404 middleware
- Custom logger & timestamp middleware
- Security: `helmet`, `cors`, `express-rate-limit`
- Clean, consistent JSON response envelope on every endpoint

---

## 🗂️ Folder Structure

```
project/
├── client/
│   ├── index.html
│   ├── css/style.css
│   ├── js/main.js
│   └── assets/
├── server/
│   ├── server.js
│   ├── routes/
│   │   ├── destinationRoutes.js
│   │   ├── packageRoutes.js
│   │   ├── testimonialRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── newsletterRoutes.js
│   │   └── reviewRoutes.js
│   ├── controllers/
│   │   ├── destinationController.js
│   │   ├── packageController.js
│   │   ├── testimonialController.js
│   │   ├── contactController.js
│   │   ├── bookingController.js
│   │   ├── newsletterController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   ├── logger.js
│   │   ├── timestamp.js
│   │   ├── validateRequest.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Destination.js
│   │   ├── Package.js
│   │   ├── Testimonial.js
│   │   ├── Contact.js
│   │   ├── Booking.js
│   │   ├── Newsletter.js
│   │   └── Review.js
│   ├── utils/
│   │   ├── db.js
│   │   └── apiResponse.js
│   └── data/db.json
├── Far-and-Few-AI.postman_collection.json
├── package.json
├── .env
└── README.md
```

---

## 🚀 Getting Started

```bash
npm install
npm run dev      # nodemon (auto-restart)
# or
npm start        # plain node
```

The app runs at **http://localhost:5000** — Express serves both the API and the static frontend from a single port.

### Environment Variables (`.env`)

```
PORT=5000
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
CLIENT_ORIGIN=http://localhost:5000
```

---

## 📡 API Documentation

All responses follow this envelope:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {},
  "meta": {},
  "timestamp": "ISO-8601"
}
```

Errors:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "A valid email address is required" }],
  "timestamp": "ISO-8601"
}
```

### Destinations

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/destinations` | List all destinations. Query params: `search`, `maxBudget`, `sort=price\|rating` |
| GET | `/api/destination/:id` | Get a single destination. `404` if not found |

### Packages

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/packages` | List all packages. Query param: `sort=price\|popular` |

### Testimonials & Reviews

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/testimonials` | List curated testimonials |
| GET | `/api/reviews` | List user-submitted reviews |
| POST | `/api/review` | Submit a review — body: `{ rating, review, name }` |

### Contact

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/contact` | Submit contact form — body: `{ name, email, phone, message }` |

### Booking

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/booking` | Create a booking — body: `{ destination, checkIn, checkOut, persons, budget }`. Returns a generated booking ID and confirmation. |

### Newsletter

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/newsletter` | Subscribe an email — body: `{ email }`. Returns `409` on duplicate. |

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Server health check |

---

## 🧪 API Testing

A ready-to-import Postman collection is included: **`Far-and-Few-AI.postman_collection.json`**. It covers every GET/POST endpoint, plus validation-error and 404/409 edge cases.

```bash
# Import in Postman:
File → Import → Far-and-Few-AI.postman_collection.json
```

---

## 🛡️ Status Codes Used

| Code | Meaning |
|---|---|
| 200 | Successful GET |
| 201 | Resource created (booking, contact, subscription, review) |
| 400 | Validation error |
| 404 | Resource / route not found |
| 409 | Conflict (duplicate newsletter subscription) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## 🧰 Tech Stack

**Frontend:** HTML5, CSS3 (custom, no framework), Vanilla JS, GSAP + ScrollTrigger, Three.js, Lenis
**Backend:** Node.js, Express.js, express-validator, helmet, cors, express-rate-limit, morgan, dotenv
**Storage:** JSON file database (`db.json`) — no external DB required

---

## 📝 Notes

- This project intentionally uses a JSON file as its datastore to keep the demo dependency-free and instantly runnable. The data layer (`server/models/`) is abstracted behind simple functions, so swapping in MongoDB/Postgres later only requires changing `server/utils/db.js` and the model files — routes and controllers stay untouched.
- All mutating endpoints (`POST`) are fully validated with `express-validator` and return field-level error messages.
