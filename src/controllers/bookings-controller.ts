import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import bookingService from "@/services/bookings-service";

export async function postBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const room = req.body.roomId;

    const roomId = Number(room)

    try {
        await bookingService.createBooking(userId, roomId)

        return res.sendStatus(httpStatus.OK)
    } catch (error) {
        if (error.name === "NotFoundError") {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        if(error.name === "Forbidden"){
            return res.sendStatus(httpStatus.FORBIDDEN)
        }
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
    }
}