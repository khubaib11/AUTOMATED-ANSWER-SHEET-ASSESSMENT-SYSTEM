import React, { useState, useEffect } from "react";
import { Editor } from "primereact/editor";

export default function RubricEditor({setQData,id}) {
  const defaultText = `Instruction: 
Provide an example answer for the question.

• Write a detailed and accurate example answer for the question.
• Ensure the example answer is structured properly, with clear headings, sections, or steps where necessary.
• Focus on key concepts, methods, and critical points that should be included in a student's ideal response.
• Make sure the example answer aligns with the learning objectives or evaluation criteria for the question.`;

  const [data, setData] = useState({
    question: "",
    weightage: 0,
    keywords: "",
    answer: "",
  });
  const [keywordString, setKeywordString] = useState("");
  const [text, setText] = useState("");
  const [keyword, setKeyword] = useState("");
  const [question, setQuestion] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [addAnswer, setAddAnswer] = useState(false);
  const [editRubric, setEditRubric] = useState(false);
  const [submit, setSubmit] = useState(false);

  const renderHeader = () => (
    <span className="ql-formats">
      <button className="ql-bold" aria-label="Bold"></button>
      <button className="ql-italic" aria-label="Italic"></button>
      <button className="ql-underline" aria-label="Underline"></button>
    </span>
  );

  const header = renderHeader();


  const handleAddKeyword = () => {
    if (keyword.trim() !== "") {
      setKeywords([...keywords, keyword]);
      setKeyword("");
    }
  };

  const handleRemoveKeyword = (indexToRemove) => {
    setKeywords(keywords.filter((_, index) => index !== indexToRemove));
  };

  const handleCancel = () => {
    setEditRubric(false);
  };

  const handleSubmit = () => {
    setKeywordString(keywords.join(", "));
    setData({
      question,
      weightage: data.weightage,
      keywords: keywordString,
      answer: text,
    });
    if(setData.question === ""){
      return;
    }
    setSubmit(true);
    setQData({ ["Question"+id]: data });
    setEditRubric(false);
  };

  useEffect(() => {
    setKeywordString(keywords.join(", "));
    setData({
      question,
      weightage: data.weightage,
      keywords: keywordString,
      answer: text,
    });
  }, [keywords, text, question,keywordString]);

  // To log data after it updates
  // useEffect(() => {
  //   if (submit) {
  //     console.log(data);
  //   }
  // }, [submit]);

  return (
    <div className="flex flex-col items-center bg-gray-100 p-2 sm:p-6">
      <div className="card w-full bg-white rounded-lg shadow-md p-4">
        {!editRubric ? (
          <div className="bg-gray-100 border border-gray-300 p-6 rounded-lg shadow-sm flex items-center justify-between">
            <h4 className="text-md font-medium text-gray-700">
              {(data.question && data.weightage > 0 || data.keywords.length > 0 || data.answer) 
                ? "Rubric Added Successfully"
                : " No Rubric Added for this Question"}
            </h4>
            <button
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-all"
              onClick={() => {setEditRubric(true)
                setSubmit(false)  
              }}
            >
              Edit
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center sm:text-left">
              Rubric Editor
            </h2>

            {/* Weightage Input */}
            <div className="w-full flex flex-col space-y-4">

              <label
                htmlFor="question"
                className="text-lg font-medium text-gray-600 text-center sm:text-left"
              >
                Required:  Question *
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <input
                  type="text"
                  id="question"
                  name="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter the question"
                  className="w-full sm:w-auto sm:flex-1 bg-gray-100 rounded border border-gray-300 focus:ring-2 focus:ring-gray-300 focus:border-gray-500 text-gray-700 py-2 px-4"
                />
              </div>


              <label
                htmlFor="weightage"
                className="text-lg font-medium text-gray-600 text-center sm:text-left"
              >
                Weightage Marks for this Question
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <input
                  type="number"
                  id="weightage"
                  name="weightage"
                  min={0}
                  value={data.weightage}
                  onChange={(e) =>
                    setData({ ...data, weightage: e.target.value })
                  }
                  placeholder="Enter the marks"
                  className="w-full sm:w-auto sm:flex-1 bg-gray-100 rounded border border-gray-300 focus:ring-2 focus:ring-gray-300 focus:border-gray-500 text-gray-700 py-2 px-4"
                />
              </div>
            </div>

            {/* Keywords Input */}
            <div className="w-full flex flex-col space-y-4 mt-4">
              <label
                htmlFor="keywords"
                className="text-lg font-medium text-gray-600 text-center sm:text-left"
              >
                Keywords for Assessing
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <input
                  type="text"
                  id="keywords"
                  name="keywords"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Enter the keyword"
                  className="w-full sm:w-auto sm:flex-1 bg-gray-100 rounded border border-gray-300 focus:ring-2 focus:ring-gray-300 focus:border-gray-500 text-gray-700 py-2 px-4"
                />
                <button
                  onClick={handleAddKeyword}
                  className="bg-gray-600 text-white py-2 px-6 rounded hover:bg-gray-800 transition-all"
                >
                  Add
                </button>
              </div>

              {/* Display Added Keywords */}
              <ul className="list-none flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                {keywords.length > 0 ? (
                  keywords.map((kw, index) => (
                    <li
                      key={index}
                      className="bg-gray-200 rounded-full px-4 py-1 flex items-center gap-2 hover:bg-red-100 transition-all"
                    >
                      <span className="text-gray-700">{kw}</span>
                      <button
                        onClick={() => handleRemoveKeyword(index)}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        &#10005;
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 italic text-center">
                    No keywords added yet.
                  </p>
                )}
              </ul>
            </div>

            {/* Question Section */}
            <div className="mt-8 bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Optional: Enter the Question Answer
              </h3>
              <button
                className="bg-gray-600 text-white py-2 px-6 rounded hover:bg-gray-800 transition-all"
                onClick={() => setAddAnswer(!addAnswer)}
              >
                Add Answer
              </button>
            </div>

            {/* Add Editor */}
            {addAnswer && (
              <div className="mt-8">
                <Editor
                  value={text}
                  placeholder={defaultText}
                  onTextChange={(e) => setText(e.htmlValue)}
                  headerTemplate={header}
                  className="w-full h-60"
                  style={{ overflow: "auto" }} // Allows scrolling if text overflows
                />
              </div>
            )}

            {/* Buttons */}
            <div className="pt-10 mt-6 flex flex-col sm:flex-row gap-4 justify-center sm:justify-between">
              <button
                className="bg-gray-600 text-white py-2 px-6 rounded hover:bg-gray-800 transition-all"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="bg-gray-600 text-white py-2 px-6 rounded hover:bg-gray-800 transition-all"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
