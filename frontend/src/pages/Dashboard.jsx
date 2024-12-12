import React, { useState,useEffect } from "react";
import UploadFiles from "../components/UploadFiles";
import RubricEditer from "../components/RubricEditer";
import DocxViewer from "../components/DocxViewer";
import {signOutSuccess} from "../redux/user/userSlice";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rubicAdd, setRubicAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [evaluated, setEvaluated] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showDoc, setShowDoc] = useState(false);


  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch("api/user/verifyuser");
        if (response.status === 200) {
          console.log("User Verified");
        } else if (response.status === 401) {
          alert("Your Session has expired, Please Login Again");
          dispatch(signOutSuccess());
          navigate("/signin");
        } else {
          console.error("Error verifying user");
        }
      } catch (error) {
        console.error("Network or server error:", error);
      }
    };
  
    verifyUser();
  }, [dispatch, navigate]);

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

    return () => clearInterval(interval); // Cleanup interval on unmount or loading state change
  }, [loading]);
  return (
    <section className="text-gray-700 body-font bg-gray-100 min-h-screen">
      <div className="container px-5 py-16 mx-auto">
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

        <UploadFiles setEvaluated={setEvaluated}setLoading={setLoading} setShowDoc={setShowDoc} />

        <section className="mt-16">
          <div className="container mx-auto">
            <div className="lg:w-2/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto bg-white p-6 rounded-lg shadow-md">
              <h1 className="flex-grow sm:pr-16 text-xl font-medium title-font text-gray-800">
                Click the button to add a rubric for question-based evaluation,
                or we will evaluate based on overall LLM understanding.
              </h1>
              <button
                className="flex-shrink-0 text-white bg-gray-600 border-0 py-2 px-6 focus:outline-none hover:bg-gray-900 rounded-lg text-lg"
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
            className={`flex mx-auto justify-center text-white bg-gray-700 border-0 py-3 px-10 focus:outline-none ${
              !evaluated ? "cursor-not-allowed opacity-50" : "hover:bg-gray-950"
            } rounded-lg text-lg shadow-md`}
            onClick={() => {
              if (evaluated) {
                setLoading(true);
                setEvaluated(false);
                setProgress(0);
              }
            }}
            disabled={!evaluated}
          >
            Evaluate
          </button>
        </div>
        {loading ? (
        <div className="flex flex-col text-center w-full mt-4">
          <h1 className="text-xl font-medium title-font text-gray-900">Processing...</h1>
          <div className="relative pt-2 w-3/4 sm:w-1/2 mx-auto">
            <div className="flex justify-between text-xs text-gray-600">
              <span>0%</span>
              <span>100%</span>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
              ></div>
            </div>
            <p className="text-sm text-gray-700">{progress}% Completed</p>
          </div>
        </div>
      ) : (showDoc? <DocxViewer />:null
      )}
      </div>
    </section>
  );
}
