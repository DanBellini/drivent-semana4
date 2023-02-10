import { prisma } from "@/config";

async function createBooking(userId:number, roomId:number) {
    return await prisma.booking.create({
        data:{
            userId:userId,
            roomId:roomId
        }
    })
}

async function findBookingWithUserId(userId:number) {
    return await prisma.booking.findFirst({
        where:{
            userId
        },
        include:{
            Room: true
        }
    })
}

async function verifyUserReserve(userId:number) {
    return await prisma.user.findFirst({
        where:{
            id:userId
        },
        include:{
            Booking:true
        }
    })
}

async function updateBookingDateWithBookingId(bookingId:number, roomId:number) {
    return await prisma.booking.update({
        where:{
            id:bookingId
        },
        data:{
            roomId
        }
    })
}

const bookingRepository = {
    createBooking,
    findBookingWithUserId,
    verifyUserReserve,
    updateBookingDateWithBookingId
}

export default bookingRepository;