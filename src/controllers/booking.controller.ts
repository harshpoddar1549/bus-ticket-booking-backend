import bookingModel from "../models/booking.model"
import busModel from "../models/bus.model"
import { Request, Response } from "express"
import { findOpenTicketsForABus } from "../utils/utils"


export const bookingController = {
    createABooking: async (req: Request, res: Response) => {

        // First I need to search if the bus exist
        // if not, throw err
        if(Object.keys(req.body).length !== 0){
            try{
                // fetch bus details
                const bus = await busModel.findOne({
                    busNumber: req.body.busNumber, 
                })
                // fetch for the user
                if(!bus){
                    res.status(404).send({
                        message: `Bus not found Error`
                    })
                    return
                }
                // check if the seat number is correct
                if(bus && bus.seats.includes(req.body.seatNumber)){
                    // Check if the seat is available or not in the same bus
                    const booking = await bookingModel.findOne({
                        busId: bus._id,
                        seatNumber: req.body.seatNumber
                    })
                    if(booking){
                        res.status(400).json({
                            message: `Seat ${req.body.seatNumber} not available in bus ${req.body.busNumber}`
                        })
                        return
                    }
                    // create the new booking
                    const newBooking = await bookingModel.create({
                        ...req.body,
                        busId: bus._id,
                    })
                    // pushing the newly created booking into my Bus Model

                    bus.bookings.push(newBooking._id)
                    await bus.save()
                    
                    res.status(200).json({
                        "message" : "Booking Confirmed",
                        "BookingId": newBooking._id,
                        "booking details" : newBooking
                    })
                }else{
                    res.status(400).json({
                        message: `Invalid seat number ${req.body.seatNumber}`
                    })
                }
                
            }catch(err){
                console.log(err)
                res.status(404).json(err)
            }
        }else{
            res.status(400).json({
                message: `Invalid Request. Missing Body.`
            })
        }
    },

    viewTicketStatus: async (req: Request, res: Response) => {
        try{
            const ticket = await bookingModel.findById(req.query.bookingId).populate('busId', 'busNumber')
            if(ticket){
                res.status(200).json(ticket)
            }else{
                res.status(404).json({
                    message: `Ticket with bookingId: ${req.query.bookingId} can't be found`
                })
            }
        }catch(err){
            console.log(err)
            res.status(404).json(err)
        }
        
    },

    fetchAllClosedTickets:async (req:Request, res:Response) => {
        if(req.query.busNumber){
            // look for only that bus
            try{
                const bus = await busModel.findOne({
                    busNumber: req.query.busNumber
                })
                if(bus){
                    const closeBookingsForABus = await bookingModel.find({
                        busId: bus._id
                    }).populate('busId', 'busNumber')
                    res.status(200).json(closeBookingsForABus)
                }else{
                    res.status(404).json({
                        message: `Bus not found error`
                    })
                }
                
            }catch(err){
                console.log(err)
                res.status(404).json(err)
            }     
        }
        else{
            try{
                const allBookings = await bookingModel.find().populate('busId', 'busNumber')
                res.status(200).json(allBookings)
            }catch(err){
                console.log(err)
                res.status(404).json(err)
            } 
        }
    },

    fetchAllOpenTickets: async (req:Request, res: Response) => {
        // wrt to bus
        if(req.query.busNumber){
            const openTicketDetails = await findOpenTicketsForABus(<String>req.query.busNumber)
            res.status(200).json(openTicketDetails)
        }else{
            const buses = await busModel.find()
            const allOpenTicketDetailsArr = []
            for (const bus of buses){
                const openTicketDetails = await findOpenTicketsForABus(bus.busNumber)
                allOpenTicketDetailsArr.push(openTicketDetails)
            }
            res.status(200).json(allOpenTicketDetailsArr)
        }
    },

    updateBooking:async(req:Request, res:Response) => {
        try{
            /*
            If the req.body.status= OPEN,
            fetch the booking, from booking Collection, get the busID and the _id(booking id)
            Delete the booking
            fetch the bus, or remove the booking_id from it
            */

            // fetch the booking
            if(req.body.status===`OPEN`){
                let booking = await bookingModel.findById(req.query.bookingId)
                const busId = booking?.busId
                let bus = await busModel.findById(busId)
                if(bus && booking){
                    const index = bus.bookings.indexOf(booking._id)
                    if (index > -1) { // only splice array when item is found
                        bus.bookings.splice(index, 1); // 2nd parameter means remove one item only
                    }
                    bus = await bus.save()
                    const deletedBooking = await booking.deleteOne()
                    res.status(200).json(deletedBooking)
                    return
                }
                res.status(404).json({
                    message: `Booking not found ERR`
                })
                return
            }
            //assuming that the only change that needs to be made will be on passenger details
            const updatedbooking = await bookingModel.findByIdAndUpdate(req.query.bookingId, req.body, {new: true})
            res.status(200).json(updatedbooking)
        }
        catch(err){
            console.log(err)
            res.status(400).json(err)
        }

    }
}


