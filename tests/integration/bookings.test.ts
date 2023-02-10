import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { cleanDb, generateValidToken } from "../helpers";
import {
    createEnrollmentWithAddress,
    createHotel,
    createPayment,
    createRoomWithHotelId,
    createTicket,
    createTicketTypeRemote,
    createTicketTypeWithHotel,
    createUser
} from "../factories";
import { createBooking, createManyBookings } from "../factories/bookings-factory";

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe("POST /booking", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.post("/booking");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();

        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid", () => {
        it("should respond with status 403 if body is void", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server.post("/booking")
                .set("Authorization", `Bearer ${token}`)
                .send({})

            expect(response.status).toBe(httpStatus.FORBIDDEN);
        })

        it("should respond with status 404 if roomId not a Number", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server.post("/booking")
                .set("Authorization", `Bearer ${token}`)
                .send({ roomId: faker.animal.cat() })

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        })

        describe("when body format is valid", () => {
            it("should respond with status 403 when user has no enrollment ", async () => {
                const user = await createUser();
                const token = await generateValidToken(user);
                await createTicketTypeRemote()

                const response = await server.post("/booking")
                    .set("Authorization", `Bearer ${token}`)
                    .send({ roomId: faker.datatype.number() })

                expect(response.status).toBe(httpStatus.FORBIDDEN);
            })

            it("should respond with status 403 when user ticket is remote", async () => {
                const user = await createUser();
                const token = await generateValidToken(user);
                const enrollment = await createEnrollmentWithAddress(user);
                const ticketType = await createTicketTypeRemote();
                await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

                const response = await server.post("/booking")
                    .set("Authorization", `Bearer ${token}`)
                    .send({ roomId: faker.datatype.number() })

                expect(response.status).toBe(httpStatus.FORBIDDEN);
            })

            describe("when user and ticketType is valid", () => {
                it("should respond with status 404 when not found roomId", async () => {
                    const user = await createUser();
                    const token = await generateValidToken(user);
                    const enrollment = await createEnrollmentWithAddress(user);
                    const ticketType = await createTicketTypeWithHotel();
                    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
                    const payment = await createPayment(ticket.id, ticketType.price);
                    const createdHotel = await createHotel();
                    const createdRoom = await createRoomWithHotelId(createdHotel.id);

                    const response = await server.post("/booking")
                        .set("Authorization", `Bearer ${token}`)
                        .send({ roomId: 0 })

                    expect(response.status).toBe(httpStatus.NOT_FOUND);
                })

                it("should respond 200 and booking id, if roomId is valid", async () => {
                    const user = await createUser();
                    const token = await generateValidToken(user);
                    const enrollment = await createEnrollmentWithAddress(user);
                    const ticketType = await createTicketTypeWithHotel();
                    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
                    const payment = await createPayment(ticket.id, ticketType.price);
                    const createdHotel = await createHotel();
                    const createdRoom = await createRoomWithHotelId(createdHotel.id);

                    const response = await server.post("/booking")
                        .set("Authorization", `Bearer ${token}`)
                        .send({ roomId: createdRoom.id })

                    expect(response.status).toBe(httpStatus.OK);

                })

                it("should respond 403 if roomId no have capacity", async () => {
                    const user = await createUser();
                    const token = await generateValidToken(user);
                    const enrollment = await createEnrollmentWithAddress(user);
                    const ticketType = await createTicketTypeWithHotel();
                    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
                    const payment = await createPayment(ticket.id, ticketType.price);
                    const createdHotel = await createHotel();
                    const createdRoom = await createRoomWithHotelId(createdHotel.id);
                    await createManyBookings(createdRoom.id, user.id)

                    const response = await server.post("/booking")
                        .set("Authorization", `Bearer ${token}`)
                        .send({ roomId: createdRoom.id })

                    expect(response.status).toBe(httpStatus.FORBIDDEN);
                })
            })
        })
    })
})

describe("GET /booking", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/booking");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();

        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid", () => {
        it("should respond with 404 if not have booking create", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server.get("/booking")
                .set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        })

        it("should responde with 200 and body, if have booking registred in the database", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
            const createdHotel = await createHotel();
            const createdRoom = await createRoomWithHotelId(createdHotel.id);
            const booking = await createBooking(createdRoom.id, user.id)

            const response = await server.get("/booking")
                .set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toEqual({
                id: booking.id,
                Room: {
                    id: createdRoom.id,
                    name: createdRoom.name,
                    capacity: createdRoom.capacity,
                    hotelId: createdRoom.hotelId,
                    createdAt: createdRoom.createdAt.toISOString(),
                    updatedAt: createdRoom.updatedAt.toISOString(),
                }
            })
        })
    })
})

