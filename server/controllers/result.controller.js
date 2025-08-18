import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Rubric from "../models/rubric.model.js";
import Paper from "../models/paper.model.js";
import Result from "../models/result.model.js";
import mongoose from "mongoose"; // Import mongoose to use ObjectId conversion


import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
} from "docx";


const result = async (req, res) => {
  try {
    const { id } = req.body; // Get user ID from request body

    if (!id) return res.status(400).json({ error: "User ID is required" });

    // Convert ID to ObjectId
    const objectId = new mongoose.Types.ObjectId(id);

    // Find file by `createdBy` field
    const fileRecord = await Result.findOne({ createdBy: objectId });

    if (!fileRecord || !fileRecord.file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.setHeader("Content-Type", fileRecord.file.contentType || "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", `attachment; filename="${fileRecord.file.filename || "result.docx"}"`);
    res.setHeader("Cache-Control", "no-store");

    res.send(fileRecord.file.data);
  } catch (error) {
    console.error("Error retrieving the file:", error);
    res.status(500).json({ error: "File retrieval failed" });
  }
};

const GenerateResults = async (req, res) => {
  try {
    const user = req.body.userId;
    const rubricsCheck=req.body.rubricsCheck;
    const allPapers = await Paper.find({ createdBy: user });
    
    


    const apiKey = process.env.GEMINI_API;
    const genAI = new GoogleGenerativeAI(apiKey);

    //tunedModels/generate-num-3435
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-flash",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };
    
    let rubricsString = [];

    if(rubricsCheck){

     const allRubrics = await Rubric.find({ createdBy: user });

    // Convert rubrics to a structured format
       rubricsString = allRubrics.map((rubric) => ({
      questionNo: rubric.questionNo,
      question: rubric.question,
      weightage: rubric.weightage,
      keywords: rubric.keywords,
      answer: rubric.answer,
    }));

    }

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
          result: result, // Store the evaluated result properly
          paperText: paper.paperText, // Added missing assignment
          submittedAnswerImage: paper.submittedAnswerImages, // Keep original base64
        };
      })
    );

    // Remove previous papers from the same creator
    await Paper.deleteMany({ createdBy: user });

    
    // Insert newly processed papers
    await Paper.insertMany(processedPapers);

    const Prospapers = processedPapers.map((paper) => ({
      studentName: paper.studentName,
      questionNo: paper.questionNo,
      result: paper.result,
      paperText: paper.paperText,
    }));

    // Generate final results
    await FinalResult(model,generationConfig,Prospapers,user);

    res.status(200).json({ message: "Results generated successfully", processedPapers });
  } catch (error) {
    console.error("Error generating results:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


async function FinalResult(model,generationConfig,papers,userId) {
  try {
    // Start the chat session
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
    const prompt = `
    Generate a structured JSON array containing the mark sheet details for all students based on the provided answers and do not add any notes or instructions from yourself, just return a JSON array.
    
    Input Data:
    ${JSON.stringify(papers)}
    
    Expected JSON Output Format:
    [
        {
            "name": "Student Name",
            "totalMarks": Total weightage Marks,
            "obtainMarks": Total  Obtain  Student Marks,
            "attemptedQuestions": Total Questions Attempted,
            "scores": [
                {
                    "question": Question Number,
                    "score": Score Awarded,
                    "correctness": "Yes/No"
                }
            ],
            "missingPoints": ["List of missing points per question"],
            "wrongPoints": ["List of wrong points per question"],
            "fullAnswers": [
                {
                    "question": Question Number,
                    "answer": "Full Question and  answer provided by the student all the text which is in paperText"
                }
            ]
        }
    ]
    
    Ensure the response is **valid JSON only** without extra symbols, formatting characters, or explanations.
    `;
       

    // Send the prompt
    const result = await chatSession.sendMessage(prompt);

    // Log the candidates array directly to inspect its structure
    if (result ) {
      
      const resultText = result.response.text().trim();
      const cleanedJSON = resultText.replace(/```json|```/g, "").trim();
      const parsedData = JSON.parse(cleanedJSON);

      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Mark Sheet",
                    bold: true,
                    size: 44,
                    
                  }),
                ],
                spacing: { after: 500 },
                alignment: AlignmentType.CENTER,
              }),

              new Paragraph({
                text: "Summary Table:",
                bold: true,
                size: 30,
                spacing: { after: 300 },
              }),

              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            text: "Student Name",
                            bold: true,
                            size: 24,
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            text: "Total Marks",
                            bold: true,
                            size: 24,
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            text: "Obtain Marks",
                            bold: true,
                            size: 24,
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            text: "Questions Attempted",
                            bold: true,
                            size: 24,
                          }),
                        ],
                      }),
                    ],
                  }),
                  ...parsedData.map(
                    (student, index) =>
                      new TableRow({
                        children: [
                          new TableCell({
                            children: [new Paragraph(student.name)],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph(student.totalMarks.toString()),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph(student.obtainMarks.toString()),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph(
                                student.attemptedQuestions.toString()
                              ),
                            ],
                          }),
                        ],
                        shading: index % 2 === 0 ? { fill: "E8E8E8" } : {},
                      })
                  ),
                ],
              }),

              ...parsedData.flatMap((student) => [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `\nStudent Name: ${student.name}`,
                      bold: true,
                      size: 24,
                      
                    }),
                  ],
                  spacing: { before: 400, after: 200 },
                }),

                new Table({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  rows: [
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph({
                              text: "Question No",
                              bold: true,
                              size: 22,
                            }),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              text: "Score",
                              bold: true,
                              size: 22,
                            }),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              text: "Correctness",
                              bold: true,
                              size: 22,
                            }),
                          ],
                        }),
                      ],
                    }),
                    ...student.scores.map(
                      (score, index) =>
                        new TableRow({
                          children: [
                            new TableCell({
                              children: [
                                new Paragraph(score.question.toString()),
                              ],
                            }),
                            new TableCell({
                              children: [new Paragraph(score.score.toString())],
                            }),
                            new TableCell({
                              children: [new Paragraph(score.correctness)],
                            }),
                          ],
                          shading: index % 2 === 0 ? { fill: "F5F5F5" } : {},
                        })
                    ),
                  ],
                }),
                
                new Paragraph({
                  text: `Total Questions Attempted: ${student.attemptedQuestions}`,
                  size: 24,
                  bold: true,
                  spacing: { after: 300 },
                }),

                new Paragraph({
                  text: "\nMissing Points:",
                  bold: true,
                  size: 22,
                }),
                ...student.missingPoints.map(
                  (point) =>
                    new Paragraph({
                      text: point || "-",
                      size: 20,
                      spacing: { after: 100 },
                    })
                ),

                new Paragraph({
                  text: "\nWrong Points:",
                  bold: true,
                  size: 22,
                }),
                ...student.wrongPoints.map(
                  (point) =>
                    new Paragraph({
                      text: point || "-",
                      size: 20,
                      spacing: { after: 100 },
                    })
                ),

                

                new Paragraph({
                  text: "\nFull Answers:",
                  bold: true,
                  size: 26,
                  spacing: { after: 200 },
                }),
               
                ...student.fullAnswers.flatMap((answer) => [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `Image Text`,
                        bold: true,
                        size: 22,
                      }),
                    ],
                    spacing: { after: 200 },
                  }),
                  new Paragraph({
                    text: answer.answer,
                    size: 20,
                    indent: { left: 720 },
                    spacing: { after: 300 },
                  }),
                ]),
               
              ]),
            ],
          },
        ],
      });

      //delete previous result from the same creator
      await Result.deleteMany({ createdBy: userId });

      Packer.toBuffer(doc).then(async (buffer) => {
        try {
          const newFile = new Result({
             createdBy:userId,
            file: {
              data: buffer,
              contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            },
          });
      
          await newFile.save();
          console.log("Mark sheet saved to MongoDB successfully!");
        } catch (error) {
          console.error("Error saving file to MongoDB:", error);
        }
      });
      console.log( "file created");
    } else {
      console.error("No valid response from the model.");
    }

  } catch (error) {
    console.error("Error:", error);
  }
}


