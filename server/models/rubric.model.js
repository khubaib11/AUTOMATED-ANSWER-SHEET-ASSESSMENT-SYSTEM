import mongoose from "mongoose";

// Define the rubric schema
const rubricSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionNo: {
      type: Number,
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
  },
  { timestamps: true }
);

const Rubric = mongoose.model("Rubric", rubricSchema);
export default Rubric;