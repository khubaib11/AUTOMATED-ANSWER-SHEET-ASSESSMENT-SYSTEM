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
    },
    questionNo: {
      type: Number,
    },
    result: {
      type: String,
    },
    submittedAnswerImage: {
      type: Buffer, // Stores the image as binary data
      // type: String,
      required: true,
    },
    paperText:{
      type:String
    }
  },

  { timestamps: true }
);

const Paper = mongoose.model("Paper", paperSchema);
export default Paper;
