import React, { useState } from "react";
import UploadFiles from "../components/UploadFiles";
import RubricEditer from "../components/RubricEditer";
import DocxViewer from "../components/DocxViewer";

export default function Dashboard() {
  const [rubicAdd, setRubicAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  
  return (
    <section className="text-gray-700 body-font bg-gray-100 min-h-screen">
      <div className="container px-5 py-16 mx-auto">
        <div className="flex flex-col text-center w-full mb-12">
          <h1 className="sm:text-4xl text-3xl font-semibold title-font mb-4 text-gray-900">
            Automated Answer Sheet Assessment System
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-lg">
            Evaluate handwritten papers efficiently with our advanced tool. Upload your handwritten text images, and let our system analyze and provide accurate results instantly.
            <span className="text-red-600 font-medium">
              {" "}
              Kindly Follow the Upload Rules and Guidelines.
            </span>
          </p>
        </div>

        <UploadFiles />

        <section className="mt-16">
          <div className="container mx-auto">
            <div className="lg:w-2/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto bg-white p-6 rounded-lg shadow-md">
              <h1 className="flex-grow sm:pr-16 text-xl font-medium title-font text-gray-800">
                Click the button to add a rubric for question-based evaluation,
                or we will evaluate based on overall LLM understanding.
              </h1>
              <button
                className="flex-shrink-0 text-white bg-indigo-600 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-700 rounded-lg text-lg"
                onClick={() => setRubicAdd(!rubicAdd)}
              >
                Add Rubric
              </button>
            </div>
          </div>
        </section>

        {rubicAdd && (
          <div className="mt-10">
            <RubricEditer setCheck={setRubicAdd} check={rubicAdd} />
          </div>
        )}

        <div className="mt-12">
          <button
            className="flex mx-auto justify-center text-white bg-indigo-600 border-0 py-3 px-10 focus:outline-none hover:bg-indigo-700 rounded-lg text-lg shadow-md"
            onClick={() => setLoading(!loading)}
          >
            Evaluate
          </button>
        </div>
        {loading && <DocxViewer/>}
        
      </div>
    </section>
  );
}
