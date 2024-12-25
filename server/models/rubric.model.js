import mongoose from "mongoose";

// Define the rubric schema
const rubricSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    weightage: {
      type: Number,
    },
    keywords: {
      type: String,
    },
    answer: {
      type: String,
    },
    processID: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Rubric = mongoose.model("Rubric", rubricSchema);
export default Rubric;