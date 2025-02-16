import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
     createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        file: {
            data: Buffer, // Stores the file content as binary data
            contentType: String, // MIME type (e.g., application/vnd.openxmlformats-officedocument.wordprocessingml.document)
          }

},{ timestamps: true });

const Result = mongoose.model("Result", resultSchema);
export default Result;