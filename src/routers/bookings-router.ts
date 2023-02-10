import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getBooking, postBooking, putBooking } from "@/controllers";
import { createBookingSchema } from "@/schemas";

const bookingsRouter = Router();

bookingsRouter
  .all("/*", authenticateToken)
  .post("", validateBody(createBookingSchema), postBooking)
  .get("", getBooking)
  .put("/:bookingId", validateBody(createBookingSchema), putBooking);

export { bookingsRouter };