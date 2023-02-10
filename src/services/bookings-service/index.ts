import { forbiddenError, notFoundError } from "@/errors";
import bookingRepository from "@/repositories/bookings-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";
import ticketRepository from "@/repositories/ticket-repository"
import { Booking } from "@prisma/client";

async function createBooking(userId: number, roomId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) {
        throw forbiddenError();
    };
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
    if (ticket.status !== "PAID" || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
        throw forbiddenError();
    };

    const roomIdAlreadyExist = await hotelRepository.findRoomByRoomId(roomId);

    if (!roomIdAlreadyExist) {
        throw notFoundError();
    };

    if (roomIdAlreadyExist.Booking.length >= roomIdAlreadyExist.capacity) {
        throw forbiddenError();
    };
    const booking = await bookingRepository.createBooking(userId, roomIdAlreadyExist.id);

    return booking;
}

export type CreateBookingParams = Pick<Booking, "roomId">;

async function getBooking(userId: number) {
    const booking = await bookingRepository.findBookingWithUserId(userId)

    if (!booking) {
        throw notFoundError()
    }
    return booking
}

async function updateBookingUser(userId: number, bookingId: number, roomId: number) {

    const verifyBookingId = await bookingRepository.verifyBookingId(bookingId)
    if(!verifyBookingId){
        throw notFoundError()
    }
    if(verifyBookingId.userId !== userId){
        throw forbiddenError()
    }

    const roomIdAlreadyExist = await hotelRepository.findRoomByRoomId(roomId);
    if (!roomIdAlreadyExist) {
        throw notFoundError();
    };
    if (roomIdAlreadyExist.Booking.length >= roomIdAlreadyExist.capacity) {
        throw forbiddenError();
    };

    return await bookingRepository.updateBookingDateWithBookingId(bookingId, roomId)
    
}

const bookingService = {
    createBooking,
    getBooking,
    updateBookingUser
}

export default bookingService;