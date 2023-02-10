import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import bookingService from "@/services/bookings-service";

export async function postBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const room = req.body.roomId;

    const roomId = Number(room);

    try {
        await bookingService.createBooking(userId, roomId);

        return res.sendStatus(httpStatus.OK);
    } catch (error) {
        if (error.name === "NotFoundError") {
            return res.sendStatus(httpStatus.NOT_FOUND);
        };
        return res.sendStatus(httpStatus.FORBIDDEN);
    };
};

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    try {
        const booking = await bookingService.getBooking(userId);

        return res.status(httpStatus.OK).send({ id: booking.id, Room: booking.Room });
    } catch (error) {
        return res.sendStatus(httpStatus.NOT_FOUND);
    };
};

export async function putBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const bookingId = Number(req.params.bookingId);

    const room = req.body.roomId;
    const roomId = Number(room);
    try {
        await bookingService.updateBookingUser(userId, bookingId, roomId);

        return res.sendStatus(httpStatus.OK);
    } catch (error) {
        if (error.name === "NotFoundError") {
            return res.sendStatus(httpStatus.NOT_FOUND);
        };
        return res.sendStatus(httpStatus.FORBIDDEN);
    }
};