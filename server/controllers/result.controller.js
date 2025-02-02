import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Rubric from "../models/rubric.model.js";
import Paper from "../models/paper.model.js";



const result = (req, res) => {
    const __dirname = path.resolve('/home/khubaib/Programing/Projects/AUTOMATED ANSWER SHEET ASSESSMENT SYSTEM/server');
    const filePath = path.join(__dirname, 'data', 'result.docx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Cache-Control', 'no-store'); // Disable caching
    
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending the file:', err);
        res.status(500).send('File rendering failed');
      }
    });
}

const GenerateResults = async (req, res) => {
  try {
    const user = req.body.userId;
    const allPapers = await Paper.find({ createdBy: user });
    const allRubrics = await Rubric.find({ createdBy: user });

    const apiKey = process.env.GEMINI_API;
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    // Convert rubrics to a structured format
    let rubricsString = allRubrics.map((rubric) => ({
      questionNo: rubric.questionNo,
      question: rubric.question,
      weightage: rubric.weightage,
      keywords: rubric.keywords,
      answer: rubric.answer,
    }));

    // Process papers asynchronously
    const processedPapers = await Promise.all(
      allPapers.map(async (paper) => {
        const result = await getResult(
          model,
          generationConfig,
          paper.paperText,
          JSON.stringify(rubricsString)
        );

        return {
          createdBy: paper.createdBy,
          studentName: paper.studentName,
          questionNo: paper.questionNo,
          result: result, // Store the evaluated result properly
          paperText: paper.paperText, // Added missing assignment
          submittedAnswerImage: paper.submittedAnswerImage, // Keep original base64
        };
      })
    );

    // Remove previous papers from the same creator
    await Paper.deleteMany({ createdBy: user });

    
    // Insert newly processed papers
    await Paper.insertMany(processedPapers);

    res.status(200).json({ message: "Results generated successfully", processedPapers });
  } catch (error) {
    console.error("Error generating results:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getResult = async (model, generationConfig, text, rubrics) => {
  try {
    // Start the chat session
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const prompt = `
**Rubric-Based Assessment System – Strict Matching**  

**Instructions:**  

1. **Find the correct rubric** by matching the student's question with the "questionNo" or "question" field.  
2. **If a matching rubric is found, ONLY evaluate based on it.**  
   - ✅ **Check for keywords and expected answer EXACTLY as listed.**  
   - ❌ **Do NOT add extra missing points or use external knowledge.**  
3. **If no rubric exists for the question, use general knowledge and score fairly out of 5.**  
4. **Reward correctness and partial correctness generously**—small phrasing differences should not affect scoring.  

---

### **Student Answer:**  
[${text}]  

### **Available Rubric Data:**  
\`\`\`  
${rubrics}  
\`\`\`  

---

### **Evaluation Process:**  
- **Step 1:** Find a rubric that exactly matches the question.  
- **Step 2:**  
   - ✅ **If a matching rubric exists:**  
     - Check if the answer includes the rubric’s **expected answer** or **keywords**.  
     - If it matches, mark it **correct** and **do not add unnecessary missing points**.  
   - ❌ **If no rubric exists:**  
     - Use general knowledge and assign a fair score out of **5**.  
- **Step 3:** Avoid unnecessary deductions.  
- **Step 4:** Provide structured feedback, focusing only on major errors.  

---

### **Expected Deliverables:**  
- **Score (out of total):** [If rubric exists, use rubric-based score. If not, provide a fair score out of 5.]  
- **Correct Answer Check:** [Yes / No / Partially Correct]  
- **Missing Points:** [Only list if the rubric explicitly requires them.]  
- **Wrong Points:** [Only if the answer contradicts the rubric—do not nitpick minor errors.]  

---

### **Important Notes:**  
✅ **Strictly follow the rubric—do not add extra missing points.**  
✅ **If the answer contains the rubric’s expected answer or keywords, it is correct.**  
✅ **If the wording differs slightly but conveys the same meaning, still consider it correct.**  
✅ **Do NOT penalize small grammar mistakes or alternative phrasing.**  
✅ **If no rubric exists, provide a reasonable score out of 5 using general knowledge.**  

**Provide a structured, fair, and concise assessment.**  
`;

    // Send the prompt
    const result = await chatSession.sendMessage(prompt);

    if (result && result.response) {
      return result.response.text(); // Extract response text properly
    } else {
      console.error("No valid response from the model.");
      return "Error: No response from the AI model.";
    }
  } catch (error) {
    console.error("Error in getResult:", error);
    return "Error: Failed to process the request.";
  }
};

export { result,GenerateResults };
