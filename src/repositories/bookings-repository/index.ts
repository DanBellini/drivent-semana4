import { prisma } from "@/config";

async function createBooking(userId: number, roomId: number) {
    return await prisma.booking.create({
        data: {
            userId: userId,
            roomId: roomId
        }
    })
}

async function findBookingWithUserId(userId: number) {
    return await prisma.booking.findFirst({
        where: {
            userId
        },
        include: {
            Room: true
        }
    })
}

async function updateBookingDateWithBookingId(bookingId: number, roomId: number) {
    return await prisma.booking.update({
        where: {
            id: bookingId
        },
        data: {
            roomId:roomId
        }
    })
}

async function verifyBookingId( bookingId:number) {
    return await prisma.booking.findFirst({
        where:{
            id:bookingId,
        },
    })
}

const bookingRepository = {
    createBooking,
    findBookingWithUserId,
    updateBookingDateWithBookingId,
    verifyBookingId
}

export default bookingRepository;