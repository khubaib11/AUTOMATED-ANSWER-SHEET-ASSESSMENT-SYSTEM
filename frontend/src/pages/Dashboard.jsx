import React, { useState, useEffect } from "react";
import UploadFiles from "../components/UploadFiles";
import RubricEditer from "../components/RubricEditer";
import DocxViewer from "../components/DocxViewer";
import { signOutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import { set } from "mongoose";

export default function Dashboard() {
  const { currentUser } = useSelector((state) => state.user); // Adjust to your Redux-persist structure
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rubricData, setRubricData] = useState({});
  const [rubricAdd, setRubricAdd] = useState(false);
  const [rubricCount, setRubricCount] = useState(0);
  const [rubricsQuestions, setRubricsQuestions] = useState("");
  const [qData, setQData] = useState({});
  const [imagesData, setImagesData] = useState({});
  const [loading, setLoading] = useState(false);
  const [evaluated, setEvaluated] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showDoc, setShowDoc] = useState(false);

  const rubricSned = async () => {
    if (rubricAdd && rubricsQuestions > 0 && rubricData) {
      const userId = currentUser._id;

      // Prepare rubric data for the request
      const rubricPayload = Object.entries(rubricData).map(([key, value]) => {
        return {
          createdBy: userId,
          question: value.question,
          weightage: parseFloat(value.weightage), // Ensure weightage is a number
          keywords: value.keywords,
          answer: value.answer,
          questionNo: value.id || 0, // Ensure questionNo is a number
        };
      });

      try {
        // Send rubric data to the backend
        const response = await fetch("api/rubric/addrubric", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rubricData: rubricPayload }), // Match the expected structure
        });

        const result = await response.json();

        if (response.ok) {
          console.log("Rubric added successfully:", result);
        } else {
          console.error("Failed to add rubric:", result.message);
        }
      } catch (error) {
        console.error("Error occurred while adding rubric:", error);
      }
    }
  };

  const handleEvaluated = async () => {
    if (evaluated) {
      setLoading(true);
      setEvaluated(false);
      setProgress(0);

      console.log(rubricData);
      console.log(imagesData);
    }
    await rubricSned();
  };

  // Handle number input with validation
  const handleNumberChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setRubricsQuestions(value);
    } else {
      setRubricsQuestions(""); // Reset on invalid input
    }
  };

  const openRubrics = () => {
    if (rubricsQuestions > 0) {
      setRubricAdd(true);
      setRubricCount(rubricsQuestions);
    } else {
      alert("Please enter a valid number of questions!");
    }
  };

  // Update qData and ensure rubricData aligns with it
  useEffect(() => {
    setRubricData({});
    setQData({});
  }, [rubricsQuestions]);

  useEffect(() => {
    // Merge qData with rubricData or arrange based on question index
    setRubricData((prevData) => ({
      ...prevData,
      ...qData, // Merging the new data with the existing data
    }));
  }, [qData]);

  // User session verification
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch("api/user/verifyuser");
        if (response.status === 200) {
          console.log("User Verified");
        } else {
          alert("Your Session has expired, Please Login Again");
          dispatch(signOutSuccess());
          navigate("/signin");
        }
      } catch (error) {
        console.error("Network or server error:", error);
      }
    };

    verifyUser();
  }, [dispatch, navigate]);

  // Progress bar simulation
  useEffect(() => {
    let interval;

    if (loading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const nextProgress = prev + 10;
          if (nextProgress >= 100) {
            clearInterval(interval);
            setProgress(100);
            setLoading(false);
            setShowDoc(true);
          }
          return Math.min(nextProgress, 100);
        });
      }, 500);
    }

    return () => clearInterval(interval); // Cleanup interval
  }, [loading]);

  return (
    <section className="text-gray-700 body-font bg-gray-50 min-h-screen">
      <div className="container px-5 py-16 mx-auto">
        {/* Header */}
        <div className="flex flex-col text-center w-full mb-12">
          <h1 className="sm:text-4xl text-3xl font-semibold title-font mb-4 text-gray-900">
            Automated Answer Sheet Assessment System
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-lg">
            Evaluate handwritten papers efficiently with our advanced tool.
            Upload your handwritten text images, and let our system analyze and
            provide accurate results instantly.
            <span className="text-red-600 font-medium">
              {" "}
              Kindly Follow the Upload Rules and Guidelines.
            </span>
          </p>
        </div>

        {/* File Upload */}
        <UploadFiles
          setEvaluated={setEvaluated}
          setLoading={setLoading}
          setShowDoc={setShowDoc}
          setImagesData={setImagesData}
        />

        {/* Rubric Section */}
        <section className="mt-16">
          <div className="container mx-auto">
            <div className="lg:w-2/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto bg-gray-50 border-2 p-6 rounded-lg shadow-md">
              <h1 className="flex-grow sm:pr-16 text-xl font-medium title-font text-gray-800">
                Click the button to add a rubric for question-based evaluation,
                or we will evaluate based on overall LLM understanding.
              </h1>
              <button
                className="flex-shrink-0 text-white bg-gray-600 border-0 py-2 px-6 focus:outline-none hover:bg-gray-900 rounded-lg  m-2 text-lg"
                onClick={() => setRubricAdd(!rubricAdd)}
              >
                Add Rubric
              </button>
            </div>
          </div>
        </section>

        {rubricAdd && (
          <div className="mt-10 flex flex-col items-center">
            {/* Input Section */}
            <div className="w-full sm:w-1/2 flex flex-col sm:flex-row gap-4 items-start">
              <label
                htmlFor="questions-field"
                className="leading-7 text-sm text-gray-600 self-start w-full sm:w-1/4"
              >
                Number of Questions
              </label>
              <input
                type="number"
                id="questions-field"
                name="questions-field"
                placeholder="Enter number of questions"
                min="1"
                className="w-full sm:w-2/3 bg-gray-100 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-gray-700 py-2 px-4"
                onChange={handleNumberChange}
                value={rubricsQuestions}
              />
              <button
                className="w-full sm:w-1/3 bg-gray-600 text-white py-2 px-6 rounded hover:bg-gray-900"
                onClick={openRubrics}
              >
                Open Question
              </button>
            </div>

            {/* Rubric Editor */}
            <div className="mt-6 w-full sm:w-1/2">
              {rubricCount > 0 &&
                Array.from({ length: rubricCount }, (_, index) => (
                  <div
                    key={index}
                    className="mb-6 p-4 border rounded-lg bg-gray-50 shadow-md"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Question {index + 1}
                    </h3>

                    <RubricEditer id={index + 1} setQData={setQData} />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Evaluate Button */}
        <div className="mt-12">
          <button
            className={`flex mx-auto text-white bg-gray-700 py-3 px-10 rounded-lg ${
              !evaluated ? "cursor-not-allowed opacity-50" : "hover:bg-gray-950"
            }`}
            onClick={handleEvaluated}
            disabled={!evaluated}
          >
            Evaluate
          </button>
        </div>

        {/* Progress Bar */}
        {loading ? (
          <div className="flex flex-col text-center w-full mt-4">
            <h1 className="text-xl font-medium title-font text-gray-900">
              Processing...
            </h1>
            <div className="relative pt-2 w-3/4 sm:w-1/2 mx-auto">
              <div className="overflow-hidden h-2 mb-4 text-xs rounded bg-gray-200">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-full bg-indigo-500"
                ></div>
              </div>
              <p className="text-sm text-gray-700">{progress}% Completed</p>
            </div>
          </div>
        ) : showDoc ? (
          <DocxViewer />
        ) : null}
      </div>
    </section>
  );
}
