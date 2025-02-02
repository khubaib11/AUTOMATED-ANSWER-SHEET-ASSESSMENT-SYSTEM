import Paper from '../models/paper.model.js';

const paperAdd = async (req, res) => {
  const papers = req.body; //remove previous data from same creator
  await Paper.deleteMany({ createdBy: papers[0].createdBy });

  try {
   

    // Ensure data is in the correct format
    const formattedPapers = papers.map(paper => ({
      createdBy: paper.createdBy,
      studentName: paper.studentName,
      questionNo: paper.questionNo,
      result: paper.result,
      submittedAnswerImage: Buffer.from(paper.submittedAnswerImage), // Convert array of numbers back to Buffer
    }));

    // Save to database (assuming you have a Paper model)
    await Paper.insertMany(formattedPapers);

    res.status(201).json({ message: "Papers added successfully!" });
  } catch (error) {
    console.error("Error saving papers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { paperAdd };
