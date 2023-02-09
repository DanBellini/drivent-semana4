import { prisma } from "@/config";

async function createBooking(userId:number, roomId:number) {
    return await prisma.booking.create({
        data:{
            userId:userId,
            roomId:roomId
        }
    })
}

const bookingRepository = {
    createBooking
}

export default bookingRepository;