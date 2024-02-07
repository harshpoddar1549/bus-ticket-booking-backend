import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
        seatNumber: {
            type: String,
            required: true,
        },
        sex: {
            type: String,
            enum: ['Male', 'Female'],
            required: true,
        },
        status: {
            type: String,
            enum: ['OPEN', 'CLOSE'],
            default: 'CLOSE',
        },
        busId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bus',
        }
    },
    {
        versionKey: false
    }
);


// Later on add the reference about booking 

export default mongoose.model('Booking', bookingSchema)