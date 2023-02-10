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

const bookingRepository = {
    createBooking,
    findBookingWithUserId
}

export default bookingRepository;