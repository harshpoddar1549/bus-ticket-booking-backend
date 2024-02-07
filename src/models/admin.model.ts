import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false
    }
);

export default mongoose.model('Admin', adminSchema)