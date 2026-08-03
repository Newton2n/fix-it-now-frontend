# API Integration

This document maps the frontend features and components to the backend API endpoints they consume.

## Authentication

| Frontend Feature | Frontend Action | Backend Endpoint        | Method | Purpose                     |
| ---------------- | --------------- | ----------------------- | ------ | --------------------------- |
| Login            | `login()`       | `/api/auth/login`       | POST   | Authenticate a user         |
| Register         | `register()`    | `/api/auth/register`    | POST   | Create a customer account   |
| Logout           | `logout()`      | ` No separate endpoint` | POST   | Log out the current user    |
| Current User     | `getMe()`       | `/api/auth/me`          | GET    | Retrieve authenticated user |

## Categories

| Frontend Feature | Frontend Action      | Backend Endpoint      | Method | Purpose             |
| ---------------- | -------------------- | --------------------- | ------ | ------------------- |
| Categories Page  | `getAllCategories()` | `/api/categories`     | GET    | Retrieve categories |
| Category Search  | `getAllCategories()` | `/api/categories`     | GET    | Search categories   |
| Category Details | `getCategoryById()`  | `/api/categories/:id` | GET    | Retrieve a category |

### Query Parameters

```text
search
page
limit
sortBy
sortOrder
```

Example:

```http
GET /api/categories?search=plumbing&page=1&limit=10
```

## Technicians

| Frontend Feature      | Frontend Action               | Backend Endpoint       | Method | Purpose                                    |
| --------------------- | ----------------------------- | ---------------------- | ------ | ------------------------------------------ |
| Technicians Page      | `getAllTechnicians()`         | `/api/technicians`     | GET    | Retrieve technicians                       |
| Technician Search     | `getAllTechnicians()`         | `/api/technicians`     | GET    | Search technicians                         |
| Technician Filters    | `getAllTechnicians()`         | `/api/technicians`     | GET    | Filter technicians                         |
| Technician Pagination | `getAllTechnicians()`         | `/api/technicians`     | GET    | Paginate technicians                       |
| Technician Profile    | `getTechnicianById()`         | `/api/technicians/:id` | GET    | Retrieve technician details                |
| User Information      | `getUserById()`               | `/api/user/:id`        | GET    | Retrieve technician user information       |
| Current technician Information      | `getLoginTechnicianProfile()` | `/api/technicians/me`  | GET    | Retrieve login technician user information |
| Create technician Information      | `createTechnicianProfile()` | `/api/technicians/profile`  | POST   | Retrieve login technician user information |
| Update technician Information      | `updateTechnicianProfile()` | `/api/technicians/profile`  | PATCH  | Retrieve login technician user information |
| Update technician Availability      | `updateTechnicianAvailability()` | `/api/technicians/availability`  | PATCH  | Retrieve login technician user information |


### Technician Query Parameters

```text
search
page
limit
minExperience
isAvailable
skills
serviceArea
sortBy
sortOrder
```

Example:

```http
GET /api/technicians?search=plumber&page=1&limit=10&minExperience=5&isAvailable=true&skills=plumbing&serviceArea=Dhaka&sortBy=experience&sortOrder=desc
```

## Services

| Frontend Feature   | Frontend Action    | Backend Endpoint    | Method | Purpose                  |
| ------------------ | ------------------ | ------------------- | ------ | ------------------------ |
| Services Page      | `getAllServices()` | `/api/services`     | GET    | Retrieve services        |
| Service Search     | `getAllServices()` | `/api/services`     | GET    | Search services          |
| Service Filters    | `getAllServices()` | `/api/services`     | GET    | Filter services          |
| Service Pagination | `getAllServices()` | `/api/services`     | GET    | Paginate services        |
| Service Details    | `getServiceById()` | `/api/services/:id` | GET    | Retrieve service details |

### Service Query Parameters

```text
search
page
limit
categoryId
minPrice
maxPrice
isAvailable
sortBy
sortOrder
```

Example:

```http
GET /api/services?search=plumbing&page=1&limit=10&categoryId=123
```

## Bookings

