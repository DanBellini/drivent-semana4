import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { postBooking } from "@/controllers";
import { createBookingSchema } from "@/schemas/bookings-schema";

const bookingsRouter = Router();

bookingsRouter
  .all("/*", authenticateToken)
  .post("", validateBody(createBookingSchema),postBooking);

export { bookingsRouter };