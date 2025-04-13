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
                  text: `\nTotal Marks: ${student.totalMarks}`,
                  size: 24,
                  bold: true,
                  spacing: { after: 300 },
                }),
                new Paragraph({
                  text: `\nObtain Marks: ${student.totalMarks}`,
                  size: 24,
                  bold: true,
                  spacing: { after: 300 },
                }),
                new Paragraph({
                  text: `Total Questions Attempted: ${student.attemptedQuestions}`,
                  size: 24,
                  bold: true,
                  spacing: { after: 300 },
                }),

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
    **Rubric-Based Assessment System – Strict Matching**  
    
    **Instructions:**  
    
    1. **Find the correct rubric** by matching the student's question with the "questionNo" or "question" field.  
       - If the question matches the rubric's question or number, proceed to step 2.
    2. **If a matching rubric is found, ONLY evaluate based on it.**
       - ✅ **Strictly check for the rubric's keywords and expected answer.**  
       - ❌ **Do NOT add extra missing points or use external knowledge.**
    3. **If no rubric exists for the question, use your general knowledge to evaluate the answer fairly out of 5 for each question .** 
       - If the rubric doesn’t match the question, treat the answer as a new question and apply general knowledge.
    4. **Reward correctness and partial correctness generously.**  
       - Small phrasing differences that don’t change the meaning should not affect the score.
       - If a student has a correct overall idea but minor phrasing differences, still consider it correct.
    
    ---
    
    ### **Student Answer:**  
    [${text}]  
    
    ### **Available Rubric Data:**  
    \`\`\`  
    ${rubrics}  
    \`\`\`  
    
    ---
    
    ### **Evaluation Process:**  
    - **Step 1:** Check if the rubric matches the question.  
       - ✅ If the rubric question or number matches the student's question, proceed with rubric-based evaluation.
       - ❌ If the rubric doesn't match, use general knowledge to evaluate the answer.  
    - **Step 2:**  
       - ✅ **If a matching rubric exists:**  
         - Check if the student’s answer includes the rubric’s **expected answer** or **keywords**.
         - If the student's answer contains the expected answer or keywords, mark it **correct**.
         - If the student’s answer partially matches, give partial credit based on how much of the rubric is covered.
       - ❌ **If no rubric exists:**  
         - Use general knowledge and score fairly out of **5**, based on how correct or reasonable the answer is.
    - **Step 3:** Avoid unnecessary deductions. Only focus on major mistakes or inconsistencies.  
    - **Step 4:** Provide structured feedback, focusing only on key errors. Avoid being overly critical of small mistakes.
    
    ---
    
    ### **Expected Deliverables:**  
    - **Score (out of total):** [If rubric exists, use the rubric-based score. If not, provide a fair score out of 5 for each wuestion.]  
    - **Correct Answer Check:** [Yes /Partially Correct/ No / ]  
    - **Missing Points:** [List missing points only if they are explicitly required by the rubric.]
    - **Wrong Points:** [Only list if the answer contradicts the rubric. Do not nitpick minor errors.]  
    
    ---
    
    ### **Important Notes:**  
    ✅ **Strictly follow the rubric if it exists. Do not add extra missing points.**  
    ✅ **If the answer includes the rubric’s expected answer or keywords, it is correct, even if the phrasing differs slightly.**  
    ✅ **Do NOT penalize small grammar mistakes or alternative phrasing.**  
    ✅ **If no rubric exists for the question, provide a reasonable score out of 5 for each wuestion using general knowledge.**  
    ✅ **If the rubric is for a different question, evaluate based on your knowledge.**  
    ✅ **If no rubric is provided, use general knowledge to evaluate the answer fairly.**
    
    **Provide a fair, structured, and concise assessment.**  
    
    ---
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
