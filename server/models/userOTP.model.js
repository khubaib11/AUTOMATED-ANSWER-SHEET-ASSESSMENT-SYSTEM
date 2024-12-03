import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userOTPSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expireAt: {
        type: Date,
        default: Date.now,
    },
});


const UserOTP = mongoose.model("UserOTP", userOTPSchema);

export default UserOTP;