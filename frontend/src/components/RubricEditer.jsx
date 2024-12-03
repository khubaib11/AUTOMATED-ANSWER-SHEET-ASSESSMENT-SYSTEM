import React, { useState } from "react";
import { Editor } from "primereact/editor";

export default function RubricEditer({ setCheck, check }) {
  const defaultText = `<div>
    <b>Instruction:</b> 
    Mention the question first, then write its rubrics below.
</div>
<div>
    <ul>
        <li>Clearly state the question at the top.</li>
        <li>Provide detailed rubrics, breaking them into specific components (e.g., format, content, grammar, etc.).</li>
        <li>For each rubric, mention the maximum score and criteria for full marks.</li>
        <li>If applicable, add examples or sample answers for clarity.</li>
        <li>Ensure that the rubrics align with the learning outcomes or objectives of the question.</li>
    </ul>
</div>
<div><br></div>`;
  const [text, setText] = useState(defaultText);

  const renderHeader = () => {
    return (
      <span className="ql-formats">
        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>
      </span>
    );
  };

  const header = renderHeader();

  return (
    <div className="card flex flex-col justify-center items-center h-auto space-y-6">
      {/* Editor */}
      <Editor
        value={text}
        onTextChange={(e) => setText(e.htmlValue)}
        headerTemplate={header}
        className="w-full sm:w-3/5 h-60" // Responsive width
      />

      {/* Buttons */}
      <div className="pt-9 w-full flex justify-center space-x-4">
        <button
          className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
          onClick={() => {
            setText(defaultText);
            setCheck(false);
          }}
        >
          Cancel
        </button>
        <button
          className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
          onClick={() => {
            setText(text);
            console.log(text);
            setCheck(false);
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
