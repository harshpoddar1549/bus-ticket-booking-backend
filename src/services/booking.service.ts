export type NewBooking = {
    busNumber: String
    name:String
    age:Number
    seatNumber:String
    sex: "Male" | "Female"
}


export const BookingService = {
    createBooking: async (newBooking:NewBooking)=>{

    }
}