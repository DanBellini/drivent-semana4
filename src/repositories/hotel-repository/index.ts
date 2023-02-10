import { prisma } from "@/config";

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    }
  });
}

async function findRoomByRoomId(roomId:number) {
  return prisma.room.findFirst({
    where:{
      id:roomId
    },
    include:{
      Booking: true
    }
  })
}

const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
  findRoomByRoomId,
};

export default hotelRepository;
