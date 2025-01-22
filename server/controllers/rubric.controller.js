import Rubric from "../models/rubric.model.js";

export const rubricAdd = async (req, res) => {
  const { rubricData } = req.body;

  if (!Array.isArray(rubricData) || rubricData.length === 0) {
    return res.status(400).json({ rubricData,message: "Invalid rubric data provided" });
  }

  try {
    //delete all rubric entries where userId matches
    await Rubric.deleteMany({ userId: rubricData[0].userId });
    

    // Insert multiple rubric entries
    const result = await Rubric.insertMany(rubricData);

    res.status(201).json({
      message: "Rubric added successfully",
      data: result, // Optionally return inserted data
    });
  } catch (error) {
    console.error("Error adding rubric:", error); // Log the error for debugging

    res.status(500).json({
      message: "Rubric addition failed",
      error: error.message, // Optionally return the error message
    });
  }
};
