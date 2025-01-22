import mongoose from "mongoose";

// Define the paper schema
const paperSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
        required: true,
    },
    studentNo: {
        type: String,
        required: true,
      },
      questionNo: {
        type: Number,
        required: true,
      },
      rubricId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rubric",
        required: true,
      },
      result: {
        type: String,
      },
      submittedAnswerImage: {
        type: String, // Path to the uploaded image of the answer
        required: true,
      },
    },

    { timestamps: true }
);

const Paper = mongoose.model("Paper", paperSchema);
export default Paper;