const getResult = async (model, generationConfig, text, rubrics) => {
  try {
    // Start the chat session
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const prompt = `
**Rubric-Based Assessment – Strict Matching**

**Instructions:**

1. **Match the rubric**:
   - Find the matching rubric using the "questionNo" or "question".
   - If matched, proceed to rubric-based evaluation. If not, use general knowledge.

2. **If a matching rubric exists**:
   - ✅ Evaluate strictly using the rubric’s **expected answer** or **keywords**.
   - ✅ Allow minor phrasing variations that don’t alter meaning.
   - ❌ Do NOT add extra points beyond what the rubric specifies.
   - ❌ Do NOT use external knowledge to infer missing content.
   - ❌ If the answer is for a different question than the rubric, mark it **incorrect**.

3. **If no rubric exists**:
   - Evaluate using general knowledge, scoring **out of 5** per question.
   - Reward correct and partially correct answers generously.

4. **Evaluation principles**:
   - Avoid penalizing grammar or minor wording issues.
   - Only deduct for major errors or missing key points.
   - Provide structured, focused feedback on key issues only.
   - if the answer is not related to the question, mark it as **incorrect**.
   - If the answer is partially correct, mark it as **partially correct**.

---

### **Student Answer:**  
[${text}]  

### **Rubric Data:**  
\`\`\`  
${rubrics}  
\`\`\`  

---

### **Evaluation Output:**  
- **Score (out of total):** [Rubric-based or general score out of 5 per question]  
- **Correct Answer Check:** [Yes / Partially Correct / No]  
- **Missing Points:** [Only if explicitly required by rubric]  
- **Wrong Points:** [Only if contradicts rubric; ignore minor issues]

---

**Important Reminders:**  
✅ Strictly follow the rubric when it exists.  
✅ Allow slight rewording if meaning is preserved.  
✅ Use general knowledge only when rubric doesn't apply.  
✅ No extra deductions for minor or stylistic errors.

**Deliver a fair, clear, and rubric-aligned assessment.**
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