| Frontend Feature      | Frontend Action                       | Backend Endpoint           | Method | Purpose                      |
| --------------------- | ------------------------------------- | -------------------------- | ------ | ---------------------------- |
| Create Booking        | `createBooking()`                     | `/api/booking`             | POST   | Create a service booking     |
| Customer Bookings     | `getAllBookingsFromLoginUser()`       | `/api/booking/my-bookings` | GET    | Retrieve customer's bookings |
| Technician Bookings   | `getAllBookingsFromLoginTechnician()` | `/api/booking/technician`  | GET    | Retrieve technician bookings |
| Cancel Booking        | `cancelBooking()`                     | `/api/booking/:id/cancel`  | PATCH  | Cancel a booking             |
| Update Booking Status | `updateTechnicianBookingStatus()`     | `/api/booking/:id/status`  | PATCH  | Update booking status        |

## Reviews

| Frontend Feature | Frontend Action                      | Backend Endpoint          | Method | Purpose                        |
| ---------------- | ------------------------------------ | ------------------------- | ------ | ------------------------------ |
| Create Review    | `createReview()`                     | `/api/review`             | POST   | Submit a review                |
| User Reviews     | `getAllReviewDetailsFromLoginUser()` | `/api/review/my-reviews`  | GET    | Retrieve user's reviews        |
| Service Reviews  | `getServiceReviews()`                | `/api/review/service/:id` | GET    | Retrieve reviews for a service |

## Payments

| Frontend Feature | Frontend Action           | Backend Endpoint                       | Method | Purpose                        |
| ---------------- | ------------------------- | -------------------------------------- | ------ | ------------------------------ |
| Checkout         | `createCheckoutSession()` | `/api/payment/create-checkout-session` | POST   | Create Stripe checkout session |
| Payment History  | `getPaymentHistory()`     | `/api/payment/history`                 | GET    | Retrieve payment history       |

## User

| Frontend Feature | Frontend Action       | Backend Endpoint    | Method | Purpose                   |
| ---------------- | --------------------- | ------------------- | ------ | ------------------------- |
| User Profile     | `getUserById()`       | `/api/user/:id`     | GET    | Retrieve user information |
| Update Profile   | `updateUserProfile()` | `/api/user/profile` | PATCH  | Update user profile       |

## API Integration Pattern

Frontend API calls are organized inside the `actions/` directory.

```text
actions/
├── auth.action.ts
├── category.action.ts
├── service.action.ts
├── technician.action.ts
├── booking.action.ts
├── review.action.ts
├── payment.action.ts
└── user.action.ts
```

The general data flow is:

```text
Frontend Page / Component
        ↓
Frontend Server Action
        ↓
Backend API Endpoint
        ↓
Express Controller
        ↓
Service / Business Logic
        ↓
Database
```

### Example: Technicians

```text
TechniciansPage
      ↓
getAllTechnicians()
      ↓
GET /api/technicians
      ↓
Backend
      ↓
Technician data
      ↓
TechnicianCard
```

### Example: Technician User Information

```text
TechnicianWithUser
      ↓
getUserById()
      ↓
GET /api/user/:id
      ↓
Backend
      ↓
User name + profile image
      ↓
TechnicianCard
```

## Authentication

Protected endpoints use the authenticated user's HTTP-only authentication cookie.

Authentication tokens are not directly exposed to client-side JavaScript.

## Error Handling

Frontend actions handle unsuccessful API responses and return a consistent result to the consuming page or component.

Example:

```ts
const result = await getAllTechnicians();

if (!result.success) {
  return <ErrorMessage message={result.message} />;
}
```

## Pagination

List endpoints support pagination through `page` and `limit` query parameters.

Example:

```http
GET /api/technicians?page=1&limit=10
```

The backend returns pagination metadata such as:

```json
{
  "page": 1,
  "limit": 10,
  "totalRow": 25,
  "totalPage": 3
}
```

The frontend uses this metadata to render pagination controls.

## Search and Filtering

The frontend sends search and filter values through URL query parameters.

For example:

```http
GET /api/technicians?search=plumber&minExperience=5&isAvailable=true
```

The URL-based approach allows users to share filtered pages and preserves filter state during navigation.

## Summary

The frontend integrates with the backend through dedicated server actions. Each major frontend feature is connected to its corresponding backend endpoint, including:

- Authentication
- Categories
- Services
- Technicians
- Users
- Bookings
- Reviews
- Payments

The frontend also supports backend-powered searching, filtering, sorting, pagination, authentication, and error handling.
