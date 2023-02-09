import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import bookingService from "@/services/bookings-service";

export async function postBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body;

    if(!roomId){
        return res.sendStatus(httpStatus.FORBIDDEN)
    }

    try {
        const bookingId = await bookingService.createBooking(userId, roomId)

        return res.status(httpStatus.OK).send(bookingId)
    } catch (error) {
        if (error.name === "NotFoundError") {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        return res.sendStatus(httpStatus.FORBIDDEN)
    }
}