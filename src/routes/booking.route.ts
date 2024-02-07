import { Router } from "express";
import { bookingController } from "../controllers/booking.controller";

const bookingRouter = Router()

// fetchs booking wrt to a particular bus or 
// All the past and present bookings wrt to a particular passenger
// Fetch all the booking, 
bookingRouter.get('/', bookingController.viewTicketStatus)

bookingRouter.post('/book', bookingController.createABooking)

bookingRouter.get('/closed', bookingController.fetchAllClosedTickets)

bookingRouter.get('/open', bookingController.fetchAllOpenTickets)

bookingRouter.put('/', bookingController.updateBooking)


export default bookingRouter