describe("PUT /booking/:bookingId", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.put("/booking/");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();

        const response = await server.put("/booking/").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.put("/booking/").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    describe("when token is valid", () => {
        it("should response with status 404 if not found bookingId", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
            const createdHotel = await createHotel();
            const createdRoom = await createRoomWithHotelId(createdHotel.id);

            const otherHotel = await createHotel();
            const otherRoom = await createRoomWithHotelId(otherHotel.id);

            const response = await server.put(`/booking/${0}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ roomId: otherRoom.id })

            expect(response.status).toBe(httpStatus.NOT_FOUND)
        })

        describe("when booking id exist", () => {
            it("should respond with status 403 if user is trying to update a bookingId that is not theirs", async () => {
                const user = await createUser();
                const token = await generateValidToken(user);
                const enrollment = await createEnrollmentWithAddress(user);
                const ticketType = await createTicketTypeWithHotel();
                const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
                const payment = await createPayment(ticket.id, ticketType.price);
                const createdHotel = await createHotel();
                const createdRoom = await createRoomWithHotelId(createdHotel.id);
                const booking = await createBooking(createdRoom.id, user.id);


                const otherUser = await createUser();
                const otherEnrollment = await createEnrollmentWithAddress(otherUser);
                const otherTicketType = await createTicketTypeWithHotel();
                const otherTicket = await createTicket(otherEnrollment.id, otherTicketType.id, TicketStatus.PAID);
                const otherPayment = await createPayment(otherTicket.id, otherTicketType.price);
                const otherHotel = await createHotel();
                const otherRoom = await createRoomWithHotelId(otherHotel.id);
                const otherBooking = await createBooking(otherRoom.id, otherUser.id);

                const response = await server.put(`/booking/${otherBooking.id}`)
                    .set("Authorization", `Bearer ${token}`)
                    .send({ roomId: createdRoom.id })

                expect(response.status).toBe(httpStatus.FORBIDDEN)
            })
            describe("when booking Id is valid", () => {
                it("should response with status 404 if roomId not exist", async () => {
                    const user = await createUser();
                    const token = await generateValidToken(user);
                    const enrollment = await createEnrollmentWithAddress(user);
                    const ticketType = await createTicketTypeWithHotel();
                    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
                    const payment = await createPayment(ticket.id, ticketType.price);
                    const createdHotel = await createHotel();
                    const createdRoom = await createRoomWithHotelId(createdHotel.id);
                    const booking = await createBooking(createdRoom.id, user.id);


                    const response = await server.put(`/booking/${booking.id}`)
                        .set("Authorization", `Bearer ${token}`)
                        .send({ roomId: 0 })

                    expect(response.status).toBe(httpStatus.NOT_FOUND)
                })

                it("should response with status 403 if roomId dont have capacity", async () => {
                    const user = await createUser();
                    const token = await generateValidToken(user);
                    const enrollment = await createEnrollmentWithAddress(user);
                    const ticketType = await createTicketTypeWithHotel();
                    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
                    const payment = await createPayment(ticket.id, ticketType.price);
                    const createdHotel = await createHotel();
                    const createdRoom = await createRoomWithHotelId(createdHotel.id);

                    const otherUser = await createUser();
                    const otherEnrollment = await createEnrollmentWithAddress(otherUser);
                    const otherTicketType = await createTicketTypeWithHotel();
                    const otherTicket = await createTicket(otherEnrollment.id, otherTicketType.id, TicketStatus.PAID);
                    const otherPayment = await createPayment(otherTicket.id, otherTicketType.price);
                    const otherHotel = await createHotel();
                    const otherRoom = await createRoomWithHotelId(otherHotel.id);
                    const otherBooking = await createManyBookings(otherRoom.id, otherUser.id);

                    const booking = await createBooking(otherRoom.id, user.id)

                    const response = await server.put(`/booking/${booking.id}`)
                        .set("Authorization", `Bearer ${token}`)
                        .send({ roomId: otherRoom.id })

                    expect(response.status).toBe(httpStatus.FORBIDDEN);
                })

                describe("when roomId is valid", ()=>{
                    it("should response with status 200 if user sucefully update your booking", async () => {
                        const user = await createUser();
                        const token = await generateValidToken(user);
                        const enrollment = await createEnrollmentWithAddress(user);
                        const ticketType = await createTicketTypeWithHotel();
                        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
                        const payment = await createPayment(ticket.id, ticketType.price);
                        const createdHotel = await createHotel();
                        const createdRoom = await createRoomWithHotelId(createdHotel.id);
                        const booking = await createBooking(createdRoom.id, user.id);
    
                        const otherHotel = await createHotel();
                        const otherRoom = await createRoomWithHotelId(otherHotel.id);
    
                        const response = await server.put(`/booking/${booking.id}`)
                            .set("Authorization", `Bearer ${token}`)
                            .send({ roomId: otherRoom.id })
    
                        expect(response.status).toBe(httpStatus.OK)
                    })
                })
            })
        })
    })
})