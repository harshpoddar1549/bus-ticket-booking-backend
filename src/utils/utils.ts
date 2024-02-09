import bookingModel from "../models/booking.model"
import busModel from "../models/bus.model"

export const resetBus = async (busNumber: String) => {
    const bus = await busModel.findOne({busNumber:busNumber})
    if(bus){
        const bookings = bus.bookings
        bus.bookings = []
        const updatedBus = await bus.save()
        await bookingModel.deleteMany({busId:bus._id})
        return updatedBus
    }
    return false
}

export const resetPlatform = async () => {
    const buses = await busModel.find()
    let updatedBusArr = []
    let updatedBus
    for (const bus of buses){
        bus.bookings = []
        updatedBus = await bus.save()
        updatedBusArr.push(updatedBus)
    }
    await bookingModel.deleteMany()
    return updatedBusArr
}



export const findOpenTicketsForABus = async (busNumber:String) => {
    try{
        const bus = await busModel.findOne({busNumber: busNumber})
        if(bus){
            const allBookings = await bookingModel.find({busId: bus._id})
            const allSeats = bus.seats
            const closedSeat:String[] = []
            for (const booking of allBookings){
                closedSeat.push(booking.seatNumber)
            }
            const openSeats:String[] = []
            for (const seat of allSeats){
                if(!closedSeat.includes(seat)){
                    openSeats.push(seat)
                }
            }
            return {
                openSeats: openSeats,
                closedSeats: closedSeat,
                busNumber: bus.busNumber
            }
        }
        return {}
    }catch(err){
        console.log(err)
        return
    }
}