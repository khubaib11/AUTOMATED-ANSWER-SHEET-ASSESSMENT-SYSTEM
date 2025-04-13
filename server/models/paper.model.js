import mongoose from "mongoose";

// Define the paper schema
const paperSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    result: {
      type: String,
    },
    submittedAnswerImages: [
      {
        type: Buffer, // Stores multiple images as binary data
        required: true,
      },
    ],
    paperText: {
      type: String,
    },
  },
  { timestamps: true }
);

const Paper = mongoose.model("Paper", paperSchema);
export default Paper;
