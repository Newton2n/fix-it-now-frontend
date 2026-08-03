# API Integration

This document maps the frontend features and components to the backend API endpoints they consume.

## Authentication

| Frontend Action | Backend Endpoint     | Method | Purpose                                                                      |
| --------------- | -------------------- | ------ | ---------------------------------------------------------------------------- |
| `login()`       | `/api/auth/login`    | POST   | Authenticate a user and return access and refresh tokens.                    |
| `register()`    | `/api/auth/register` | POST   | Create a new user account.                                                   |
| `getMe()`       | `/api/auth/me`       | GET    | Retrieve the currently authenticated user's information.                     |
| `logout()`      | —                    | —      | Clear authentication cookies on the frontend and redirect to the login page. |

### Notes

- `login()` stores `accessToken` and `refreshToken` in HTTP-only cookies after a successful backend response.
- `logout()` does not call a backend endpoint in this file; it clears cookies on the frontend, revalidates caches, and redirects to `/login`.
- The frontend does not store auth tokens in `localStorage`.

## Admin

### Admin Categories

| Frontend Action    | Backend Endpoint                    | Method | Purpose                                       |
| ------------------ | ----------------------------------- | ------ | --------------------------------------------- |
| `getAllCategory()` | `/api/admin/categories`             | GET    | Retrieve all categories for admin management. |
| `createCategory()` | `/api/categories/admin`             | POST   | Create a new category.                        |
| `updateCategory()` | `/api/categories/admin/:categoryId` | PATCH  | Update an existing category.                  |
| `deleteCategory()` | `/api/categories/admin/:categoryId` | DELETE | Delete a category.                            |

### Admin Payments

| Frontend Action    | Backend Endpoint      | Method | Purpose                                        |
| ------------------ | --------------------- | ------ | ---------------------------------------------- |
| `getAllPayments()` | `/api/admin/payments` | GET    | Retrieve all payment records for admin review. |

### Admin Users

| Frontend Action      | Backend Endpoint                 | Method | Purpose                                |
| -------------------- | -------------------------------- | ------ | -------------------------------------- |
| `getAllUser()`       | `/api/admin/users`               | GET    | Retrieve all users for administration. |
| `updateUserStatus()` | `/api/admin/users/:userId`       | PATCH  | Update a user's account status.        |
| `banUser()`          | Wrapper for `updateUserStatus()` | —      | Set user status to `BLOCKED`.          |
| `unbanUser()`        | Wrapper for `updateUserStatus()` | —      | Set user status to `ACTIVE`.           |

### Admin Bookings

| Frontend Action   | Backend Endpoint      | Method | Purpose                                 |
| ----------------- | --------------------- | ------ | --------------------------------------- |
| `getAllBooking()` | `/api/admin/bookings` | GET    | Retrieve all bookings for admin review. |

### Technician Verification

| Frontend Action             | Backend Endpoint                              | Method | Purpose                                            |
| --------------------------- | --------------------------------------------- | ------ | -------------------------------------------------- |
| `getAllTechnicianProfile()` | `/api/technicians`                            | GET    | Retrieve all technician profiles for admin review. |
| `updateTechnicianStatus()`  | `/api/technicians/admin/:technicianId/verify` | PATCH  | Approve, unapprove, or suspend a technician.       |
| `verifyTechnician()`        | Wrapper for `updateTechnicianStatus()`        | —      | Set technician status to `VERIFIED`.               |
| `unverifyTechnician()`      | Wrapper for `updateTechnicianStatus()`        | —      | Set technician status to `PENDING_APPROVAL`.       |
| `suspendTechnician()`       | Wrapper for `updateTechnicianStatus()`        | —      | Set technician status to `SUSPENDED`.              |

### Notes

- `verifyTechnician()`, `unverifyTechnician()`, `suspendTechnician()`, `banUser()`, and `unbanUser()` are helper wrappers.

## Bookings

