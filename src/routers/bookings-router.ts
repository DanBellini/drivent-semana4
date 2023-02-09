import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { postBooking } from "@/controllers";

const bookingsRouter = Router();

bookingsRouter
  .all("/*", authenticateToken)
  .post("", postBooking);

export { bookingsRouter };