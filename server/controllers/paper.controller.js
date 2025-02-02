import Paper from "../models/paper.model.js";
import { OpenAI } from "openai";

// Function to process an image and extract text
const imagetoText = async (imageBuffer) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const base64Image = imageBuffer.toString("base64"); // Convert Buffer to Base64

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Ensure model supports image input
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Extract only the handwritten text from the given image exactly as it appears, without adding, modifying, or interpreting anything." },
            { type: "image_url", image_url: { url: `data:image/png;base64,${base64Image}` } },
          ],
        },
      ],
    });

    return response.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error("Error processing image:", error);
    return ""; // Return empty text in case of error
  }
};

// Controller function to add papers
const paperAdd = async (req, res) => {
  const papers = req.body;
  const user = papers[0]?.createdBy;

  if (!user) return res.status(400).json({ error: "Invalid user data" });

  try {
    // Remove previous papers from the same creator
    await Paper.deleteMany({ createdBy: user });

    // Process images to extract text
    const processedPapers = await Promise.all(
      papers.map(async (paper) => {
        const paperText = await imagetoText(Buffer.from(paper.submittedAnswerImage, "base64"));

        return {
          createdBy: paper.createdBy,
          studentName: paper.studentName,
          questionNo: paper.questionNo,
          result: paper.result,
          paperText,
          submittedAnswerImage: paper.submittedAnswerImage, // Keep original base64
        };
      })
    );

    // Insert all processed papers in one go
    await Paper.insertMany(processedPapers);

    res.status(201).json({ message: "Papers added successfully!" });
  } catch (error) {
    console.error("Error saving papers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { paperAdd };