| Frontend Action                       | Backend Endpoint                 | Method | Purpose                                                           |
| ------------------------------------- | -------------------------------- | ------ | ----------------------------------------------------------------- |
| `getAllBookingsFromLoginUser()`       | `/api/booking`                   | GET    | Retrieve bookings for the currently logged-in customer.           |
| `getAllBookingsFromLoginTechnician()` | `/api/technicians/bookings`      | GET    | Retrieve bookings assigned to the currently logged-in technician. |
| `updateTechnicianBookingStatus()`     | `/api/booking/:bookingId`        | PATCH  | Update a booking status as the technician.                        |
| `cancelBooking()`                     | `/api/booking/:bookingId/cancel` | PATCH  | Cancel a booking as the customer.                                 |
| `createBooking()`                     | `/api/booking`                   | POST   | Create a new booking.                                             |
| `getBookingById()`                    | `/api/booking/:bookingId`        | GET    | Retrieve booking details by ID.                                   |

### Booking Status Flow

Technician booking status updates support these transitions:

- `REQUESTED` → `ACCEPTED`
- `REQUESTED` → `DECLINED`
- `PAID` → `IN_PROGRESS`
- `IN_PROGRESS` → `COMPLETED`

### Notes

- `cancelBooking()` first checks that the current user is a `CUSTOMER` and verifies ownership before calling the cancel endpoint.
- `createBooking()` requires an authenticated `CUSTOMER`.
- `getAllBookingsFromLoginTechnician()` requires an authenticated `TECHNICIAN`.
- `getBookingById()` and `cancelBooking()` both use the booking detail endpoint to validate booking access.

## Categories

| Frontend Action        | Backend Endpoint                                          | Method | Purpose                                                                |
| ---------------------- | --------------------------------------------------------- | ------ | ---------------------------------------------------------------------- |
| `getAllCategories()`   | `/api/categories?search=&page=&limit=&sortBy=&sortOrder=` | GET    | Retrieve all categories with optional search, sorting, and pagination. |
| `getCategoryDetails()` | `/api/categories/:id`                                     | GET    | Retrieve a single category by ID.                                      |

### Query Parameters

#### `getAllCategories()`

Supported query parameters:

- `search`
- `page`
- `limit`
- `sortBy` (`name`, `createdAt`)
- `sortOrder` (`asc`, `desc`)

### Notes

- `getAllCategories()` uses cached fetching with the `all-category-home` revalidation tag.
- `getCategoryDetails()` uses the `category-details` revalidation tag.
- This section is for public category browsing, separate from the admin category actions documented under Admin.

## Payments

| Frontend Action                       | Backend Endpoint          | Method | Purpose                                                    |
| ------------------------------------- | ------------------------- | ------ | ---------------------------------------------------------- |
| `getAllPaymentDetailsFromLoginUser()` | `/api/payment`            | GET    | Retrieve payment history for the currently logged-in user. |
| `createCheckoutSession()`             | `/api/payment/checkout`   | POST   | Create a checkout session for a specific booking.          |
| `getPaymentDetailsByBookingId()`      | `/api/payment/:bookingId` | GET    | Retrieve payment details for a specific booking.           |

### Notes

- `getAllPaymentDetailsFromLoginUser()` and `getPaymentDetailsByBookingId()` both require an authenticated user.
- `createCheckoutSession()` also requires authentication and sends the `bookingId` in the request body.
- These are frontend payment actions; the Stripe webhook, if present, should be documented separately as a backend-to-Stripe integration.

## Reviews

| Frontend Action                      | Backend Endpoint         | Method | Purpose                                                   |
| ------------------------------------ | ------------------------ | ------ | --------------------------------------------------------- |
| `getAllReviewDetailsFromLoginUser()` | `/api/review/me`         | GET    | Retrieve reviews created by the currently logged-in user. |
| `getReviewByBookingId()`             | `/api/review/:bookingId` | GET    | Retrieve a single review for a booking.                   |
| `createReview()`                     | `/api/review`            | POST   | Create a review for a completed booking.                  |
| `updateReview()`                     | `/api/review/:reviewId`  | PATCH  | Update an existing review.                                |
| `deleteReview()`                     | `/api/review/:reviewId`  | DELETE | Delete an existing review.                                |

### Notes

- `getAllReviewDetailsFromLoginUser()` uses the `login-user-reviews` cache tag.
- `createReview()` and `updateReview()` revalidate the user review cache after mutations.
- These endpoints require authentication.

## Services

