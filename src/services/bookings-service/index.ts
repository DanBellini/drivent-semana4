import { forbiddenError } from "@/errors";
import bookingRepository from "@/repositories/bookings-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository"

async function createBooking(userId:number, roomId:number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if(!enrollment){
        throw forbiddenError()
    }
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id)
    if(ticket.status !== "PAID" || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote){
        throw forbiddenError()
    }

    const booking = await bookingRepository.createBooking(userId, roomId)
    return booking.id
}

const bookingService = {
    createBooking
}

export default bookingService;