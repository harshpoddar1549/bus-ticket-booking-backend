import mongoose, { Schema } from "mongoose";

const busSchema = new Schema(
    {
        busNumber:{
            type: String,
            required: true
        },
        seats: [
            {
                type: String,
                required: true
            }
        ],
        bookings: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Booking',
                },
            ],
            default: [],
        },
    },
    {
        versionKey: false
    }
);

// Later on add the reference about booking 

export default mongoose.model('Bus', busSchema)