| Frontend Action                    | Backend Endpoint                                                                                    | Method | Purpose                                                            |
| ---------------------------------- | --------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------ |
| `getAllService()`                  | `/api/service?search=&page=&limit=&categoryId=&minPrice=&maxPrice=&isAvailable=&sortBy=&sortOrder=` | GET    | Retrieve services with search, filtering, sorting, and pagination. |
| `getAllServiceByCategoryId()`      | `/api/service/category/:id`                                                                         | GET    | Retrieve services for a specific category.                         |
| `getAllServiceByLoginTechnician()` | `/api/technicians/services`                                                                         | GET    | Retrieve services belonging to the currently logged-in technician. |
| `getSingleService()`               | `/api/service/:id`                                                                                  | GET    | Retrieve a single service by ID.                                   |
| `createService()`                  | `/api/service`                                                                                      | POST   | Create a new service.                                              |
| `updateService()`                  | `/api/service/:id`                                                                                  | PATCH  | Update an existing service.                                        |
| `deleteService()`                  | `/api/service/:id`                                                                                  | DELETE | Delete a service.                                                  |

### Query Parameters

#### `getAllService()`

Supported query parameters:

- `search`
- `page`
- `limit`
- `categoryId`
- `minPrice`
- `maxPrice`
- `isAvailable`
- `sortBy` (`price`, `date`)
- `sortOrder` (`asc`, `desc`)

### Notes

- `getAllServiceByLoginTechnician()`, `createService()`, `updateService()`, and `deleteService()` require an authenticated `TECHNICIAN`.
- `createService()`, `updateService()`, and `deleteService()` revalidate service-related cache tags after mutation.
- `getAllServiceByCategoryId()` is used for category-based service browsing.

## Technicians

| Frontend Action                  | Backend Endpoint                                                                                            | Method | Purpose                                                                      |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------- |
| `getTechnicianProfileById()`     | `/api/technicians/profile/:id`                                                                              | GET    | Retrieve a technician profile by ID.                                         |
| `getLoginTechnicianProfile()`    | `/api/technicians/me`                                                                                       | GET    | Retrieve the currently logged-in technician profile.                         |
| `createTechnicianProfile()`      | `/api/technicians/profile`                                                                                  | POST   | Create a technician profile.                                                 |
| `updateTechnicianProfile()`      | `/api/technicians/profile`                                                                                  | PATCH  | Update the logged-in technician profile.                                     |
| `updateTechnicianAvailability()` | `/api/technicians/availability`                                                                             | PATCH  | Update technician availability.                                              |
| `getAllTechnicians()`            | `/api/technicians?search=&page=&limit=&minExperience=&isAvailable=&skills=&serviceArea=&sortBy=&sortOrder=` | GET    | Retrieve public technician listings with filtering, sorting, and pagination. |
| `getUserById()`                  | `/api/user/:id`                                                                                             | GET    | Retrieve related user information for a technician profile.                  |

### Query Parameters

#### `getAllTechnicians()`

Supported query parameters:

- `search`
- `page`
- `limit`
- `minExperience`
- `isAvailable`
- `skills`
- `serviceArea`
- `sortBy` (`experience`, `date`)
- `sortOrder` (`asc`, `desc`)

### Notes

- `getLoginTechnicianProfile()`, `createTechnicianProfile()`, `updateTechnicianProfile()`, and `updateTechnicianAvailability()` require an authenticated `TECHNICIAN`.
- `createTechnicianProfile()`, `updateTechnicianProfile()`, and `updateTechnicianAvailability()` revalidate the `login-technician` cache tag.
- `getAllTechnicians()` is the public listing endpoint and should stay documented separately from admin technician management.
- `getUserById()` is included here because it is used by the technician profile flow to fetch the linked user record.

## Users

| Frontend Action         | Backend Endpoint   | Method | Purpose                                  |
| ----------------------- | ------------------ | ------ | ---------------------------------------- |
| `getUserById()`         | `/api/user/:id`    | GET    | Retrieve public user information by ID.  |
| `updateNormalProfile()` | `/api/user/update` | PATCH  | Update the authenticated user's profile. |

### Notes

- `updateNormalProfile()` validates payload shape before sending the request.
- `updateNormalProfile()` requires an authenticated user and revalidates the `login-user` cache tag after a successful update.
- `getUserById()` is used for public or related user lookups, such as showing the technician’s linked user profile.
