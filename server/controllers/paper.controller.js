import Paper from "../models/paper.model.js";
import { OpenAI } from "openai";
import { Buffer } from "buffer";
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import axios from "axios";

// Function to GPT mini process image to text
const GPT4ProImagetoText = async (imageBuffer) => {
  console.log("running GPT4ProImagetoText");
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

//Free Gpt-4 API by GitHub
const GPT4ImagetoText = async (imageBuffer) => {
  console.log("running GPT4ImagetoText");
  const token = process.env.GIT_GPT4_API;

  const client = new OpenAI({
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: token
  });

  try {
    const base64Image = imageBuffer.toString("base64"); // Convert Buffer to Base64

    const response = await client.chat.completions.create({
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

// Free llama Vission API by GitHub
const LLamaImagetoText = async (imageBuffer) => {
  console.log("running LLamaImagetoText");
  const token = process.env.GIT_GPT4_API;

  const client = ModelClient(
    "https://models.inference.ai.azure.com",
    new AzureKeyCredential(token)
  );

  try {
    const base64Image = imageBuffer.toString("base64"); // Convert Buffer to Base64

    const response = await client.path("/chat/completions").post({
      body: {
          messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: "Extract the handwritten text in the given image." },
                  { type: "image_url", image_url: { url: `data:image/png;base64,${base64Image}` } },
                ],
              },
            ],
          model: "Llama-3.2-11B-Vision-Instruct",
          temperature: 0.8,
          max_tokens: 2048,
          top_p: 0.1
      }
  });


    return response.body.choices[0].message.content || "";
  } catch (error) {
    console.error("Error processing image:", error);
    return ""; // Return empty text in case of error
  }
};

const H2OVLmississippi= async (imageBuffer) => {

  console.log("running H2OVLmississippi");
  const base64Image = imageBuffer.toString("base64"); // Convert Buffer to Base64

  try {
    const res = await axios.post(`${process.env.H2OVL}ocr`, {
      image: base64Image,
      question: "Read the text and provide word by word ocr for the document. <doc>"
    });

    return  res.data.response || "";
  } catch (err) {
    console.error("Error processing image:", err);
    return ""; // Return empty text in case of error
  }

}

// Controller function to add papers
const paperAdd = async (req, res) => {
  const papers = req.body;
  const user = papers[0]?.createdBy;
  const selectedModel= papers[0]?.selectedModel;
  if (!user) return res.status(400).json({ error: "Invalid user data" });
  
  let imagetoText=LLamaImagetoText;
  if (selectedModel === "GPT4- Pro") {
    imagetoText = GPT4ProImagetoText;
  }
  else if (selectedModel === "OpenAI GPT-4o") {
    imagetoText = GPT4ImagetoText;
  } else if (selectedModel === "Llama-3.2-11B") {
    imagetoText = LLamaImagetoText;
  }
  else if (selectedModel === "H2OVL-mississippi") {
    imagetoText = H2OVLmississippi;
  }
  else {
    return res.status(400).json({ error: "Invalid model selected" });
  }
  try {
    // Remove previous papers from the same creator
    await Paper.deleteMany({ createdBy: user });

    // Process images to extract text
    const processedPapers = await Promise.all(
      papers.map(async (paper) => {
        // Extract and concatenate text from all images
        const paperTextArray = await Promise.all(
          paper.submittedAnswerImages.map(async (imageBuffer) => {
            return await imagetoText(imageBuffer);
          })
        );

        return {
          createdBy: paper.createdBy,
          studentName: paper.studentName,
          result: paper.result,
          paperText: paperTextArray.join("\n   ") || "", // Concatenate all extracted texts
          submittedAnswerImages: paper.submittedAnswerImages.map(
            (img) => Buffer.from(img, "base64") // Convert back to Buffer before saving
          ),
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

